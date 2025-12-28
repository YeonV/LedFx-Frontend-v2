// WebGL Shader Programs for Audio Visualiser

export const vertexShaderSource = `
  attribute vec2 a_position;
  attribute float a_amplitude;
  attribute float a_index;

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_sensitivity;
  uniform int u_visualType;

  varying float v_amplitude;
  varying float v_index;
  varying vec2 v_position;

  void main() {
    v_amplitude = a_amplitude;
    v_index = a_index;
    v_position = a_position;

    vec2 pos = a_position;

    // Convert from pixels to clip space
    vec2 clipSpace = (pos / u_resolution) * 2.0 - 1.0;
    clipSpace.y = -clipSpace.y; // Flip Y

    gl_Position = vec4(clipSpace, 0.0, 1.0);
    gl_PointSize = 4.0;
  }
`

export const fragmentShaderSource = `
  precision mediump float;

  uniform vec3 u_primaryColor;
  uniform vec3 u_secondaryColor;
  uniform float u_time;
  uniform int u_visualType;

  varying float v_amplitude;
  varying float v_index;
  varying vec2 v_position;

  void main() {
    // Gradient based on amplitude
    vec3 color = mix(u_primaryColor, u_secondaryColor, v_amplitude);

    // Add glow effect
    float glow = smoothstep(0.0, 1.0, v_amplitude);
    color += glow * 0.2;

    gl_FragColor = vec4(color, 1.0);
  }
`

// Particle system vertex shader
export const particleVertexShader = `
  attribute vec2 a_position;
  attribute vec2 a_velocity;
  attribute float a_life;
  attribute float a_size;
  attribute float a_amplitude;

  uniform vec2 u_resolution;
  uniform float u_time;

  varying float v_life;
  varying float v_amplitude;

  void main() {
    v_life = a_life;
    v_amplitude = a_amplitude;

    vec2 pos = a_position + a_velocity * u_time;

    // Convert to clip space
    vec2 clipSpace = (pos / u_resolution) * 2.0 - 1.0;
    clipSpace.y = -clipSpace.y;

    gl_Position = vec4(clipSpace, 0.0, 1.0);
    gl_PointSize = a_size * (1.0 - a_life * 0.5);
  }
`

// Quad vertex shader for full-screen effects
export const quadVertexShader = `
  attribute vec2 a_position;
  varying vec2 v_position;

  void main() {
    v_position = a_position;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`

export const particleFragmentShader = `
  precision mediump float;

  uniform vec3 u_primaryColor;
  uniform vec3 u_secondaryColor;

  varying float v_life;
  varying float v_amplitude;

  void main() {
    // Circular particle
    vec2 coord = gl_PointCoord - vec2(0.5);
    float dist = length(coord);
    if (dist > 0.5) discard;

    // Color based on amplitude
    vec3 color = mix(u_primaryColor, u_secondaryColor, v_amplitude);

    // Fade out based on life
    float alpha = (1.0 - v_life) * smoothstep(0.5, 0.0, dist);

    gl_FragColor = vec4(color, alpha);
  }
`

// Spectrum shader with rainbow gradient
export const spectrumFragmentShader = `
  precision mediump float;

  varying float v_amplitude;
  varying float v_index;

  vec3 hsl2rgb(vec3 c) {
    vec3 rgb = clamp(abs(mod(c.x * 6.0 + vec3(0.0, 4.0, 2.0), 6.0) - 3.0) - 1.0, 0.0, 1.0);
    return c.z + c.y * (rgb - 0.5) * (1.0 - abs(2.0 * c.z - 1.0));
  }

  void main() {
    float hue = v_index;
    vec3 color = hsl2rgb(vec3(hue, 1.0, 0.5));

    // Add glow
    color += v_amplitude * 0.3;

    gl_FragColor = vec4(color, 1.0);
  }
`

// Utility functions
export function createShader(
  gl: WebGLRenderingContext,
  type: number,
  source: string
): WebGLShader | null {
  const shader = gl.createShader(type)
  if (!shader) return null

  gl.shaderSource(shader, source)
  gl.compileShader(shader)

  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    console.error('Shader compile error:', gl.getShaderInfoLog(shader))
    gl.deleteShader(shader)
    return null
  }

  return shader
}

export function createProgram(
  gl: WebGLRenderingContext,
  vertexShader: WebGLShader,
  fragmentShader: WebGLShader
): WebGLProgram | null {
  const program = gl.createProgram()
  if (!program) return null

  gl.attachShader(program, vertexShader)
  gl.attachShader(program, fragmentShader)
  gl.linkProgram(program)

  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error('Program link error:', gl.getProgramInfoLog(program))
    gl.deleteProgram(program)
    return null
  }

  return program
}

export function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  if (result) {
    return [
      parseInt(result[1], 16) / 255,
      parseInt(result[2], 16) / 255,
      parseInt(result[3], 16) / 255
    ]
  }
  return [1, 1, 1]
}

// --- New Shaders for Matrix Effects ---

// Bleep Shader (Scrolling History)
// We use a texture to store history.
export const bleepFragmentShader = `
  precision mediump float;

  uniform vec3 u_primaryColor;
  uniform vec3 u_secondaryColor;
  uniform sampler2D u_history; // 1D texture containing amplitude history
  uniform float u_time;

  varying vec2 v_position; // -1 to 1

  void main() {
    // Map x (-1 to 1) to texture coordinate (0 to 1)
    float texCoordX = v_position.x * 0.5 + 0.5;
    
    // Sample history
    // We assume the texture is updated such that current time is at 1.0 or 0.0?
    // Let's assume texture contains the history buffer.
    float amplitude = texture2D(u_history, vec2(texCoordX, 0.5)).r;
    
    // Draw line
    float y = v_position.y; // -1 to 1
    // Map amplitude (0 to 1) to y range (-0.5 to 0.5 for example)
    float targetY = (amplitude - 0.5) * 1.5;
    
    // Thickness
    float thickness = 0.02 + amplitude * 0.05;
    float dist = abs(y - targetY);
    
    // Glow/Intensity
    float intensity = smoothstep(thickness, 0.0, dist);
    
    // Color
    vec3 color = mix(u_secondaryColor, u_primaryColor, amplitude);
    
    // Add some background grid or effect
    float grid = step(0.95, fract(v_position.x * 10.0)) * 0.1;
    
    gl_FragColor = vec4(color * intensity + grid * u_secondaryColor, 1.0);
  }
`

// Concentric Shader
export const concentricFragmentShader = `
  precision mediump float;

  uniform vec3 u_primaryColor;
  uniform vec3 u_secondaryColor;
  uniform float u_time;
  uniform float u_beat; // Accumulating beat/power value

  varying vec2 v_position;

  void main() {
    float dist = length(v_position);
    
    // Expanding rings: dist - time
    // We use u_beat to modulate the expansion
    float phase = dist * 4.0 - u_beat * 2.0;
    
    float val = sin(phase);
    float ring = smoothstep(0.0, 0.1, val) - smoothstep(0.4, 0.5, val);
    
    // Color gradient based on distance
    vec3 color = mix(u_primaryColor, u_secondaryColor, dist * 0.5 + 0.5);
    
    // Modulate brightness
    color *= (ring * 0.8 + 0.2);
    
    // Vignette
    color *= 1.0 - smoothstep(0.5, 1.5, dist);

    gl_FragColor = vec4(color, 1.0);
  }
`

