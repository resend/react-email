// Web Worker for WebGL Scene rendering
// This offloads WebGL rendering to a separate thread to prevent blocking the main thread

const vertexShaderSource = /* glsl */ `
attribute vec2 a_position;
void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fragmentShaderSource = /* glsl */ `
#extension GL_OES_standard_derivatives : enable
precision highp float;

uniform vec2 u_resolution;
uniform float u_time;
uniform float u_rotation;
uniform sampler2D u_texture;
uniform vec2 u_textureDimensions;
uniform float u_fadeIn;
uniform float u_gradientIntensity;

// Lighting controls
uniform vec3 u_keyLightColor;
uniform float u_keyLightIntensity;
uniform vec3 u_fillLightColor;
uniform float u_fillLightIntensity;
uniform vec3 u_ambientSkyColor;
uniform vec3 u_ambientGroundColor;
uniform vec3 u_ambientLeftColor;
uniform vec3 u_ambientRightColor;
uniform float u_softShadowSoftness;
uniform float u_innerAOBoost;
uniform float u_cavityDarkeningAmount;
uniform float u_rimIntensity;
uniform float u_fogStart;
uniform float u_fogEnd;
uniform vec3 u_fogColor;

// Texture controls
uniform float u_textureDarkness;
uniform float u_textureSharpness;

const bool DEBUG_DISABLE_TILING = false;
const float SEAM_OFFSET = 0.0;

const int MAX_STEPS = 100;
const float MAX_DIST = 100.0;
const float SURF_DIST = 0.001;

float aastep(float threshold, float value) {
  float afwidth = length(vec2(dFdx(value), dFdy(value))) * 0.70710678118654757;
  return smoothstep(threshold - afwidth, threshold + afwidth, value);
}

// Derivative-aware smoothstep to prevent banding in gradients
float smoothstepAA(float edge0, float edge1, float x) {
  float w = fwidth(x) * 2.0; // Adaptive width based on pixel footprint
  return smoothstep(edge0 - w, edge1 + w, x);
}

mat3 rotateY(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat3(
        c,   0.0, s,
        0.0, 1.0, 0.0,
       -s,   0.0, c
    );
}

mat3 rotateX(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat3(
        1.0, 0.0, 0.0,
        0.0, c,   -s,
        0.0, s,    c
    );
}

mat3 rotateZ(float angle) {
    float c = cos(angle);
    float s = sin(angle);
    return mat3(
        c,  -s,  0.0,
        s,   c,  0.0,
        0.0, 0.0, 1.0
    );
}

float sdHollowCylinder(vec3 p, float h, float outerR, float innerR) {
    vec2 d = abs(vec2(length(p.xz), p.y)) - vec2(outerR, h);
    float outer = min(max(d.x, d.y), 0.0) + length(max(d, 0.0));

    vec2 d2 = abs(vec2(length(p.xz), p.y)) - vec2(innerR, h + 0.5);
    float inner = min(max(d2.x, d2.y), 0.0) + length(max(d2, 0.0));

    return max(outer, -inner);
}

float getDist(vec3 p, out int hitIndex, out vec3 cylinderLocalPos, out float cylinderRotationY) {
    p.x -= 5.0;

    p = rotateX(-0.2) * p;
    p = rotateZ(0.2) * p;
    p = rotateY(u_rotation) * p;

    float minDist = MAX_DIST;
    hitIndex = -1;
    cylinderLocalPos = vec3(0.0);
    cylinderRotationY = 0.0;

    const int COUNT = 3;
    const float GAP = 3.5;
    const float OUTER_RADIUS = 4.0;
    const float INNER_RADIUS = 3.99;
    const float HEIGHT = 1.0;

    for (int i = 0; i < COUNT; i++) {
        vec3 cylinderPos = p;

        float yOffset = (float(i) - float(COUNT / 2) + 0.5) * GAP;
        cylinderPos.y -= yOffset;

        float rotationY = float(i) * 3.14159 * 0.5;
        cylinderPos = rotateY(rotationY) * cylinderPos;

        cylinderPos = rotateZ(0.25) * cylinderPos;

        float d = sdHollowCylinder(cylinderPos, HEIGHT, OUTER_RADIUS, INNER_RADIUS);
        if (d < minDist) {
            minDist = d;
            hitIndex = i;
            cylinderLocalPos = cylinderPos;
            cylinderRotationY = rotationY;
        }
    }

    return minDist;
}

