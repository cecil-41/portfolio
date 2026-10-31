import React, { useEffect, useMemo, useRef } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { MathUtils } from 'three';
import type { Group, LineSegments, PerspectiveCamera } from 'three';
import type { MotionValue } from 'framer-motion';
import { createPipeline, makePalette } from './pipeline';

export interface DataFlowSceneProps {
  isDark: boolean;
  /** Render a single still frame, no animation. */
  reduced: boolean;
  /** Fewer nodes and packets, no pointer tracking (mobile / touch). */
  lite: boolean;
  /** False while the hero is off-screen: rendering stops entirely. */
  active: boolean;
  /** Hero scroll progress, 0 (top) to 1 (hero fully scrolled away). */
  progress: MotionValue<number>;
}

interface PointerRef {
  current: { x: number; y: number };
}

const BASE_ROT_X = 0.14;
const BASE_ROT_Y = -0.32;
const CAMERA_Z = 9;
const CAMERA_Y = 0.4;

const clamp01 = (v: number) => Math.min(1, Math.max(0, v));
const smoothstep = (e0: number, e1: number, x: number) => {
  const t = clamp01((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};

const Flow: React.FC<Omit<DataFlowSceneProps, 'active'> & { pointer: PointerRef }> = ({
  isDark,
  reduced,
  lite,
  progress,
  pointer,
}) => {
  const invalidate = useThree((s) => s.invalidate);
  const pipeline = useMemo(() => createPipeline({ lite }), [lite]);
  const palette = useMemo(() => makePalette(isDark), [isDark]);
  const group = useRef<Group>(null);
  const spinners = useRef<(LineSegments | null)[]>([]);
  const rings = useRef<(LineSegments | null)[]>([]);

  useEffect(() => () => pipeline.dispose(), [pipeline]);

  useEffect(() => {
    pipeline.setPalette(palette);
    invalidate(); // needed when frameloop is "demand" (reduced motion)
  }, [pipeline, palette, invalidate]);

  useFrame((state, rawDelta) => {
    const g = group.current;
    if (!g) return;
    const dt = Math.min(rawDelta, 0.05); // avoid jumps after a pause
    const camera = state.camera as PerspectiveCamera;
    const { width, height } = state.size;
    const aspect = width / height;

    pipeline.setViewport(state.viewport.dpr, height / 2 / Math.tan(MathUtils.degToRad(camera.fov / 2)));

    // Fit the pipeline to the viewport; on wide screens nudge it right, away from the copy.
    g.scale.setScalar(MathUtils.clamp(aspect / 1.55, 0.42, 1));
    g.position.x = aspect > 1.2 ? 0.9 : 0;
    g.position.y = aspect > 1.2 ? 0 : -0.6;

    const p = reduced ? 0 : clamp01(progress.get());
    pipeline.setFade(1 - smoothstep(0.1, 0.85, p), palette);

    if (reduced) {
      g.rotation.set(BASE_ROT_X, BASE_ROT_Y, 0);
      camera.position.set(0, CAMERA_Y, CAMERA_Z);
      camera.lookAt(0, 0, 0);
      return;
    }

    pipeline.step(dt);

    // Camera dollies back and rises a touch as the hero leaves the screen.
    camera.position.z = CAMERA_Z + p * 5;
    camera.position.y = CAMERA_Y + p * 0.9;
    camera.lookAt(0, 0, 0);

    // Gentle idle sway plus a damped lean toward the pointer.
    const t = state.clock.elapsedTime;
    const px = lite ? 0 : pointer.current.x;
    const py = lite ? 0 : pointer.current.y;
    const targetY = BASE_ROT_Y + px * 0.24 + Math.sin(t * 0.12) * 0.06;
    const targetX = BASE_ROT_X - py * 0.1 + Math.sin(t * 0.09) * 0.02;
    g.rotation.y = MathUtils.damp(g.rotation.y, targetY, 2.5, dt);
    g.rotation.x = MathUtils.damp(g.rotation.x, targetX, 2.5, dt);

    spinners.current.forEach((s, i) => {
      if (!s) return;
      s.rotation.y += dt * (0.18 + (i % 3) * 0.05);
    });
    rings.current.forEach((r) => {
      if (r) r.rotation.z += dt * 0.6;
    });
  });

  return (
    <group ref={group} rotation={[BASE_ROT_X, BASE_ROT_Y, 0]}>
      <lineSegments geometry={pipeline.lineGeometry} material={pipeline.lineMaterial} />
      {pipeline.nodeVisuals.map((v, i) => (
        <group key={i} position={v.position}>
          <lineSegments
            ref={(el) => {
              spinners.current[i] = el;
            }}
            geometry={v.edges}
            material={v.material}
          />
          {v.ring && (
            <lineSegments
              ref={(el) => {
                rings.current[i] = el;
              }}
              rotation={[Math.PI / 2.4, 0, 0]}
              geometry={v.ring.geometry}
              material={v.ring.material}
            />
          )}
        </group>
      ))}
      <points geometry={pipeline.haloGeometry} material={pipeline.haloMaterial} />
      <points geometry={pipeline.packetGeometry} material={pipeline.packetMaterial} />
    </group>
  );
};

/**
 * "Data in motion": a stylised streaming pipeline (source, stream, process, sink) with
 * events flowing along curved edges. Lazy-loaded so three.js lives in its own chunk.
 */
const DataFlowScene: React.FC<DataFlowSceneProps> = ({ active, reduced, lite, ...rest }) => {
  const pointer = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (lite || reduced) return;
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (e.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener('pointermove', onMove, { passive: true });
    return () => window.removeEventListener('pointermove', onMove);
  }, [lite, reduced]);

  return (
    <Canvas
      dpr={lite ? [1, 1.5] : [1, 1.75]}
      frameloop={reduced ? 'demand' : active ? 'always' : 'never'}
      camera={{ position: [0, CAMERA_Y, CAMERA_Z], fov: 40, near: 0.1, far: 60 }}
      gl={{ antialias: !lite, alpha: true, powerPreference: 'high-performance' }}
      style={{ pointerEvents: 'none' }}
      aria-hidden="true"
    >
      <Flow reduced={reduced} lite={lite} pointer={pointer} {...rest} />
    </Canvas>
  );
};

export default DataFlowScene;
