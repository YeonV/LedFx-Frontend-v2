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
export function createShader(gl: WebGLRenderingContext, type: number, source: string): WebGLShader | null {
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