// GIF Player - Kaleidoscope Audio Reactive
export const gifFragmentShader = `
  precision highp float;

  uniform vec3 u_primaryColor;
  uniform vec3 u_secondaryColor;
  uniform float u_time;
  uniform float u_energy;
  uniform float u_beat;
  uniform vec2 u_resolution;

  varying vec2 v_position;

  #define PI 3.14159265359

  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  void main() {
    // Correct aspect ratio
    vec2 uv = v_position;
    if (u_resolution.y > 0.0) {
      uv.x *= u_resolution.x / u_resolution.y;
    }

    // Parameters driven by audio
    float time = u_time * 0.2;
    float beat = u_beat; // BPM driven phase
    float energy = u_energy; // RMS / Volume

    // Rotation based on BPM
    float rot = beat * 0.5 + time * 0.1;
    float c = cos(rot);
    float s = sin(rot);
    uv = mat2(c, -s, s, c) * uv;

    // Convert to polar
    float r = length(uv);
    float a = atan(uv.y, uv.x);

    // Kaleidoscope Segments
    // Increase segments with energy, minimum 6
    float segments = 6.0 + floor(energy * 6.0);
    
    // Fold the space
    float segmentAngle = 2.0 * PI / segments;
    a = mod(a, segmentAngle);
    a = abs(a - segmentAngle * 0.5);
    
    // Map back to Cartesian for pattern generation
    vec2 p = r * vec2(cos(a), sin(a));

    // Generate "Glass Shard" Pattern
    // Interference pattern
    float pattern = 0.0;
    pattern += sin(p.x * 10.0 + beat);
    pattern += sin(p.y * 10.0 - beat);
    pattern += sin((p.x + p.y) * 8.0 + time);
    pattern += sin(r * 20.0 - time * 2.0);

    // Sharpen edges
    float shards = abs(pattern);
    shards = smoothstep(0.0, 0.5 + energy * 0.5, shards);
    
    // Invert for "glowing lines" effect if energy is high
    if (energy > 0.5) {
       shards = 1.0 - shards;
    }

    // Color Logic
    // Cycle hue based on time and radius
    float hue = fract(time * 0.1 + r * 0.2 + energy * 0.1);
    float sat = 0.8;
    float val = shards * (0.5 + energy * 1.5); // Brightness linked to energy

    vec3 color = hsv2rgb(vec3(hue, sat, val));

    // Mix with theme colors
    vec3 themeMix = mix(u_primaryColor, u_secondaryColor, sin(r * 5.0 + beat) * 0.5 + 0.5);
    color = mix(color, themeMix, 0.4);

    // Center Glow (Bass kick)
    float glow = exp(-r * 3.0) * energy * 2.0;
    color += u_primaryColor * glow;

    // Vignette
    color *= smoothstep(1.5, 0.5, r);

    gl_FragColor = vec4(color, 1.0);
  }
`

// Matrix Rain Effect
export const matrixRainShader = `
  precision highp float;

  uniform vec3 u_primaryColor;
  uniform vec3 u_secondaryColor;
  uniform float u_time;
  uniform float u_energy;
  uniform vec2 u_resolution;

  varying vec2 v_position;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  void main() {
    vec2 uv = v_position * 0.5 + 0.5;
    float time = u_time;
    float energy = u_energy;

    // Create grid
    float cols = 30.0;
    float rows = 20.0;

    vec2 gridUV = uv * vec2(cols, rows);
    vec2 gridID = floor(gridUV);
    vec2 gridPos = fract(gridUV);

    // Random speed per column
    float colRand = random(vec2(gridID.x, 0.0));
    float speed = 2.0 + colRand * 3.0 + energy * 5.0;

    // Falling effect
    float fall = fract(time * speed * 0.1 + colRand * 10.0);
    float brightness = 1.0 - abs(gridID.y / rows - fall);
    brightness = pow(max(0.0, brightness), 3.0);

    // Character flicker
    float charRand = random(gridID + floor(time * 10.0));
    float char = step(0.5, charRand) * brightness;

    // Trail effect
    float trail = smoothstep(0.0, 0.5, brightness) * 0.5;

    // Color
    vec3 color = u_primaryColor * (char + trail);
    color += u_secondaryColor * brightness * 0.2;

    // Energy boost
    color *= 0.7 + energy * 1.5;

    // Add glow
    color += u_primaryColor * exp(-length(gridPos - 0.5) * 4.0) * char * 0.5;

    gl_FragColor = vec4(color, 1.0);
  }
`

// Waveform Terrain
export const terrainShader = `
  precision highp float;

  uniform vec3 u_primaryColor;
  uniform vec3 u_secondaryColor;
  uniform float u_time;
  uniform float u_energy;
  uniform float u_beat;

  varying vec2 v_position;

  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  void main() {
    vec2 uv = v_position;
    float time = u_time * 0.5;
    float energy = u_energy;

    // Perspective transform
    float perspective = 1.0 / (uv.y * 0.5 + 1.0);
    vec2 groundUV = vec2(uv.x * perspective, perspective);

    // Scrolling terrain
    groundUV.y += time + u_beat * 0.5;

    // Generate terrain height
    float height = 0.0;
    height += sin(groundUV.x * 4.0 + groundUV.y * 2.0) * 0.3;
    height += sin(groundUV.x * 8.0 - groundUV.y * 4.0 + time) * 0.15;
    height += sin(groundUV.x * 16.0 + time * 2.0) * 0.075 * energy;

    // Height line
    float terrainY = height * (1.0 - uv.y * 0.5) * energy;
    float line = smoothstep(0.02, 0.0, abs(uv.y - 0.3 - terrainY * 0.5));

    // Grid lines
    float gridX = smoothstep(0.02, 0.0, abs(fract(groundUV.x * 10.0) - 0.5) - 0.48);
    float gridY = smoothstep(0.02, 0.0, abs(fract(groundUV.y * 5.0) - 0.5) - 0.48);
    float grid = max(gridX, gridY) * smoothstep(-0.5, 0.5, uv.y) * 0.3;

    // Sun/horizon glow
    float sun = exp(-length(uv - vec2(0.0, 0.8)) * 3.0);

    // Color
    vec3 color = vec3(0.0);

    // Sky gradient
    float skyGrad = smoothstep(-0.2, 0.8, uv.y);
    color = mix(u_secondaryColor * 0.3, vec3(0.0), skyGrad);

    // Sun
    color += u_primaryColor * sun * 2.0;

    // Grid
    color += u_primaryColor * grid * perspective;

    // Terrain line
    color += u_primaryColor * line * 2.0 * (1.0 + energy);

    // Scanlines
    color *= 0.9 + 0.1 * sin(uv.y * 200.0);

    gl_FragColor = vec4(color, 1.0);
  }
`