float getDist(vec3 p) {
    int dummyI;
    vec3 dummyPos;
    float dummyRot;
    return getDist(p, dummyI, dummyPos, dummyRot);
}

vec3 getNormal(vec3 p) {
    vec2 e = vec2(0.0015, 0.0);
    float d = getDist(p);
    vec3 n = d - vec3(
        getDist(p - e.xyy),
        getDist(p - e.yxy),
        getDist(p - e.yyx)
    );
    return normalize(n);
}

float curvatureAO(vec3 p) {
    float eps = max(0.012, SURF_DIST * 12.0);
    vec3 n = getNormal(p);
    float d0 = getDist(p);
    float dn = getDist(p + eps * n);
    float dp = getDist(p - eps * n);
    float k = abs(dn + dp - 2.0 * d0);
    return clamp(1.0 - 20.0 * k, 0.0, 1.0);
}

// Soft shadows using SDF ray marching
float softShadow(vec3 ro, vec3 rd, float mint, float maxt, float k) {
    float res = 1.0;
    float t = mint;
    for(int i = 0; i < 32; i++) {
        if(t > maxt) break;
        float h = getDist(ro + rd * t);
        if(h < SURF_DIST) return 0.0;
        res = min(res, k * h / t);
        t += h * 0.5;
    }
    return clamp(res, 0.0, 1.0);
}

// ACES filmic tonemapping
vec3 ACESFilm(vec3 x) {
    float a = 2.51;
    float b = 0.03;
    float c = 2.43;
    float d = 0.59;
    float e = 0.14;
    return clamp((x * (a * x + b)) / (x * (c * x + d) + e), 0.0, 1.0);
}

// High-quality noise function to prevent banding
float hash(vec2 p) {
    vec3 p3 = fract(vec3(p.xyx) * 0.1031);
    p3 += dot(p3, p3.yzx + 33.33);
    return fract((p3.x + p3.y) * p3.z);
}

float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);

    // Smoothstep for better interpolation
    vec2 u = f * f * (3.0 - 2.0 * f);

    float a = hash(i);
    float b = hash(i + vec2(1.0, 0.0));
    float c = hash(i + vec2(0.0, 1.0));
    float d = hash(i + vec2(1.0, 1.0));

    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
}

// Dithering function to break up banding
float dither(vec2 screenPos) {
    // Animate noise by adding time-based offset
    vec2 timeOffset = vec2(u_time * 100.0, u_time * 150.0);

    // Combine screen-space noise with temporal animation
    float n = noise(screenPos * 1.5 + timeOffset);
    // Triangular distribution for better perceptual uniformity
    float n2 = noise(screenPos * 2.3 - timeOffset * 0.7);
    return (n + n2 - 1.0) * 0.5;
}

float rayMarch(vec3 ro, vec3 rd, out int hitIndex, out vec3 cylinderLocalPos, out float cylinderRotationY) {
    float dO = 0.0;
    hitIndex = -1;
    cylinderLocalPos = vec3(0.0);
    cylinderRotationY = 0.0;

    for (int i = 0; i < MAX_STEPS; i++) {
        vec3 p = ro + rd * dO;
        int tempIndex;
        vec3 tempLocalPos;
        float tempRotY;
        float dS = getDist(p, tempIndex, tempLocalPos, tempRotY);

        float stepLen = max(dS, 0.2 * SURF_DIST);
        dO += stepLen;

        if (abs(dS) < SURF_DIST) {
            hitIndex = tempIndex;
            cylinderLocalPos = tempLocalPos;
            cylinderRotationY = tempRotY;
            break;
        }

        if (dO > MAX_DIST) break;
    }

    return dO;
}

