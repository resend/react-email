import * as THREE from 'three';
import { extend } from '@react-three/fiber';

interface MeshBannerMaterialParameters
  extends THREE.MeshBasicMaterialParameters {
  backfaceRepeatX?: number;
}

export class MeshBannerMaterial extends THREE.MeshBasicMaterial {
  backfaceRepeatX: number;

  constructor(parameters: MeshBannerMaterialParameters = {}) {
    super(parameters);

    this.backfaceRepeatX = parameters.backfaceRepeatX ?? 1.0;
  }

  onBeforeCompile = (shader: THREE.Shader) => {
    shader.uniforms.repeatX = { value: this.backfaceRepeatX };
    shader.fragmentShader = shader.fragmentShader
      .replace(
        '#include <common>',
        /* glsl */ `#include <common>
                uniform float repeatX;

                vec3 pal( in float t, in vec3 a, in vec3 b, in vec3 c, in vec3 d ) {
                    return a + b*cos( 6.28318*(c*t+d) );
                }
            `,
      )
      .replace(
        '#include <color_fragment>',
        /* glsl */ `#include <color_fragment>
                if (!gl_FrontFacing) {
                    diffuseColor.rgb = pal( vMapUv.x * repeatX, vec3(0.0,0.2,0.3),vec3(0.0,0.2,0.3),vec3(1.0,1.0,1.0),vec3(0.0,0.0,0.0) );
                }
            `,
      );
  };
}

extend({ MeshBannerMaterial });