// Geometric Pulse
export const geometricShader = `
  precision highp float;

  uniform vec3 u_primaryColor;
  uniform vec3 u_secondaryColor;
  uniform float u_time;
  uniform float u_energy;
  uniform float u_beat;

  varying vec2 v_position;

  float sdBox(vec2 p, vec2 b) {
    vec2 d = abs(p) - b;
    return length(max(d, 0.0)) + min(max(d.x, d.y), 0.0);
  }

  float sdCircle(vec2 p, float r) {
    return length(p) - r;
  }

  mat2 rotate(float a) {
    float c = cos(a), s = sin(a);
    return mat2(c, -s, s, c);
  }

  void main() {
    vec2 uv = v_position;
    float time = u_time;
    float energy = u_energy;

    vec3 color = vec3(0.0);

    // Multiple rotating shapes
    for (float i = 0.0; i < 5.0; i++) {
      vec2 p = uv * rotate(time * (0.2 + i * 0.1) + i);
      float scale = 0.3 + i * 0.15 - energy * 0.1;

      // Alternating shapes
      float shape;
      if (mod(i, 2.0) < 1.0) {
        shape = sdBox(p, vec2(scale));
      } else {
        shape = sdCircle(p, scale);
      }

      // Pulsing with beat
      float pulse = sin(u_beat * 2.0 + i * 1.5) * 0.05 * energy;
      shape += pulse;

      // Edge glow
      float edge = smoothstep(0.02, 0.0, abs(shape));
      float fill = smoothstep(0.0, -0.1, shape) * 0.1;

      // Color per layer
      vec3 layerColor = mix(u_primaryColor, u_secondaryColor, i / 5.0);
      color += layerColor * (edge + fill) * (1.0 - i * 0.15);
    }

    // Center glow
    float centerGlow = exp(-length(uv) * 3.0) * energy;
    color += u_primaryColor * centerGlow;

    // Energy boost
    color *= 0.8 + energy * 0.8;

    gl_FragColor = vec4(color, 1.0);
  }
`

// --- NEW MATRIX EFFECTS ---

// Game of Life Shader
// Uses ping-pong technique with state texture for cellular automaton
export const gameOfLifeShader = `
  precision highp float;

  uniform vec3 u_primaryColor;
  uniform vec3 u_secondaryColor;
  uniform float u_time;
  uniform float u_beat;
  uniform float u_bass;
  uniform vec2 u_resolution;
  uniform sampler2D u_state;
  uniform float u_cellSize;
  uniform float u_injectBeat;

  varying vec2 v_position;

  // Hash function for random
  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec2 uv = v_position * 0.5 + 0.5;
    float cellSize = u_cellSize / min(u_resolution.x, u_resolution.y);

    // Grid coordinates
    vec2 cellPos = floor(uv / cellSize);
    vec2 cellUV = fract(uv / cellSize);

    // Sample current state (stored in red channel)
    float state = texture2D(u_state, (cellPos + 0.5) * cellSize).r;

    // Count neighbors
    float neighbors = 0.0;
    for (float dx = -1.0; dx <= 1.0; dx++) {
      for (float dy = -1.0; dy <= 1.0; dy++) {
        if (dx == 0.0 && dy == 0.0) continue;
        vec2 neighborPos = (cellPos + vec2(dx, dy) + 0.5) * cellSize;
        neighbors += step(0.5, texture2D(u_state, neighborPos).r);
      }
    }

    // Game of Life rules (will be applied in JS, here we just visualize)
    // For now, create procedural life simulation
    float t = u_time * (0.5 + u_bass * 2.0);

    // Noise-based life simulation
    float n1 = hash(cellPos + floor(t));
    float n2 = hash(cellPos * 1.3 + floor(t * 0.7));
    float n3 = hash(cellPos * 0.7 + floor(t * 1.3));

    // Create evolving patterns
    float life = 0.0;
    life += step(0.7, sin(cellPos.x * 0.3 + t) * sin(cellPos.y * 0.3 + t * 0.7));
    life += step(0.8, n1 + n2 * sin(t * 2.0));

    // Beat injection - spawn random cells
    if (u_injectBeat > 0.5) {
      float beatRand = hash(cellPos + floor(u_time * 10.0));
      life += step(0.85, beatRand);
    }

    life = clamp(life, 0.0, 1.0);

    // Smooth cell edges
    float cellBorder = smoothstep(0.0, 0.05, cellUV.x) * smoothstep(1.0, 0.95, cellUV.x);
    cellBorder *= smoothstep(0.0, 0.05, cellUV.y) * smoothstep(1.0, 0.95, cellUV.y);

    // Color: dead = dark red/brown, alive = bright green/white
    vec3 deadColor = vec3(0.2, 0.05, 0.05);
    vec3 aliveColor = mix(vec3(0.0, 0.8, 0.2), vec3(1.0), life * u_bass);

    vec3 color = mix(deadColor, aliveColor, life);
    color *= cellBorder * 0.8 + 0.2;

    // Add glow for alive cells
    color += aliveColor * life * 0.3 * (1.0 - cellBorder);

    // Energy boost
    color *= 0.7 + u_bass * 0.5;

    gl_FragColor = vec4(color, 1.0);
  }
`

// Digital Rain Shader - Matrix-style falling code
export const digitalRainShader = `
  precision highp float;

  uniform vec3 u_primaryColor;
  uniform vec3 u_secondaryColor;
  uniform float u_time;
  uniform float u_bass;
  uniform float u_mid;
  uniform float u_high;
  uniform float u_beat;
  uniform vec2 u_resolution;
  uniform float u_density;
  uniform float u_speed;
  uniform float u_tailLength;
  uniform float u_glowIntensity;

  varying vec2 v_position;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  float randomChar(vec2 st) {
    return fract(sin(dot(st, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec2 uv = v_position * 0.5 + 0.5;
    float time = u_time * u_speed;

    // Column parameters
    float cols = 40.0 * u_density;
    float charHeight = 0.025;

    // Get column index
    float colIdx = floor(uv.x * cols);
    float colX = (colIdx + 0.5) / cols;

    // Per-column properties (seeded by column index)
    float colSeed = random(vec2(colIdx, 0.0));
    float colSpeed = 0.5 + colSeed * 1.5;
    float colOffset = colSeed * 10.0;

    // Audio modulation per column (distribute bass/mid/high across columns)
    float audioMod = 1.0;
    float colFrac = colIdx / cols;
    if (colFrac < 0.33) {
      audioMod += u_bass * 2.0;
    } else if (colFrac < 0.66) {
      audioMod += u_mid * 1.5;
    } else {
      audioMod += u_high * 1.0;
    }

    // Calculate fall position
    float fall = fract(time * colSpeed * audioMod * 0.3 + colOffset);
    float headY = 1.0 - fall;

    // Character grid
    float charRow = floor(uv.y / charHeight);
    float charY = (charRow + 0.5) * charHeight;

    // Distance from head
    float dist = charY - headY;

    // Tail effect
    float tail = u_tailLength;
    float inTail = step(0.0, dist) * step(dist, tail);
    float tailFade = 1.0 - (dist / tail);
    tailFade = pow(tailFade, 2.0) * inTail;

    // Head glow (brightest point)
    float headDist = abs(charY - headY);
    float headGlow = exp(-headDist * 50.0) * u_glowIntensity;

    // Character flicker
    float charSeed = random(vec2(colIdx, charRow + floor(time * 10.0)));
    float charBright = step(0.3, charSeed);

    // Combine
    float brightness = (tailFade * charBright * 0.8 + headGlow);

    // Color - green with white head
    vec3 greenColor = u_primaryColor;
    vec3 whiteColor = vec3(1.0);
    vec3 color = mix(greenColor, whiteColor, headGlow);
    color *= brightness;

    // Add subtle column variation
    color *= 0.8 + 0.2 * random(vec2(colIdx, 1.0));

    // Beat pulse - flash all active characters
    color += greenColor * u_beat * tailFade * 0.3;

    // Scanline effect
    float scanline = sin(uv.y * u_resolution.y * 2.0) * 0.1 + 0.9;
    color *= scanline;

    gl_FragColor = vec4(color, 1.0);
  }
`