vec2 getCylindricalUV(vec3 cylLocal, float radius, float halfHeight, float cylinderRotationY) {
    float ca = cos(SEAM_OFFSET + cylinderRotationY);
    float sa = sin(SEAM_OFFSET + cylinderRotationY);

    vec2 xz = vec2(
        ca * cylLocal.x - sa * cylLocal.z,
        sa * cylLocal.x + ca * cylLocal.z
    );

    float angle = atan(xz.y, xz.x);
    float u = 1.0 - (angle / (2.0 * 3.14159) + 0.5);

    float v = 1.0 - ((cylLocal.y / (halfHeight * 2.0)) + 0.5);

    // Map to individual images from the atlas with SQUARE cells
    float numRepetitions = 9.0;
    float numUniqueImages = 5.0;
    float atlasCols = 4.0;
    float atlasRows = 3.0;

    float imageIndex = mod(floor(u * numRepetitions), numUniqueImages);

    float atlasCol = mod(imageIndex, atlasCols);
    float atlasRow = floor(imageIndex / atlasCols);

    float cellU = fract(u * numRepetitions);
    float cellV = v;

    // Compute cylinder segment aspect vs square cell (1:1)
    float cylinderCircumference = 2.0 * 3.14159 * radius;
    float cylinderHeight = halfHeight * 2.0;
    float segmentWidth = cylinderCircumference / numRepetitions;
    float cylinderSegmentAspect = segmentWidth / cylinderHeight;

    // Fit cylinder segment into square cell with letterboxing
    // Atlas cells are now square (1:1), so adjust UV to fit the segment
    if (cylinderSegmentAspect > 1.0) {
        // Segment is wider than tall: scale V (add letterbox top/bottom)
        float scale = 1.0 / cylinderSegmentAspect;
        cellV = (cellV - 0.5) * scale + 0.5;
    } else if (cylinderSegmentAspect < 1.0) {
        // Segment is taller than wide: scale U (add pillarbox left/right)
        float scale = cylinderSegmentAspect;
        cellU = (cellU - 0.5) * scale + 0.5;
    }

    // Clamp to avoid sampling outside cell due to bilinear filtering
    cellU = clamp(cellU, 0.01, 0.99);
    cellV = clamp(cellV, 0.01, 0.99);

    // Map to atlas cell (square cells)
    vec2 uv = vec2(
        (atlasCol + cellU) / atlasCols,
        (atlasRow + cellV) / atlasRows
    );

    return uv;
}

