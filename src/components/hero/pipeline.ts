/**
 * Pure (non-React) model of the hero's streaming pipeline: node layout, curved edges,
 * and a packet simulation that advances on the CPU and writes into typed arrays.
 * Kept out of the component so React never re-renders per frame.
 */
import {
  AdditiveBlending,
  BufferAttribute,
  BufferGeometry,
  Color,
  CubicBezierCurve3,
  CylinderGeometry,
  EdgesGeometry,
  IcosahedronGeometry,
  LineBasicMaterial,
  NormalBlending,
  OctahedronGeometry,
  ShaderMaterial,
  TorusGeometry,
  Vector3,
} from 'three';
import type { Blending } from 'three';

export type Stage = 'source' | 'stream' | 'process' | 'sink';

interface NodeDef {
  id: string;
  stage: Stage;
  pos: [number, number, number];
  /** Included in the lighter mobile/touch scene. */
  lite?: boolean;
}

// Loosely clustered in depth (z) rather than a flat left-to-right diagram.
const NODES: NodeDef[] = [
  { id: 's1', stage: 'source', pos: [-4.2, 1.35, -0.8], lite: true },
  { id: 's2', stage: 'source', pos: [-4.7, -0.1, 1.0] },
  { id: 's3', stage: 'source', pos: [-3.9, -1.55, -0.3], lite: true },
  { id: 'k1', stage: 'stream', pos: [-1.55, 0.6, 0.45], lite: true },
  { id: 'k2', stage: 'stream', pos: [-1.25, -0.95, -1.25] },
  { id: 'p1', stage: 'process', pos: [1.1, 1.05, -0.65], lite: true },
  { id: 'p2', stage: 'process', pos: [1.45, -0.55, 0.95], lite: true },
  { id: 'p3', stage: 'process', pos: [0.85, -1.85, -1.45] },
  { id: 'd1', stage: 'sink', pos: [3.95, 0.5, 0.2], lite: true },
  { id: 'd2', stage: 'sink', pos: [4.25, -1.2, -0.95] },
];

const EDGES: [string, string][] = [
  ['s1', 'k1'],
  ['s2', 'k1'],
  ['s2', 'k2'],
  ['s3', 'k2'],
  ['s3', 'k1'],
  ['k1', 'p1'],
  ['k1', 'p2'],
  ['k2', 'p2'],
  ['k2', 'p3'],
  ['p1', 'd1'],
  ['p2', 'd1'],
  ['p2', 'd2'],
  ['p3', 'd2'],
];

export interface Palette {
  teal: Color;
  blue: Color;
  amber: Color;
  blending: Blending;
  /** 1 = soft additive glow (dark), 0 = crisp discs (light). */
  soft: number;
  lineOpacity: number;
  nodeOpacity: number;
}

export const makePalette = (isDark: boolean): Palette =>
  isDark
    ? {
        teal: new Color('#2DD4BF'),
        blue: new Color('#5B8CFF'),
        amber: new Color('#F5B544'),
        blending: AdditiveBlending,
        soft: 1,
        lineOpacity: 0.32,
        nodeOpacity: 0.85,
      }
    : {
        // Light theme: darker ink variants with normal blending so they read on #F7F8FA.
        teal: new Color('#0B7A6D'),
        blue: new Color('#2F5BEA'),
        amber: new Color('#C98A12'),
        blending: NormalBlending,
        soft: 0,
        lineOpacity: 0.4,
        nodeOpacity: 0.9,
      };

/** Small deterministic PRNG so the layout is identical on every load. */
const mulberry32 = (seed: number) => () => {
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};

const LUT_SAMPLES = 64;

// ---------- Shaders ----------

const particleVertex = /* glsl */ `
  attribute float aSize;
  attribute float aAlpha;
  attribute float aAmber;
  uniform float uPixelRatio;
  uniform float uScale;
  uniform vec3 uTeal;
  uniform vec3 uBlue;
  uniform vec3 uAmber;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    // Events shift from teal (ingest) to blue (processed) as they move downstream.
    float k = smoothstep(-4.5, 4.5, position.x);
    vColor = mix(mix(uTeal, uBlue, k), uAmber, aAmber);
    vAlpha = aAlpha;
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = aSize * uPixelRatio * uScale / -mv.z;
  }
`;

const particleFragment = /* glsl */ `
  uniform float uOpacity;
  uniform float uSoft;
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float glow = pow(1.0 - d * 2.0, 1.8);
    float disc = smoothstep(0.5, 0.36, d);
    float a = mix(disc, glow, uSoft) * vAlpha * uOpacity;
    gl_FragColor = vec4(vColor, a);
    #include <colorspace_fragment>
  }
`;