// Flame Shader - Audio-reactive fire
export const flameShader = `
  precision highp float;

  uniform vec3 u_primaryColor;
  uniform vec3 u_secondaryColor;
  uniform float u_time;
  uniform float u_bass;
  uniform float u_mid;
  uniform float u_high;
  uniform float u_beat;
  uniform vec2 u_resolution;
  uniform float u_intensity;
  uniform float u_wobble;
  uniform vec3 u_lowColor;
  uniform vec3 u_midColor;
  uniform vec3 u_highColor;

  varying vec2 v_position;

  // Simplex noise functions
  vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
  vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

  float snoise(vec2 v) {
    const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
    vec2 i  = floor(v + dot(v, C.yy));
    vec2 x0 = v - i + dot(i, C.xx);
    vec2 i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
    vec4 x12 = x0.xyxy + C.xxzz;
    x12.xy -= i1;
    i = mod289(i);
    vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
    vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
    m = m*m; m = m*m;
    vec3 x = 2.0 * fract(p * C.www) - 1.0;
    vec3 h = abs(x) - 0.5;
    vec3 ox = floor(x + 0.5);
    vec3 a0 = x - ox;
    m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
    vec3 g;
    g.x = a0.x * x0.x + h.x * x0.y;
    g.yz = a0.yz * x12.xz + h.yz * x12.yw;
    return 130.0 * dot(m, g);
  }

  float fbm(vec2 p) {
    float f = 0.0;
    f += 0.5000 * snoise(p); p *= 2.02;
    f += 0.2500 * snoise(p); p *= 2.03;
    f += 0.1250 * snoise(p); p *= 2.01;
    f += 0.0625 * snoise(p);
    return f;
  }

  void main() {
    vec2 uv = v_position;
    uv.x *= u_resolution.x / u_resolution.y;

    float time = u_time;

    // Flame base position (from bottom)
    float flameBase = -1.0 + 0.2;

    // Distance from center bottom
    float distX = abs(uv.x);
    float distY = uv.y - flameBase;

    // Audio-driven wobble
    float wobbleX = snoise(vec2(uv.y * 3.0, time * 2.0)) * u_wobble;
    wobbleX *= (u_bass + u_mid * 0.5);
    uv.x += wobbleX * (1.0 - distY * 0.5);

    // Flame shape
    float flameWidth = 0.4 + u_bass * 0.3;
    float flameHeight = 0.8 + (u_bass + u_mid + u_high) * 0.3 * u_intensity;

    // Turbulent coordinates
    vec2 turbUV = uv * 3.0;
    turbUV.y -= time * 3.0;
    float turb = fbm(turbUV) * 0.5;

    // Flame density
    float flame = 1.0 - (distX / flameWidth);
    flame *= 1.0 - (distY / flameHeight);
    flame += turb * 0.5;
    flame = smoothstep(0.0, 1.0, flame);

    // Layer flames for bass/mid/high
    vec2 uv2 = uv;
    uv2.x += snoise(vec2(uv.y * 4.0, time * 3.0)) * u_wobble * u_mid;
    float flameMid = 1.0 - (abs(uv2.x) / (flameWidth * 0.7));
    flameMid *= 1.0 - (distY / (flameHeight * 0.8));
    flameMid += fbm(turbUV * 1.5 + 1.0) * 0.5;
    flameMid = smoothstep(0.0, 1.0, flameMid) * u_mid;

    vec2 uv3 = uv;
    uv3.x += snoise(vec2(uv.y * 5.0, time * 4.0)) * u_wobble * u_high;
    float flameHigh = 1.0 - (abs(uv3.x) / (flameWidth * 0.5));
    flameHigh *= 1.0 - (distY / (flameHeight * 0.6));
    flameHigh += fbm(turbUV * 2.0 + 2.0) * 0.5;
    flameHigh = smoothstep(0.0, 1.0, flameHigh) * u_high;

    // Combine colors
    vec3 color = vec3(0.0);
    color += u_lowColor * flame * (0.5 + u_bass);
    color += u_midColor * flameMid;
    color += u_highColor * flameHigh;

    // Inner glow (hottest part)
    float inner = flame * flameMid * flameHigh;
    color += vec3(1.0, 0.9, 0.7) * inner * 2.0;

    // Beat pulse
    color *= 1.0 + u_beat * 0.3;

    // Intensity
    color *= u_intensity;

    // Clip to positive Y
    color *= step(flameBase, uv.y);

    gl_FragColor = vec4(color, 1.0);
  }
`

// Plasma 2D Shader - Classic plasma effect with audio
export const plasma2dShader = `
  precision highp float;

  uniform vec3 u_primaryColor;
  uniform vec3 u_secondaryColor;
  uniform float u_time;
  uniform float u_energy;
  uniform float u_beat;
  uniform vec2 u_resolution;
  uniform float u_density;
  uniform float u_twist;

  varying vec2 v_position;

  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  void main() {
    vec2 uv = v_position;
    uv.x *= u_resolution.x / u_resolution.y;

    float time = u_time * 0.5;
    float energy = u_energy;

    // Scale based on energy
    float scale = u_density * (0.5 + energy * 1.5);

    // Plasma formula
    float v = 0.0;

    // First wave
    v += sin((uv.x * scale + time));

    // Second wave
    v += sin((uv.y * scale + time) * 0.5);

    // Third wave (circular)
    float cx = uv.x + 0.5 * sin(time * 0.3);
    float cy = uv.y + 0.5 * cos(time * 0.4);
    v += sin(sqrt(cx * cx + cy * cy + 1.0) * scale);

    // Fourth wave (diagonal with twist)
    float twist = u_twist * (1.0 + energy);
    v += sin((uv.x * cos(time * twist) + uv.y * sin(time * twist)) * scale);

    // Normalize to 0-1
    v = v * 0.25 + 0.5;

    // Beat modulation
    v += sin(u_beat * 3.14159) * 0.1;

    // Color mapping
    float hue = fract(v + time * 0.1);
    vec3 color = hsv2rgb(vec3(hue, 0.8, 0.9));

    // Mix with theme colors
    color = mix(color, u_primaryColor, sin(v * 3.14159) * 0.3 + 0.3);
    color = mix(color, u_secondaryColor, cos(v * 3.14159 * 2.0) * 0.2 + 0.2);

    // Energy boost
    color *= 0.7 + energy * 0.6;

    gl_FragColor = vec4(color, 1.0);
  }
`

