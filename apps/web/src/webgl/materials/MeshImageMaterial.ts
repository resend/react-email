import * as THREE from 'three';
import { extend } from '@react-three/fiber';

export class MeshImageMaterial extends THREE.MeshBasicMaterial {
  constructor(parameters: THREE.MeshBasicMaterialParameters = {}) {
    super(parameters);
  }
  onBeforeCompile = (shader: THREE.Shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <color_fragment>',
      /* glsl */ `#include <color_fragment>
                if (!gl_FrontFacing) {
                    vec3 blackCol = vec3(0.0);
                    diffuseColor.rgb = mix(diffuseColor.rgb, blackCol, 0.7);
                }
            `,
    );
  };
}

extend({ MeshImageMaterial });

// Extend ThreeElements to include our custom material
declare module '@react-three/fiber' {
  interface ThreeElements {
    meshImageMaterial: THREE.Object3DNode<
      MeshImageMaterial,
      typeof MeshImageMaterial
    >;
  }
}
