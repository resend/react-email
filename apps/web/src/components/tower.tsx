'use client';

import { Billboard, Banner } from '@/components/webgl';
import { View } from '@/webgl/View';
import { PerspectiveCamera } from '@react-three/drei';
import { useCollageTexture } from '@/hooks/useCollageTexture';
import images from '@/data/images';
import { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import type { Group } from 'three';

const COUNT = 12;
const GAP = 2.8;

function Loader() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <div className="text-white/30">Loading...</div>
    </div>
  );
}

function SpinnableTower({ texture, dimensions }: any) {
  const groupRef = useRef<Group>(null);
  const { size } = useThree();
  const [isDragging, setIsDragging] = useState(false);
  const velocity = useRef(0);
  const lastX = useRef(0);
  const rotationY = useRef(0.5);

  // Apply rotation with damping
  useFrame((_state, delta) => {
    if (!groupRef.current) return;

    if (!isDragging) {
      // Apply velocity and damping
      rotationY.current += velocity.current * delta;
      velocity.current *= 0.95; // Damping factor
    }

    groupRef.current.rotation.y = rotationY.current;
  });

  useEffect(() => {
    if (!isDragging) return;

    const handlePointerMove = (e: PointerEvent) => {
      const deltaX = e.clientX - lastX.current;
      const rotationDelta = (deltaX / size.width) * Math.PI * 2;

      rotationY.current += rotationDelta;
      velocity.current = rotationDelta * 60; // Store velocity for momentum

      lastX.current = e.clientX;
    };

    const handlePointerUp = () => {
      setIsDragging(false);
      document.body.style.cursor = '';
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);

    return () => {
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      document.body.style.cursor = '';
    };
  }, [isDragging, size.width]);

  const handlePointerDown = (e: any) => {
    e.stopPropagation();
    setIsDragging(true);
    lastX.current = e.clientX;
    velocity.current = 0;
  };

  const handlePointerEnter = () => {
    if (!isDragging) {
      document.body.style.cursor = 'grab';
    }
  };

  const handlePointerLeave = () => {
    if (!isDragging) {
      document.body.style.cursor = '';
    }
  };

  return (
    <group
      ref={groupRef}
      rotation={[-0.2, 0.5, 0.2]}
      position={[4, 0, 0]}
      scale={1.2}
      onPointerDown={handlePointerDown}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      {Array.from({ length: COUNT }).map((_, index) => [
        <Billboard
          key={`billboard-${index}`}
          radius={4}
          rotation={[0, index * Math.PI * 0.5, 0]}
          position={[0, (index - (Math.ceil(COUNT / 2) - 1)) * GAP, 0]}
          texture={texture}
          dimensions={dimensions}
        />,
        <Banner
          key={`banner-${index}`}
          radius={4.2}
          rotation={[0, 0, 0.085]}
          position={[
            0,
            (index - (Math.ceil(COUNT / 2) - 1)) * GAP - GAP * 0.5,
            0,
          ]}
        />,
      ])}
    </group>
  );
}

export function Tower() {
  const { texture, dimensions, isLoading } = useCollageTexture(images);

  if (isLoading) return <Loader />;

  if (!texture) return null;

  return (
    <View className="w-full h-full">
      <PerspectiveCamera
        makeDefault
        fov={7}
        position={[0, 0, 70]}
        near={0.01}
        far={100000}
      />
      <SpinnableTower texture={texture} dimensions={dimensions} />
    </View>
  );
}