// Equalizer 2D Shader - Spectrum analyzer with ring mode
export const equalizer2dShader = `
  precision highp float;

  uniform vec3 u_primaryColor;
  uniform vec3 u_secondaryColor;
  uniform float u_time;
  uniform float u_bass;
  uniform float u_mid;
  uniform float u_high;
  uniform float u_beat;
  uniform vec2 u_resolution;
  uniform sampler2D u_melbank;
  uniform float u_bands;
  uniform float u_ringMode;
  uniform float u_centerMode;
  uniform float u_spin;

  varying vec2 v_position;

  #define PI 3.14159265359

  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  void main() {
    vec2 uv = v_position;

    float bands = u_bands;
    vec3 color = vec3(0.0);

    if (u_ringMode > 0.5) {
      // Ring mode - polar coordinates
      float angle = atan(uv.y, uv.x) + PI + u_spin;
      float radius = length(uv);

      // Map angle to band index
      float bandAngle = 2.0 * PI / bands;
      float bandIdx = floor(mod(angle, 2.0 * PI) / bandAngle);
      float bandFrac = fract(mod(angle, 2.0 * PI) / bandAngle);

      // Sample melbank
      float melVal = texture2D(u_melbank, vec2((bandIdx + 0.5) / bands, 0.5)).r;

      // Bar dimensions in polar
      float innerRadius = 0.2;
      float maxRadius = 0.9;
      float barRadius = innerRadius + melVal * (maxRadius - innerRadius);

      // Draw bar
      float inBar = step(innerRadius, radius) * step(radius, barRadius);
      float edgeFade = smoothstep(0.0, 0.1, bandFrac) * smoothstep(1.0, 0.9, bandFrac);

      // Color by frequency
      float hue = bandIdx / bands;
      vec3 barColor = hsv2rgb(vec3(hue, 0.8, 1.0));

      color = barColor * inBar * edgeFade;

      // Peak glow
      float peakDist = abs(radius - barRadius);
      color += barColor * exp(-peakDist * 20.0) * 0.5;

      // Center glow
      color += u_primaryColor * exp(-radius * 5.0) * u_bass;

    } else {
      // Bar mode
      uv.x *= u_resolution.x / u_resolution.y;

      float barWidth = 2.0 / bands;
      float barIdx = floor((uv.x + 1.0) / barWidth);
      float barX = fract((uv.x + 1.0) / barWidth);

      if (barIdx >= 0.0 && barIdx < bands) {
        // Sample melbank
        float melVal = texture2D(u_melbank, vec2((barIdx + 0.5) / bands, 0.5)).r;

        float barHeight = melVal;
        float barY;

        if (u_centerMode > 0.5) {
          // Center mode - bars grow from middle
          barY = abs(uv.y);
          barHeight *= 0.5;
        } else {
          // Bottom mode - bars grow from bottom
          barY = (uv.y + 1.0) * 0.5;
        }

        // Draw bar
        float inBar = step(barY, barHeight);
        float edgeFade = smoothstep(0.0, 0.1, barX) * smoothstep(1.0, 0.9, barX);

        // Color by frequency
        float hue = barIdx / bands * 0.8;
        vec3 barColor = hsv2rgb(vec3(hue, 0.9, 1.0));

        color = barColor * inBar * edgeFade;

        // Top glow
        float topDist = abs(barY - barHeight);
        color += barColor * exp(-topDist * 30.0) * 0.5;
      }
    }

    // Beat flash
    color *= 1.0 + u_beat * 0.2;

    gl_FragColor = vec4(color, 1.0);
  }
`

// Noise 2D Shader - 3D Perlin noise with audio zoom
export const noise2dShader = `
  precision highp float;

  uniform vec3 u_primaryColor;
  uniform vec3 u_secondaryColor;
  uniform float u_time;
  uniform float u_bass;
  uniform float u_mid;
  uniform float u_high;
  uniform float u_beat;
  uniform vec2 u_resolution;
  uniform float u_zoom;
  uniform float u_speed;
  uniform float u_audioZoom;

  varying vec2 v_position;

  // Simplex 3D noise
  vec4 permute(vec4 x) { return mod(((x*34.0)+1.0)*x, 289.0); }
  vec4 taylorInvSqrt(vec4 r) { return 1.79284291400159 - 0.85373472095314 * r; }

  float snoise(vec3 v) {
    const vec2 C = vec2(1.0/6.0, 1.0/3.0);
    const vec4 D = vec4(0.0, 0.5, 1.0, 2.0);

    vec3 i  = floor(v + dot(v, C.yyy));
    vec3 x0 = v - i + dot(i, C.xxx);

    vec3 g = step(x0.yzx, x0.xyz);
    vec3 l = 1.0 - g;
    vec3 i1 = min(g.xyz, l.zxy);
    vec3 i2 = max(g.xyz, l.zxy);

    vec3 x1 = x0 - i1 + C.xxx;
    vec3 x2 = x0 - i2 + C.yyy;
    vec3 x3 = x0 - D.yyy;

    i = mod(i, 289.0);
    vec4 p = permute(permute(permute(
              i.z + vec4(0.0, i1.z, i2.z, 1.0))
            + i.y + vec4(0.0, i1.y, i2.y, 1.0))
            + i.x + vec4(0.0, i1.x, i2.x, 1.0));

    float n_ = 0.142857142857;
    vec3 ns = n_ * D.wyz - D.xzx;

    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);

    vec4 x_ = floor(j * ns.z);
    vec4 y_ = floor(j - 7.0 * x_);

    vec4 x = x_ *ns.x + ns.yyyy;
    vec4 y = y_ *ns.x + ns.yyyy;
    vec4 h = 1.0 - abs(x) - abs(y);

    vec4 b0 = vec4(x.xy, y.xy);
    vec4 b1 = vec4(x.zw, y.zw);

    vec4 s0 = floor(b0)*2.0 + 1.0;
    vec4 s1 = floor(b1)*2.0 + 1.0;
    vec4 sh = -step(h, vec4(0.0));

    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy;
    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww;

    vec3 p0 = vec3(a0.xy, h.x);
    vec3 p1 = vec3(a0.zw, h.y);
    vec3 p2 = vec3(a1.xy, h.z);
    vec3 p3 = vec3(a1.zw, h.w);

    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2,p2), dot(p3,p3)));
    p0 *= norm.x;
    p1 *= norm.y;
    p2 *= norm.z;
    p3 *= norm.w;

    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
    m = m * m;
    return 42.0 * dot(m*m, vec4(dot(p0,x0), dot(p1,x1), dot(p2,x2), dot(p3,x3)));
  }

  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  void main() {
    vec2 uv = v_position;
    uv.x *= u_resolution.x / u_resolution.y;

    float time = u_time * u_speed;

    // Audio-driven zoom
    float zoom = u_zoom * (1.0 - u_bass * u_audioZoom * 0.5);

    // Sample 3D noise
    vec3 noiseCoord = vec3(uv * zoom, time);

    // FBM for more detail
    float n = 0.0;
    float amp = 1.0;
    float freq = 1.0;
    for (int i = 0; i < 4; i++) {
      n += amp * snoise(noiseCoord * freq);
      amp *= 0.5;
      freq *= 2.0;
    }

    // Normalize to 0-1
    n = n * 0.5 + 0.5;

    // Audio modulation
    n += u_mid * 0.1 * sin(time * 5.0);
    n += u_high * 0.05 * sin(time * 10.0 + uv.x * 5.0);

    // Color mapping
    float hue = fract(n * 0.5 + time * 0.05);
    float sat = 0.7 + n * 0.3;
    float val = 0.3 + n * 0.7;

    vec3 color = hsv2rgb(vec3(hue, sat, val));

    // Mix with theme colors
    color = mix(color, u_primaryColor, (1.0 - n) * 0.3);
    color = mix(color, u_secondaryColor, n * 0.2);

    // Beat pulse
    color *= 1.0 + u_beat * 0.3;

    // Bass glow at center
    float centerDist = length(v_position);
    color += u_primaryColor * exp(-centerDist * 3.0) * u_bass * 0.5;

    gl_FragColor = vec4(color, 1.0);
  }
`

// --- ADDITIONAL MATRIX EFFECTS ---

