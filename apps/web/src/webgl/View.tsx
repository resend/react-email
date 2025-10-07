'use client';

import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { type ReactNode, Suspense } from 'react';

interface ViewProps {
  children: ReactNode;
  className?: string;
  orbit?: boolean;
}

export function View({ children, className = '', orbit = false }: ViewProps) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 70], fov: 7, near: 0.01, far: 100000 }}
        gl={{ alpha: true, antialias: true }}
        dpr={[1, 2]}
      >
        <Suspense fallback={null}>
          {children}
          {orbit && (
            <OrbitControls
              enableZoom={false}
              enablePan={false}
              enableRotate={false}
            />
          )}
        </Suspense>
      </Canvas>
    </div>
  );
}
