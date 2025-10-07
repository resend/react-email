import * as THREE from 'three';

declare module '@react-three/fiber' {
  interface ThreeElements {
    meshBannerMaterial: Partial<THREE.MeshBasicMaterialParameters> & {
      backfaceRepeatX?: number;
      map?: THREE.Texture;
      'map-anisotropy'?: number;
      'map-repeat'?: [number, number];
    };
  }
}