// Blender Shader - Color blending patterns
export const blenderShader = `
  precision highp float;

  uniform vec3 u_primaryColor;
  uniform vec3 u_secondaryColor;
  uniform float u_time;
  uniform float u_bass;
  uniform float u_mid;
  uniform float u_high;
  uniform float u_beat;
  uniform vec2 u_resolution;
  uniform float u_speed;
  uniform float u_blur;

  varying vec2 v_position;

  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  void main() {
    vec2 uv = v_position;
    uv.x *= u_resolution.x / u_resolution.y;

    float time = u_time * u_speed;

    // Multiple moving color blobs
    vec3 color = vec3(0.0);

    for (float i = 0.0; i < 5.0; i++) {
      float phase = i * 1.256;
      vec2 center = vec2(
        sin(time * 0.5 + phase) * 0.5,
        cos(time * 0.7 + phase * 1.3) * 0.5
      );

      float dist = length(uv - center);
      float blob = exp(-dist * (3.0 - u_blur * 2.0));

      // Color for each blob
      float hue = fract(i * 0.2 + time * 0.1);
      vec3 blobColor = hsv2rgb(vec3(hue, 0.8, 1.0));

      // Audio modulation
      float audioMod = 1.0;
      if (i < 2.0) audioMod += u_bass * 0.5;
      else if (i < 4.0) audioMod += u_mid * 0.5;
      else audioMod += u_high * 0.5;

      color += blobColor * blob * audioMod;
    }

    // Blend with theme colors
    color = mix(color, u_primaryColor, 0.1);
    color = mix(color, u_secondaryColor, 0.1);

    // Beat pulse
    color *= 1.0 + u_beat * 0.3;

    gl_FragColor = vec4(color, 1.0);
  }
`

// Clone Shader - Mirrored/cloned patterns
export const cloneShader = `
  precision highp float;

  uniform vec3 u_primaryColor;
  uniform vec3 u_secondaryColor;
  uniform float u_time;
  uniform float u_bass;
  uniform float u_mid;
  uniform float u_high;
  uniform float u_beat;
  uniform vec2 u_resolution;
  uniform float u_mirrors;

  varying vec2 v_position;

  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  void main() {
    vec2 uv = v_position;
    uv.x *= u_resolution.x / u_resolution.y;

    float time = u_time;

    // Apply mirror effect
    float mirrors = max(1.0, u_mirrors);
    uv = abs(uv);
    uv = fract(uv * mirrors / 2.0) * 2.0 - 1.0;
    uv = abs(uv);

    // Create pattern
    float pattern = 0.0;
    float scale = 3.0 + u_bass * 2.0;

    pattern += sin(uv.x * scale + time);
    pattern += sin(uv.y * scale + time * 1.1);
    pattern += sin((uv.x + uv.y) * scale * 0.7 + time * 0.9);
    pattern += sin(length(uv) * scale * 1.5 - time * 1.3);

    pattern = pattern * 0.25 + 0.5;

    // Color
    float hue = fract(pattern + time * 0.1);
    vec3 color = hsv2rgb(vec3(hue, 0.7, 0.9));

    // Mix with theme
    color = mix(color, u_primaryColor, pattern * 0.3);
    color = mix(color, u_secondaryColor, (1.0 - pattern) * 0.2);

    // Beat flash
    color *= 1.0 + u_beat * 0.4;

    // Audio energy
    color *= 0.7 + (u_bass + u_mid + u_high) * 0.3;

    gl_FragColor = vec4(color, 1.0);
  }
`

// Bands Shader - Simple audio bars (1D style)
export const bandsShader = `
  precision highp float;

  uniform vec3 u_primaryColor;
  uniform vec3 u_secondaryColor;
  uniform float u_time;
  uniform float u_bass;
  uniform float u_mid;
  uniform float u_high;
  uniform float u_beat;
  uniform vec2 u_resolution;
  uniform sampler2D u_melbank;
  uniform float u_bands;
  uniform float u_flip;

  varying vec2 v_position;

  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  void main() {
    vec2 uv = v_position * 0.5 + 0.5;

    float bands = u_bands;
    float barWidth = 1.0 / bands;
    float barIdx = floor(uv.x * bands);
    float barX = fract(uv.x * bands);

    // Sample melbank
    float melVal = texture2D(u_melbank, vec2((barIdx + 0.5) / bands, 0.5)).r;

    // Bar height
    float barY = u_flip > 0.5 ? 1.0 - uv.y : uv.y;
    float inBar = step(barY, melVal);

    // Gap between bars
    float gap = smoothstep(0.0, 0.1, barX) * smoothstep(1.0, 0.9, barX);

    // Color gradient
    float hue = barIdx / bands * 0.7;
    vec3 barColor = hsv2rgb(vec3(hue, 0.8, 1.0));

    vec3 color = barColor * inBar * gap;

    // Glow at top
    float topGlow = exp(-abs(barY - melVal) * 20.0) * 0.5;
    color += barColor * topGlow * gap;

    // Beat pulse
    color *= 1.0 + u_beat * 0.2;

    gl_FragColor = vec4(color, 1.0);
  }
`

// Bands Matrix Shader - 2D grid of bands
export const bandsMatrixShader = `
  precision highp float;

  uniform vec3 u_primaryColor;
  uniform vec3 u_secondaryColor;
  uniform float u_time;
  uniform float u_bass;
  uniform float u_mid;
  uniform float u_high;
  uniform float u_beat;
  uniform vec2 u_resolution;
  uniform sampler2D u_melbank;
  uniform float u_bands;

  varying vec2 v_position;

  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  void main() {
    vec2 uv = v_position * 0.5 + 0.5;

    float bands = u_bands;
    float rows = bands * 0.5;

    vec2 gridPos = vec2(floor(uv.x * bands), floor(uv.y * rows));
    vec2 cellUV = fract(vec2(uv.x * bands, uv.y * rows));

    // Sample melbank for this column
    float melVal = texture2D(u_melbank, vec2((gridPos.x + 0.5) / bands, 0.5)).r;

    // Map row to threshold
    float rowThreshold = (gridPos.y + 1.0) / rows;
    float lit = step(rowThreshold, melVal);

    // Cell shape
    float cell = smoothstep(0.0, 0.1, cellUV.x) * smoothstep(1.0, 0.9, cellUV.x);
    cell *= smoothstep(0.0, 0.1, cellUV.y) * smoothstep(1.0, 0.9, cellUV.y);

    // Color by column
    float hue = gridPos.x / bands * 0.7;
    vec3 cellColor = hsv2rgb(vec3(hue, 0.8, 0.9));

    // Brightness by row
    cellColor *= 0.5 + (gridPos.y / rows) * 0.5;

    vec3 color = cellColor * lit * cell;

    // Beat pulse
    color *= 1.0 + u_beat * 0.3;

    gl_FragColor = vec4(color, 1.0);
  }
`