void main() {
    vec2 uv = (gl_FragCoord.xy - 0.5 * u_resolution.xy) / u_resolution.y;

    vec3 ro = vec3(-.5, 2.0, 90.0);
    vec3 rd = normalize(vec3(uv.x, uv.y, -10.0));

    int hitIndex;
    vec3 cylinderLocalPos;
    float cylinderRotationY;
    float d = rayMarch(ro, rd, hitIndex, cylinderLocalPos, cylinderRotationY);

    vec3 col = vec3(0.0);
    float alpha = 0.0;

    if (d < MAX_DIST && hitIndex >= 0) {
        vec3 p = ro + rd * d;
        vec3 n = getNormal(p);

        vec2 texUV = getCylindricalUV(cylinderLocalPos, 3.5, 1.0, cylinderRotationY);

        vec4 texColor = texture2D(u_texture, texUV);

        // Apply selective darkness - only darken the dark tones (shadows)
        // Calculate luminance to determine what is "dark"
        float luminance = dot(texColor.rgb, vec3(0.299, 0.587, 0.114));

        // Create a mask: 1.0 for bright areas, 0.0 for dark areas
        // Adjust threshold (0.5) to control what's considered "dark"
        float brightnessMask = smoothstep(0.0, 0.5, luminance);

        // Darken only the dark tones, leave bright areas unchanged
        // u_textureDarkness: 1.0 = normal, <1.0 = darker shadows, >1.0 = lighter shadows
        texColor.rgb = mix(
            texColor.rgb * u_textureDarkness,  // Darkened dark tones
            texColor.rgb,                       // Keep bright tones unchanged
            brightnessMask
        );

        // Apply texture sharpness control via contrast adjustment
        // (1.0 = normal, >1.0 = sharper/more contrast, <1.0 = softer/less contrast)
        texColor.rgb = (texColor.rgb - 0.5) * u_textureSharpness + 0.5;
        texColor.rgb = clamp(texColor.rgb, 0.0, 1.0);

        const float OUTER_RADIUS = 3.5;
        const float INNER_RADIUS = 3.3;
        float midR = 0.5 * (OUTER_RADIUS + INNER_RADIUS);
        float rLocal = length(cylinderLocalPos.xz);
        bool isInnerSurface = rLocal < midR;

        if (isInnerSurface) {
          n = -n;
        }

        // === AMBIENT LIGHTING ===
        // Hemisphere ambient (sky vs ground)
        float hemisphereBlend = n.y * 0.5 + 0.5;
        vec3 hemisphereAmbient = mix(u_ambientGroundColor, u_ambientSkyColor, hemisphereBlend);

        // Lateral ambient (left vs right gradient)
        float lateralBlend = n.x * 0.5 + 0.5;
        vec3 lateralAmbient = mix(u_ambientLeftColor, u_ambientRightColor, lateralBlend);

        // Combine ambient sources
        vec3 ambientLight = hemisphereAmbient * 0.6 + lateralAmbient * 0.4;

        // Inner surface gets cooler, darker ambient
        if (isInnerSurface) {
            ambientLight *= vec3(0.4, 0.5, 0.7); // Cool blue tint
            ambientLight *= 0.5; // Darker
        }

        // === OCCLUSION ===
        float aoCurv = curvatureAO(p);

        // Cavity darkening for inner surfaces
        float cavityDarkening = 1.0;
        if (isInnerSurface) {
            float proximityToInner = (rLocal - INNER_RADIUS) / (midR - INNER_RADIUS);
            cavityDarkening = mix(0.3, 1.0, proximityToInner);
            cavityDarkening = mix(1.0, cavityDarkening, u_cavityDarkeningAmount);
        }

        // Boost AO on inner surfaces
        float aoBoost = isInnerSurface ? u_innerAOBoost : 1.0;
        float ao = mix(1.0, aoCurv, 0.6 * aoBoost);

        // === KEY LIGHT (cool blue, upper-left/front) ===
        vec3 keyLightDir = normalize(vec3(-0.8, 0.6, 0.8));
        float keyNdotL = dot(n, keyLightDir);

        // Wrapped diffuse for area light effect
        float keyDiffuse = (keyNdotL + 0.5) / 1.5; // wrap factor
        keyDiffuse = clamp(keyDiffuse, 0.0, 1.0);

        // Soft shadows for key light
        float shadow = 1.0;
        if (keyDiffuse > 0.01) {
            vec3 shadowOrigin = p + n * 0.02; // slight bias
            shadow = softShadow(shadowOrigin, keyLightDir, 0.02, 10.0, u_softShadowSoftness);
        }

        vec3 keyLight = u_keyLightColor * u_keyLightIntensity * keyDiffuse * shadow;

        // === FILL LIGHT (cooler blue, opposing direction) ===
        vec3 fillLightDir = normalize(vec3(0.5, 0.3, -0.5));
        float fillNdotL = dot(n, fillLightDir);
        float fillDiffuse = (fillNdotL + 0.5) / 1.5; // wrapped
        fillDiffuse = clamp(fillDiffuse, 0.0, 1.0);

        vec3 fillLight = u_fillLightColor * u_fillLightIntensity * fillDiffuse;

        // === LOCALIZED INNER LIGHT (subtle illumination for inner surfaces) ===
        vec3 innerAccentLight = vec3(0.0);
        if (isInnerSurface) {
            // Light from the right side, targeting the inner surface
            vec3 accentLightDir = normalize(vec3(1.0, 0.0, 0.3));
            float accentNdotL = dot(n, accentLightDir);
            float accentDiffuse = (accentNdotL + 0.7) / 1.7; // heavy wrap for soft light
            accentDiffuse = clamp(accentDiffuse, 0.0, 1.0);

            // Localize the light to a specific area using cylinderLocalPos
            // Target the right side of the inner cylinder
            float horizontalMask = smoothstep(-1.0, 1.0, cylinderLocalPos.x);
            float verticalMask = 1.0 - abs(cylinderLocalPos.y) * 0.3; // Fade at top/bottom

            // Combine masks for localized effect
            float localMask = horizontalMask * verticalMask;

            innerAccentLight = vec3(0.4, 0.6, 0.9) * accentDiffuse * localMask * 0.6;
        }

        // === RIM LIGHT ===
        float viewDot = 1.0 - abs(dot(n, -rd));
        float rimFactor = pow(viewDot, 3.0);
        vec3 rimLight = vec3(0.3, 0.5, 0.8) * rimFactor * u_rimIntensity;

        // === ACCUMULATE LIGHTING ===
        vec3 lighting = ambientLight + keyLight + fillLight + innerAccentLight + rimLight;

        // Apply occlusion and cavity darkening
        lighting *= ao * cavityDarkening;

        // === TEXTURE AND BRIGHTNESS SHAPING ===
        float distanceFromCenter = abs(float(hitIndex) - 1.0);
        float centerBoost = hitIndex == 1 ? 1.2 : 0.9;

        // Screen-space gradient shaping with derivative-aware smoothing
        vec2 screenPosInner = gl_FragCoord.xy / u_resolution.xy;
        float horizontalGradient = smoothstepAA(0.2, 0.8, screenPosInner.x);
        float gradientStrength = 0.3 + (1.0 - distanceFromCenter) * 0.4;
        float horizontalFade = mix(0.7, 1.0, horizontalGradient * gradientStrength);

        // Apply lighting to texture
        col = texColor.rgb * lighting * centerBoost * horizontalFade;

        // === CHEAP GLOW ===
        float brightness = dot(col, vec3(0.299, 0.587, 0.114));
        float glow = brightness * rimFactor * 0.15;
        col += vec3(0.2, 0.4, 0.8) * glow;

        // === DISTANCE FOG ===
        float fogAmount = smoothstepAA(u_fogStart, u_fogEnd, d);
        col = mix(col, u_fogColor, fogAmount * 0.6);

        alpha = texColor.a;
    }

    vec2 centerUV = gl_FragCoord.xy / u_resolution.xy;
    vec2 fromCenter = centerUV - vec2(0.5);

    fromCenter.x *= 0.3;
    fromCenter.y *= 0.6;
    float distFromCenter = length(fromCenter);

    float fade = smoothstepAA(1.2, 0.1, distFromCenter);

    float topVignette = smoothstepAA(0.0, 0.15, centerUV.y);
    float bottomVignette = smoothstepAA(1.0, 0.75, centerUV.y);
    float verticalVignette = topVignette * bottomVignette;
    verticalVignette = mix(1.0, verticalVignette, 0.5);

    alpha *= fade * verticalVignette;

    alpha *= u_fadeIn;

    // === DITHERING IN LINEAR SPACE (before tonemapping) ===
    // Apply dither in linear space for better perceptual distribution
    float ditherNoise = dither(gl_FragCoord.xy);
    // Scale dither by a tiny amount (1/255 ≈ 0.004)
    col += vec3(ditherNoise * (1.0 / 255.0));

    // === COLOR GRADING AND TONEMAPPING ===
    // Apply filmic tonemapping
    col = ACESFilm(col);

    // Right-side lift and center emphasis with derivative-aware gradients
    vec2 screenPos = gl_FragCoord.xy / u_resolution.xy;
    float rightLift = smoothstepAA(0.3, 0.85, screenPos.x);
    float centerEmphasis = 1.0 - abs(screenPos.y - 0.5) * 0.6;
    float compositionalAdjust = rightLift * mix(0.85, 1.0, centerEmphasis);

    col *= compositionalAdjust;

    // Subtle left-to-right gradient for depth
    float leftToRightGradient = smoothstepAA(0.0, 1.0, screenPos.x);
    col = col * mix(0.85, 1.0, leftToRightGradient);

    gl_FragColor = vec4(col, alpha);
}
`;

function lerp(
  source: number,
  target: number,
  rate: number,
  frameDelta?: number,
  targetFps = 60,
): number {
  const _lerp = (a: number, b: number, t: number) => a + (b - a) * t;

  if (typeof frameDelta === 'undefined') {
    return _lerp(source, target, rate);
  }

  const relativeDelta = frameDelta / (1 / targetFps);
  const smoothing = 1 - rate;
  return _lerp(source, target, 1 - smoothing ** relativeDelta);
}

let gl: WebGLRenderingContext | null = null;
let program: WebGLProgram | null = null;
let animationId = 0;
let rotation = 0.5;
let velocity = 0;
let isDragging = false;
let startTime = Date.now();
let autoRotateDirection = 1;
let lastFrameTime = Date.now();
let textureWidth = 0;
let textureHeight = 0;
let canvas: OffscreenCanvas | null = null;
let textureLoaded = false;

let resolutionLocation: WebGLUniformLocation | null = null;
let timeLocation: WebGLUniformLocation | null = null;
let rotationLocation: WebGLUniformLocation | null = null;
let textureDimensionsLocation: WebGLUniformLocation | null = null;
let fadeInLocation: WebGLUniformLocation | null = null;
let gradientIntensityLocation: WebGLUniformLocation | null = null;

let keyLightColorLocation: WebGLUniformLocation | null = null;
let keyLightIntensityLocation: WebGLUniformLocation | null = null;
let fillLightColorLocation: WebGLUniformLocation | null = null;
let fillLightIntensityLocation: WebGLUniformLocation | null = null;
let ambientSkyColorLocation: WebGLUniformLocation | null = null;
let ambientGroundColorLocation: WebGLUniformLocation | null = null;
let ambientLeftColorLocation: WebGLUniformLocation | null = null;
let ambientRightColorLocation: WebGLUniformLocation | null = null;
let softShadowSoftnessLocation: WebGLUniformLocation | null = null;
let innerAOBoostLocation: WebGLUniformLocation | null = null;
let cavityDarkeningAmountLocation: WebGLUniformLocation | null = null;
let rimIntensityLocation: WebGLUniformLocation | null = null;
let fogStartLocation: WebGLUniformLocation | null = null;
let fogEndLocation: WebGLUniformLocation | null = null;
let fogColorLocation: WebGLUniformLocation | null = null;

// Texture uniform locations
let textureDarknessLocation: WebGLUniformLocation | null = null;
let textureSharpnessLocation: WebGLUniformLocation | null = null;

function createShader(type: number, source: string): WebGLShader | null {
  if (!gl) return null;
  const shader = gl.createShader(type);
  if (!shader) return null;

  gl.shaderSource(shader, source);
  gl.compileShader(shader);

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    gl.deleteShader(shader);
    return null;
  }

  return shader;
}

function initWebGL(offscreenCanvas: OffscreenCanvas, dpr: number) {
  canvas = offscreenCanvas;

  gl = canvas.getContext('webgl', {
    alpha: true,
    premultipliedAlpha: false,
    antialias: true,
  }) as WebGLRenderingContext | null;

  if (!gl) return false;

  gl.getExtension('OES_standard_derivatives');

  canvas.width = canvas.width * dpr;
  canvas.height = canvas.height * dpr;
  gl.viewport(0, 0, canvas.width, canvas.height);

  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  const vertexShader = createShader(gl.VERTEX_SHADER, vertexShaderSource);
  const fragmentShader = createShader(gl.FRAGMENT_SHADER, fragmentShaderSource);

  if (!vertexShader || !fragmentShader) return false;

  program = gl.createProgram();
  if (!program) return false;

  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    return false;
  }

  // biome-ignore lint/correctness/useHookAtTopLevel: gl.useProgram is a WebGL method, not a React hook
  gl.useProgram(program);

  const positions = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
  const positionBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, positions, gl.STATIC_DRAW);

  const positionLocation = gl.getAttribLocation(program, 'a_position');
  gl.enableVertexAttribArray(positionLocation);
  gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

  resolutionLocation = gl.getUniformLocation(program, 'u_resolution');
  timeLocation = gl.getUniformLocation(program, 'u_time');
  rotationLocation = gl.getUniformLocation(program, 'u_rotation');
  const textureLocation = gl.getUniformLocation(program, 'u_texture');
  textureDimensionsLocation = gl.getUniformLocation(
    program,
    'u_textureDimensions',
  );
  fadeInLocation = gl.getUniformLocation(program, 'u_fadeIn');
  gradientIntensityLocation = gl.getUniformLocation(
    program,
    'u_gradientIntensity',
  );

  // Get lighting uniform locations
  keyLightColorLocation = gl.getUniformLocation(program, 'u_keyLightColor');
  keyLightIntensityLocation = gl.getUniformLocation(
    program,
    'u_keyLightIntensity',
  );
  fillLightColorLocation = gl.getUniformLocation(program, 'u_fillLightColor');
  fillLightIntensityLocation = gl.getUniformLocation(
    program,
    'u_fillLightIntensity',
  );
  ambientSkyColorLocation = gl.getUniformLocation(program, 'u_ambientSkyColor');
  ambientGroundColorLocation = gl.getUniformLocation(
    program,
    'u_ambientGroundColor',
  );
  ambientLeftColorLocation = gl.getUniformLocation(
    program,
    'u_ambientLeftColor',
  );
  ambientRightColorLocation = gl.getUniformLocation(
    program,
    'u_ambientRightColor',
  );
  softShadowSoftnessLocation = gl.getUniformLocation(
    program,
    'u_softShadowSoftness',
  );
  innerAOBoostLocation = gl.getUniformLocation(program, 'u_innerAOBoost');
  cavityDarkeningAmountLocation = gl.getUniformLocation(
    program,
    'u_cavityDarkeningAmount',
  );
  rimIntensityLocation = gl.getUniformLocation(program, 'u_rimIntensity');
  fogStartLocation = gl.getUniformLocation(program, 'u_fogStart');
  fogEndLocation = gl.getUniformLocation(program, 'u_fogEnd');
  fogColorLocation = gl.getUniformLocation(program, 'u_fogColor');

  // Get texture uniform locations
  textureDarknessLocation = gl.getUniformLocation(program, 'u_textureDarkness');
  textureSharpnessLocation = gl.getUniformLocation(
    program,
    'u_textureSharpness',
  );

  gl.uniform1i(textureLocation, 0);
  gl.activeTexture(gl.TEXTURE0);

  return true;
}

function loadTexture(imageBitmapArray: ImageBitmap[]) {
  if (!gl) return;

  const texture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, texture);

  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);

  // Force 4x3 grid with SQUARE cells to prevent stretching
  const cols = 4;
  const rows = Math.ceil(imageBitmapArray.length / cols);

  // Calculate square cell size based on the largest dimension
  const baseW = imageBitmapArray[0]?.width || 512;
  const baseH = imageBitmapArray[0]?.height || 512;
  const cellSize = Math.max(baseW, baseH); // Square cells

  textureWidth = cellSize * cols;
  textureHeight = cellSize * rows;

  // Removed log: Atlas creation

  const collageCanvas = new OffscreenCanvas(textureWidth, textureHeight);
  const ctx = collageCanvas.getContext('2d')!;

  ctx.clearRect(0, 0, textureWidth, textureHeight);

  imageBitmapArray.forEach((imageBitmap, idx) => {
    const col = idx % cols;
    const row = Math.floor(idx / cols);
    const x = col * cellSize;
    const y = row * cellSize;

    // Fit image into square cell (contain/fit mode - no cropping)
    const iw = imageBitmap.width;
    const ih = imageBitmap.height;
    const scale = Math.min(cellSize / iw, cellSize / ih);
    const dw = Math.round(iw * scale);
    const dh = Math.round(ih * scale);
    const dx = x + Math.round((cellSize - dw) / 2); // Center horizontally
    const dy = y + Math.round((cellSize - dh) / 2); // Center vertically

    // Draw ImageBitmap directly to the collage canvas
    ctx.drawImage(imageBitmap, 0, 0, iw, ih, dx, dy, dw, dh);
    // Removed log: Image fitted into cell
  });

  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.RGBA,
    gl.RGBA,
    gl.UNSIGNED_BYTE,
    collageCanvas,
  );

  textureLoaded = true;
  self.postMessage({ type: 'ready' });
}

function render() {
  if (!gl || !canvas || !program) return;

  const now = Date.now();
  const frameDelta = (now - lastFrameTime) / 1000;
  lastFrameTime = now;

  if (!isDragging) {
    const autoRotateSpeed = 0.001 * autoRotateDirection;
    const lerpFactor = 0.015;
    velocity = lerp(velocity, autoRotateSpeed, lerpFactor, frameDelta);

    if (Math.abs(velocity - autoRotateSpeed) > 0.001) {
      autoRotateDirection = velocity > 0 ? 1 : -1;
    }

    rotation += velocity;
  }

  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  if (textureLoaded) {
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);

    const fadeInProgress = Math.min((Date.now() - startTime) / 1000.0, 1.0);

    gl.uniform2f(resolutionLocation, canvas.width, canvas.height);
    gl.uniform1f(timeLocation, (Date.now() - startTime) / 1000.0);
    gl.uniform1f(rotationLocation, rotation);
    gl.uniform2f(textureDimensionsLocation, textureWidth, textureHeight);
    gl.uniform1f(fadeInLocation, fadeInProgress);
    gl.uniform1f(gradientIntensityLocation, 0.5);

    // Set lighting uniforms with tuned values
    // Key light: cool blue from upper-left/front
    gl.uniform3f(keyLightColorLocation, 0.5, 0.66, 0.88);
    gl.uniform1f(keyLightIntensityLocation, 2.2);

    // Fill light: cooler blue from opposing direction
    gl.uniform3f(fillLightColorLocation, 0.4, 0.55, 0.8);
    gl.uniform1f(fillLightIntensityLocation, 2.0);

    // Ambient colors
    gl.uniform3f(ambientSkyColorLocation, 0.3, 0.4, 0.6); // Cool sky
    gl.uniform3f(ambientGroundColorLocation, 0.15, 0.2, 0.35); // Dark ground
    gl.uniform3f(ambientLeftColorLocation, 0.2, 0.25, 0.4); // Dark left
    gl.uniform3f(ambientRightColorLocation, 0.35, 0.45, 0.65); // Brighter right

    // Shadow and occlusion controls
    gl.uniform1f(softShadowSoftnessLocation, 3.0); // Softness factor
    gl.uniform1f(innerAOBoostLocation, 0.2); // Boost AO on inner surfaces
    gl.uniform1f(cavityDarkeningAmountLocation, 0.55); // Strong cavity darkening

    // Rim light and fog
    gl.uniform1f(rimIntensityLocation, 0.0);
    gl.uniform1f(fogStartLocation, 60.0);
    gl.uniform1f(fogEndLocation, 80.0);
    gl.uniform3f(fogColorLocation, 0.05, 0.06, 0.06); // Dark cool fog

    // Texture controls
    gl.uniform1f(textureDarknessLocation, 0.6); // 1.0 = normal, <1.0 = darker shadows, >1.0 = lighter shadows
    gl.uniform1f(textureSharpnessLocation, 1.15); // 1.0 = normal, >1.0 = sharper, <1.0 = softer (reduced to prevent banding)

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }

  animationId = requestAnimationFrame(render);
}

function handleResize(width: number, height: number, dpr: number) {
  if (!gl || !canvas) return;

  const displayWidth = width * dpr;
  const displayHeight = height * dpr;

  if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
    canvas.width = displayWidth;
    canvas.height = displayHeight;
    gl.viewport(0, 0, canvas.width, canvas.height);
  }
}

self.onmessage = (e: MessageEvent) => {
  const { type, data } = e.data;

  switch (type) {
    case 'init':
      if (initWebGL(data.canvas, data.dpr)) {
        startTime = Date.now();
        lastFrameTime = Date.now();
      }
      break;

    case 'loadTexture':
      loadTexture(data.images);
      break;

    case 'startRender':
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
      render();
      break;

    case 'stopRender':
      if (animationId) {
        cancelAnimationFrame(animationId);
        animationId = 0;
      }
      break;

    case 'pointerDown':
      isDragging = true;
      velocity = 0;
      break;

    case 'pointerMove':
      if (isDragging) {
        const rotationDelta = data.deltaX * 0.00125;
        rotation += rotationDelta;
        velocity = rotationDelta;
      }
      break;

    case 'pointerUp':
      isDragging = false;
      break;

    case 'resize':
      handleResize(data.width, data.height, data.dpr);
      break;
  }
};