const makePointsMaterial = (palette: Palette, pixelRatio: number, scale: number) =>
  new ShaderMaterial({
    vertexShader: particleVertex,
    fragmentShader: particleFragment,
    transparent: true,
    depthWrite: false,
    blending: palette.blending,
    uniforms: {
      uPixelRatio: { value: pixelRatio },
      uScale: { value: scale },
      uOpacity: { value: 1 },
      uSoft: { value: palette.soft },
      uTeal: { value: palette.teal.clone() },
      uBlue: { value: palette.blue.clone() },
      uAmber: { value: palette.amber.clone() },
    },
  });

// ---------- Pipeline ----------

export interface PipelineOptions {
  lite: boolean;
}

export interface NodeVisual {
  stage: Stage;
  position: Vector3;
  edges: EdgesGeometry;
  material: LineBasicMaterial;
  /** Process nodes get an orbiting ring. */
  ring?: { geometry: EdgesGeometry; material: LineBasicMaterial };
}

export const createPipeline = ({ lite }: PipelineOptions) => {
  const rand = mulberry32(41);

  const nodes = NODES.filter((n) => !lite || n.lite);
  const index = new Map(nodes.map((n, i) => [n.id, i]));
  const positions = nodes.map((n) => new Vector3(...n.pos));

  const edges = EDGES.filter(([a, b]) => index.has(a) && index.has(b)).map(([a, b]) => {
    const from = index.get(a)!;
    const to = index.get(b)!;
    const pa = positions[from];
    const pb = positions[to];
    const dx = (pb.x - pa.x) * 0.5;
    // A gentle S-curve with a deterministic out-of-plane bend.
    const bend = new Vector3(0, (rand() - 0.5) * 0.6, (rand() - 0.5) * 1.4);
    const curve = new CubicBezierCurve3(
      pa.clone(),
      pa.clone().add(new Vector3(dx, 0, 0)).add(bend),
      pb.clone().add(new Vector3(-dx, 0, 0)).add(bend),
      pb.clone(),
    );
    const pts = curve.getSpacedPoints(LUT_SAMPLES - 1);
    const lut = new Float32Array(LUT_SAMPLES * 3);
    pts.forEach((p, i) => p.toArray(lut, i * 3));
    return { from, to, lut, length: curve.getLength(), points: pts };
  });

  const outEdges: number[][] = nodes.map(() => []);
  edges.forEach((e, i) => outEdges[e.from].push(i));
  const sourceEdges = edges
    .map((e, i) => (nodes[e.from].stage === 'source' ? i : -1))
    .filter((i) => i >= 0);

  // ----- Edge lines (one geometry, vertex-coloured teal to blue) -----
  const palette0 = makePalette(true);
  const segCount = edges.reduce((s, e) => s + (e.points.length - 1), 0);
  const linePos = new Float32Array(segCount * 2 * 3);
  const lineMix = new Float32Array(segCount * 2);
  let o = 0;
  edges.forEach((e) => {
    for (let i = 0; i < e.points.length - 1; i++) {
      for (const p of [e.points[i], e.points[i + 1]]) {
        p.toArray(linePos, o * 3);
        lineMix[o] = Math.min(1, Math.max(0, (p.x + 4.5) / 9));
        o++;
      }
    }
  });
  const lineGeometry = new BufferGeometry();
  lineGeometry.setAttribute('position', new BufferAttribute(linePos, 3));
  lineGeometry.setAttribute('color', new BufferAttribute(new Float32Array(segCount * 2 * 3), 3));
  const lineMaterial = new LineBasicMaterial({
    vertexColors: true,
    transparent: true,
    depthWrite: false,
    opacity: palette0.lineOpacity,
  });

  // ----- Node outlines -----
  const nodeGeometries: Record<Stage, EdgesGeometry> = {
    source: new EdgesGeometry(new IcosahedronGeometry(0.2, 0)),
    // A partitioned log: open octagonal cylinder lying along the flow.
    stream: new EdgesGeometry(new CylinderGeometry(0.2, 0.2, 0.85, 8, 3, true).rotateZ(Math.PI / 2)),
    process: new EdgesGeometry(new OctahedronGeometry(0.28, 0)),
    // A datastore.
    sink: new EdgesGeometry(new CylinderGeometry(0.25, 0.25, 0.42, 12, 2)),
  };
  const ringGeometry = new EdgesGeometry(new TorusGeometry(0.44, 0.004, 3, 48));

  const nodeVisuals: NodeVisual[] = nodes.map((n, i) => ({
    stage: n.stage,
    position: positions[i],
    edges: nodeGeometries[n.stage],
    material: new LineBasicMaterial({ transparent: true, depthWrite: false }),
    ring:
      n.stage === 'process'
        ? { geometry: ringGeometry, material: new LineBasicMaterial({ transparent: true, depthWrite: false }) }
        : undefined,
  }));

  // ----- Packets (with short trails) -----
  const PACKETS = lite ? 34 : 96;
  const TRAIL = lite ? 4 : 5;
  const COUNT = PACKETS * TRAIL;
  const pEdge = new Int32Array(PACKETS);
  const pT = new Float32Array(PACKETS);
  const pSpeed = new Float32Array(PACKETS);
  const pAmber = new Uint8Array(PACKETS);

  const packetPos = new Float32Array(COUNT * 3);
  const packetSize = new Float32Array(COUNT);
  const packetAlpha = new Float32Array(COUNT);
  const packetAmber = new Float32Array(COUNT);

  for (let p = 0; p < PACKETS; p++) {
    pEdge[p] = Math.floor(rand() * edges.length);
    pT[p] = rand();
    pSpeed[p] = 0.7 + rand() * 0.9; // world units per second
    pAmber[p] = rand() < 0.02 ? 1 : 0; // the rare amber event
    for (let k = 0; k < TRAIL; k++) {
      const i = p * TRAIL + k;
      const fall = 1 - k / TRAIL;
      // World-space diameters; the shader converts to pixels with perspective.
      packetSize[i] = (pAmber[p] ? 0.11 : 0.08) * (0.35 + 0.65 * fall);
      packetAmber[i] = pAmber[p];
    }
  }

  const packetGeometry = new BufferGeometry();
  const posAttr = new BufferAttribute(packetPos, 3);
  const alphaAttr = new BufferAttribute(packetAlpha, 1);
  packetGeometry.setAttribute('position', posAttr);
  packetGeometry.setAttribute('aSize', new BufferAttribute(packetSize, 1));
  packetGeometry.setAttribute('aAlpha', alphaAttr);
  packetGeometry.setAttribute('aAmber', new BufferAttribute(packetAmber, 1));
  const packetMaterial = makePointsMaterial(palette0, 1, 1000);

  // ----- Node halos (pulse when a packet arrives) -----
  const haloPos = new Float32Array(nodes.length * 3);
  positions.forEach((p, i) => p.toArray(haloPos, i * 3));
  const haloSize = new Float32Array(nodes.length);
  const haloAlpha = new Float32Array(nodes.length).fill(0.35);
  const pulse = new Float32Array(nodes.length);
  const haloGeometry = new BufferGeometry();
  haloGeometry.setAttribute('position', new BufferAttribute(haloPos, 3));
  const haloSizeAttr = new BufferAttribute(haloSize, 1);
  haloGeometry.setAttribute('aSize', haloSizeAttr);
  haloGeometry.setAttribute('aAlpha', new BufferAttribute(haloAlpha, 1));
  haloGeometry.setAttribute('aAmber', new BufferAttribute(new Float32Array(nodes.length), 1));
  const haloMaterial = makePointsMaterial(palette0, 1, 1000);

  const sample = (edge: number, t: number, out: Float32Array, at: number) => {
    const lut = edges[edge].lut;
    const f = Math.min(Math.max(t, 0), 1) * (LUT_SAMPLES - 1);
    const i = Math.min(Math.floor(f), LUT_SAMPLES - 2);
    const r = f - i;
    const a = i * 3;
    const b = a + 3;
    out[at] = lut[a] + (lut[b] - lut[a]) * r;
    out[at + 1] = lut[a + 1] + (lut[b + 1] - lut[a + 1]) * r;
    out[at + 2] = lut[a + 2] + (lut[b + 2] - lut[a + 2]) * r;
  };

  const writePackets = () => {
    for (let p = 0; p < PACKETS; p++) {
      const e = pEdge[p];
      const gap = 0.11 / edges[e].length; // trail spacing in world units
      for (let k = 0; k < TRAIL; k++) {
        const i = p * TRAIL + k;
        const t = pT[p] - k * gap;
        sample(e, t, packetPos, i * 3);
        // Hide trail points that would sit behind the start node; ease in/out at the ends.
        const edgeFade = t < 0 ? 0 : Math.min(1, t * 12, (1 - t) * 12 + 0.25);
        packetAlpha[i] = (1 - k / TRAIL) * edgeFade;
      }
    }
    posAttr.needsUpdate = true;
    alphaAttr.needsUpdate = true;
  };

  const writeHalos = () => {
    for (let n = 0; n < nodes.length; n++) {
      const base = nodes[n].stage === 'process' ? 0.5 : 0.38;
      haloSize[n] = base * (1 + 0.55 * pulse[n]);
    }
    haloSizeAttr.needsUpdate = true;
  };

  writePackets();
  writeHalos();

  /** Advance the simulation. `dt` in seconds. */
  const step = (dt: number) => {
    for (let p = 0; p < PACKETS; p++) {
      const e = pEdge[p];
      pT[p] += (pSpeed[p] * dt) / edges[e].length;
      if (pT[p] >= 1) {
        const arrived = edges[e].to;
        pulse[arrived] = 1;
        const next = outEdges[arrived];
        // Continue downstream; at a sink, re-enter from a source.
        pEdge[p] =
          next.length > 0
            ? next[Math.floor(rand() * next.length)]
            : sourceEdges[Math.floor(rand() * sourceEdges.length)];
        pT[p] = 0;
      }
    }
    const decay = Math.exp(-dt * 3.2);
    for (let n = 0; n < nodes.length; n++) pulse[n] *= decay;
    writePackets();
    writeHalos();
  };

  /** Apply theme colours to every material. */
  const setPalette = (pal: Palette) => {
    const c = new Color();
    const colors = lineGeometry.getAttribute('color') as BufferAttribute;
    for (let i = 0; i < lineMix.length; i++) {
      c.copy(pal.teal).lerp(pal.blue, lineMix[i]);
      colors.setXYZ(i, c.r, c.g, c.b);
    }
    colors.needsUpdate = true;
    lineMaterial.blending = pal.blending;
    lineMaterial.needsUpdate = true;

    nodeVisuals.forEach((v) => {
      const k = Math.min(1, Math.max(0, (v.position.x + 4.5) / 9));
      v.material.color.copy(pal.teal).lerp(pal.blue, k);
      v.material.blending = pal.blending;
      v.material.needsUpdate = true;
      if (v.ring) {
        v.ring.material.color.copy(v.material.color);
        v.ring.material.blending = pal.blending;
        v.ring.material.needsUpdate = true;
      }
    });

    for (const m of [packetMaterial, haloMaterial]) {
      m.uniforms.uTeal.value.copy(pal.teal);
      m.uniforms.uBlue.value.copy(pal.blue);
      m.uniforms.uAmber.value.copy(pal.amber);
      m.uniforms.uSoft.value = pal.soft;
      m.blending = pal.blending;
      m.needsUpdate = true;
    }
  };

  /** Pixel ratio and projection scale ((canvas height / 2) / tan(fov / 2)) for point sizing. */
  const setViewport = (pixelRatio: number, scale: number) => {
    for (const m of [packetMaterial, haloMaterial]) {
      m.uniforms.uPixelRatio.value = pixelRatio;
      m.uniforms.uScale.value = scale;
    }
  };

  /** Global visibility, used to fade the scene out as the hero scrolls away. */
  const setFade = (fade: number, pal: Palette) => {
    lineMaterial.opacity = pal.lineOpacity * fade;
    nodeVisuals.forEach((v) => {
      v.material.opacity = pal.nodeOpacity * (0.35 + 0.65 * fade);
      if (v.ring) v.ring.material.opacity = pal.nodeOpacity * 0.5 * (0.35 + 0.65 * fade);
    });
    packetMaterial.uniforms.uOpacity.value = fade;
    haloMaterial.uniforms.uOpacity.value = (pal.soft ? 0.55 : 0.22) * fade;
  };

  const dispose = () => {
    lineGeometry.dispose();
    lineMaterial.dispose();
    Object.values(nodeGeometries).forEach((g) => g.dispose());
    ringGeometry.dispose();
    nodeVisuals.forEach((v) => {
      v.material.dispose();
      v.ring?.material.dispose();
    });
    packetGeometry.dispose();
    packetMaterial.dispose();
    haloGeometry.dispose();
    haloMaterial.dispose();
  };

  return {
    nodeVisuals,
    lineGeometry,
    lineMaterial,
    packetGeometry,
    packetMaterial,
    haloGeometry,
    haloMaterial,
    step,
    setPalette,
    setFade,
    setViewport,
    dispose,
  };
};

export type Pipeline = ReturnType<typeof createPipeline>;