// Blocks Shader - Random colored blocks
export const blocksShader = `
  precision highp float;

  uniform vec3 u_primaryColor;
  uniform vec3 u_secondaryColor;
  uniform float u_time;
  uniform float u_bass;
  uniform float u_mid;
  uniform float u_high;
  uniform float u_beat;
  uniform vec2 u_resolution;
  uniform float u_blockSize;

  varying vec2 v_position;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  void main() {
    vec2 uv = v_position * 0.5 + 0.5;

    // Block grid
    float size = u_blockSize;
    vec2 blockPos = floor(uv * size);
    vec2 blockUV = fract(uv * size);

    // Random values per block
    float r1 = random(blockPos);
    float r2 = random(blockPos + 100.0);
    float r3 = random(blockPos + 200.0);

    // Timing - blocks change at different rates
    float changeRate = 0.5 + r1 * 2.0;
    float phase = floor(u_time * changeRate + r2 * 10.0);
    float nextPhase = phase + 1.0;

    // Interpolate between states
    float t = fract(u_time * changeRate + r2 * 10.0);
    t = smoothstep(0.0, 0.3, t) * smoothstep(1.0, 0.7, t);

    // Colors for current and next state
    float hue1 = random(blockPos + phase);
    float hue2 = random(blockPos + nextPhase);
    float hue = mix(hue1, hue2, t);

    // Audio reactivity
    float audioMod = 0.0;
    float blockFrac = (blockPos.x + blockPos.y * size) / (size * size);
    if (blockFrac < 0.33) audioMod = u_bass;
    else if (blockFrac < 0.66) audioMod = u_mid;
    else audioMod = u_high;

    // Brightness
    float brightness = 0.5 + audioMod * 0.5;
    brightness *= 0.8 + random(blockPos + phase * 0.1) * 0.4;

    vec3 color = hsv2rgb(vec3(hue, 0.7, brightness));

    // Block edges
    float edge = smoothstep(0.0, 0.05, blockUV.x) * smoothstep(1.0, 0.95, blockUV.x);
    edge *= smoothstep(0.0, 0.05, blockUV.y) * smoothstep(1.0, 0.95, blockUV.y);

    color *= edge * 0.8 + 0.2;

    // Beat flash
    color *= 1.0 + u_beat * 0.3;

    gl_FragColor = vec4(color, 1.0);
  }
`

// Keybeat2d Shader - Beat-reactive keyboard-style visualization
export const keybeat2dShader = `
  precision highp float;

  uniform vec3 u_primaryColor;
  uniform vec3 u_secondaryColor;
  uniform float u_time;
  uniform float u_bass;
  uniform float u_mid;
  uniform float u_high;
  uniform float u_beat;
  uniform vec2 u_resolution;
  uniform float u_keys;

  varying vec2 v_position;

  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  void main() {
    vec2 uv = v_position * 0.5 + 0.5;

    float keys = u_keys;
    float keyIdx = floor(uv.x * keys);
    float keyX = fract(uv.x * keys);

    // Key activation based on beat and randomness
    float seed = random(vec2(keyIdx, floor(u_time * 8.0)));
    float activated = step(0.7 - u_beat * 0.3, seed);

    // Key shape
    float keyShape = smoothstep(0.0, 0.1, keyX) * smoothstep(1.0, 0.9, keyX);
    keyShape *= smoothstep(0.0, 0.1, uv.y) * smoothstep(1.0, 0.9, uv.y);

    // Color
    float hue = keyIdx / keys;
    vec3 keyColor = hsv2rgb(vec3(hue, 0.8, 1.0));

    // Inactive keys are dim
    float brightness = 0.1 + activated * 0.9;

    // Audio modulation per key region
    float keyFrac = keyIdx / keys;
    if (keyFrac < 0.33) brightness *= 0.5 + u_bass;
    else if (keyFrac < 0.66) brightness *= 0.5 + u_mid;
    else brightness *= 0.5 + u_high;

    vec3 color = keyColor * keyShape * brightness;

    // Glow for activated keys
    if (activated > 0.5) {
      color += keyColor * exp(-length(vec2(keyX - 0.5, uv.y - 0.5)) * 3.0) * 0.3;
    }

    gl_FragColor = vec4(color, 1.0);
  }
`

// Texter Shader - Text/character-based visualization
export const texterShader = `
  precision highp float;

  uniform vec3 u_primaryColor;
  uniform vec3 u_secondaryColor;
  uniform float u_time;
  uniform float u_bass;
  uniform float u_mid;
  uniform float u_high;
  uniform float u_beat;
  uniform vec2 u_resolution;
  uniform float u_density;

  varying vec2 v_position;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  // Simple pseudo-character pattern
  float char(vec2 uv, float seed) {
    float pattern = 0.0;

    // Horizontal bars
    if (seed < 0.25) {
      pattern = step(0.4, uv.y) * step(uv.y, 0.6);
    }
    // Vertical bars
    else if (seed < 0.5) {
      pattern = step(0.4, uv.x) * step(uv.x, 0.6);
    }
    // Cross
    else if (seed < 0.75) {
      pattern = step(0.4, uv.x) * step(uv.x, 0.6);
      pattern += step(0.4, uv.y) * step(uv.y, 0.6);
      pattern = min(pattern, 1.0);
    }
    // Dot
    else {
      pattern = step(length(uv - 0.5), 0.2);
    }

    return pattern;
  }

  void main() {
    vec2 uv = v_position * 0.5 + 0.5;

    float cols = 20.0 * u_density;
    float rows = 10.0 * u_density;

    vec2 gridPos = floor(vec2(uv.x * cols, uv.y * rows));
    vec2 cellUV = fract(vec2(uv.x * cols, uv.y * rows));

    // Character seed (changes over time)
    float seed = random(gridPos + floor(u_time * 5.0));
    float charPattern = char(cellUV, seed);

    // Color
    float hue = fract(gridPos.x / cols + u_time * 0.1);
    vec3 charColor = mix(u_primaryColor, u_secondaryColor, sin(hue * 6.28) * 0.5 + 0.5);

    // Audio brightness
    float brightness = 0.3;
    float cellFrac = (gridPos.x + gridPos.y * cols) / (cols * rows);
    if (cellFrac < 0.33) brightness += u_bass * 0.7;
    else if (cellFrac < 0.66) brightness += u_mid * 0.7;
    else brightness += u_high * 0.7;

    vec3 color = charColor * charPattern * brightness;

    // Beat flash
    color += charColor * charPattern * u_beat * 0.3;

    gl_FragColor = vec4(color, 1.0);
  }
`

// PlasmaWled2d Shader - WLED-style plasma
export const plasmaWled2dShader = `
  precision highp float;

  uniform vec3 u_primaryColor;
  uniform vec3 u_secondaryColor;
  uniform float u_time;
  uniform float u_bass;
  uniform float u_mid;
  uniform float u_high;
  uniform float u_beat;
  uniform vec2 u_resolution;

  varying vec2 v_position;

  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  void main() {
    vec2 uv = v_position;
    uv.x *= u_resolution.x / u_resolution.y;

    float time = u_time * 0.5;

    // WLED-style plasma (simpler, faster)
    float v = 0.0;
    v += sin(uv.x * 10.0 + time);
    v += sin(uv.y * 10.0 + time * 1.1);
    v += sin((uv.x + uv.y) * 5.0 + time * 0.5);
    v += sin(sqrt(uv.x * uv.x + uv.y * uv.y) * 10.0);

    v = v * 0.25;

    // Audio modulation
    v += u_bass * sin(time * 3.0) * 0.2;
    v += u_mid * sin(time * 5.0 + uv.x * 3.0) * 0.1;

    // Color palette (WLED style - bright and saturated)
    float hue = fract(v + time * 0.1);
    vec3 color = hsv2rgb(vec3(hue, 1.0, 1.0));

    // Beat pulse
    color *= 0.8 + u_beat * 0.4;

    gl_FragColor = vec4(color, 1.0);
  }
`

// Radial Shader - Radial patterns
export const radialShader = `
  precision highp float;

  uniform vec3 u_primaryColor;
  uniform vec3 u_secondaryColor;
  uniform float u_time;
  uniform float u_bass;
  uniform float u_mid;
  uniform float u_high;
  uniform float u_beat;
  uniform vec2 u_resolution;
  uniform sampler2D u_melbank;
  uniform float u_bands;

  varying vec2 v_position;

  #define PI 3.14159265359

  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  void main() {
    vec2 uv = v_position;
    uv.x *= u_resolution.x / u_resolution.y;

    float angle = atan(uv.y, uv.x) + PI;
    float radius = length(uv);

    float bands = u_bands;
    float bandAngle = 2.0 * PI / bands;
    float bandIdx = floor(angle / bandAngle);
    float bandFrac = fract(angle / bandAngle);

    // Sample melbank
    float melVal = texture2D(u_melbank, vec2((bandIdx + 0.5) / bands, 0.5)).r;

    // Radial bar
    float barLength = 0.1 + melVal * 0.8;
    float inBar = step(0.1, radius) * step(radius, 0.1 + barLength);

    // Edge fade
    float edge = smoothstep(0.0, 0.2, bandFrac) * smoothstep(1.0, 0.8, bandFrac);

    // Color by angle
    float hue = bandIdx / bands;
    vec3 barColor = hsv2rgb(vec3(hue, 0.9, 1.0));

    vec3 color = barColor * inBar * edge;

    // Outer glow
    float glowDist = abs(radius - (0.1 + barLength));
    color += barColor * exp(-glowDist * 10.0) * 0.3 * edge;

    // Center glow
    color += u_primaryColor * exp(-radius * 5.0) * u_bass * 0.5;

    // Beat pulse
    color *= 1.0 + u_beat * 0.3;

    gl_FragColor = vec4(color, 1.0);
  }
`

// Soap Shader - Soap bubble/iridescent effect
export const soapShader = `
  precision highp float;

  uniform vec3 u_primaryColor;
  uniform vec3 u_secondaryColor;
  uniform float u_time;
  uniform float u_bass;
  uniform float u_mid;
  uniform float u_high;
  uniform float u_beat;
  uniform vec2 u_resolution;

  varying vec2 v_position;

  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  float noise(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec2 uv = v_position;
    uv.x *= u_resolution.x / u_resolution.y;

    float time = u_time * 0.3;

    // Create soap bubble interference pattern
    float thickness = 0.0;

    // Multiple sine waves for interference
    thickness += sin(uv.x * 20.0 + time + u_bass * 5.0);
    thickness += sin(uv.y * 15.0 - time * 1.1);
    thickness += sin((uv.x + uv.y) * 12.0 + time * 0.8);
    thickness += sin(length(uv) * 25.0 - time * 1.5 + u_mid * 3.0);
    thickness += sin(uv.x * uv.y * 30.0 + time * 0.5);

    thickness = thickness * 0.1 + 0.5;

    // Iridescent color (thin film interference)
    float hue = fract(thickness * 2.0 + time * 0.1);
    float sat = 0.6 + thickness * 0.3;
    float val = 0.7 + thickness * 0.3;

    vec3 color = hsv2rgb(vec3(hue, sat, val));

    // Add specular highlights
    vec2 lightPos = vec2(0.3, 0.3);
    float spec = exp(-length(uv - lightPos) * 3.0);
    color += vec3(1.0) * spec * 0.3;

    // Audio shimmer
    color *= 0.8 + (u_bass + u_mid + u_high) * 0.2;

    // Beat flash
    color *= 1.0 + u_beat * 0.2;

    gl_FragColor = vec4(color, 1.0);
  }
`

// Waterfall Shader - Scrolling frequency waterfall
export const waterfallShader = `
  precision highp float;

  uniform vec3 u_primaryColor;
  uniform vec3 u_secondaryColor;
  uniform float u_time;
  uniform float u_bass;
  uniform float u_mid;
  uniform float u_high;
  uniform float u_beat;
  uniform vec2 u_resolution;
  uniform sampler2D u_melbank;
  uniform float u_bands;
  uniform float u_speed;

  varying vec2 v_position;

  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  void main() {
    vec2 uv = v_position * 0.5 + 0.5;

    // Scrolling effect
    float scroll = fract(uv.y + u_time * u_speed * 0.1);

    // Frequency bands
    float bands = u_bands;
    float bandIdx = floor(uv.x * bands);

    // Sample current audio
    float melVal = texture2D(u_melbank, vec2((bandIdx + 0.5) / bands, 0.5)).r;

    // Create waterfall pattern
    // Use noise to simulate history since we can't store it
    float historyNoise = random(vec2(bandIdx, floor(scroll * 50.0)));
    float intensity = melVal * (1.0 - scroll) + historyNoise * scroll * 0.3;

    // Color by frequency and intensity
    float hue = bandIdx / bands * 0.7;
    float sat = 0.8;
    float val = intensity;

    vec3 color = hsv2rgb(vec3(hue, sat, val));

    // Add glow for high values
    color += hsv2rgb(vec3(hue, 0.5, 1.0)) * pow(intensity, 3.0) * 0.5;

    // Beat pulse
    color *= 1.0 + u_beat * 0.2;

    gl_FragColor = vec4(color, 1.0);
  }
`

// Image Shader - Audio-reactive shape with full configuration
export const imageShader = `
  precision highp float;

  uniform vec3 u_primaryColor;
  uniform vec3 u_secondaryColor;
  uniform vec3 u_bgColor;
  uniform float u_time;
  uniform float u_bass;
  uniform float u_mid;
  uniform float u_high;
  uniform float u_beat;
  uniform vec2 u_resolution;
  uniform float u_rotate;
  uniform float u_brightness;
  uniform float u_backgroundBrightness;
  uniform float u_multiplier;
  uniform float u_minSize;
  uniform float u_frequencyRange; // 0=lows, 1=mids, 2=highs
  uniform float u_clip;
  uniform float u_spin;

  varying vec2 v_position;

  void main() {
    vec2 uv = v_position * 0.5 + 0.5;
    vec2 center = uv - 0.5;

    // Get energy based on frequency range
    float energy = u_bass;
    if (u_frequencyRange > 0.5 && u_frequencyRange < 1.5) energy = u_mid;
    if (u_frequencyRange > 1.5) energy = u_high;

    // Apply rotation
    float angle = u_rotate * 3.14159 / 180.0;
    if (u_spin > 0.5) angle += u_time * 0.5;
    float cs = cos(angle);
    float sn = sin(angle);
    center = vec2(center.x * cs - center.y * sn, center.x * sn + center.y * cs);

    // Calculate size based on audio
    float size = u_minSize + energy * u_multiplier;

    // Create a circular shape
    float dist = length(center);
    float shape = smoothstep(size + 0.02, size - 0.02, dist);

    // Clip mode - hard edges
    if (u_clip > 0.5) {
      shape = dist < size ? 1.0 : 0.0;
    }

    // Mix foreground and background
    vec3 bgColor = u_bgColor * u_backgroundBrightness;
    vec3 fgColor = mix(u_primaryColor, u_secondaryColor, energy);

    vec3 color = mix(bgColor, fgColor, shape);

    // Apply brightness
    color *= u_brightness;

    // Beat pulse
    color *= 1.0 + u_beat * 0.15;

    gl_FragColor = vec4(color, 1.0);
  }
`

// GIF Player Shader - Already exists as gifFragmentShader, but adding alias
export const gifPlayerShader = gifFragmentShader
