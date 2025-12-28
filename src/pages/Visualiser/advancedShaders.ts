/**
 * Advanced WebGL Shaders for Audio Visualiser
 *
 * Beat-reactive, BPM-synchronized visual effects
 */

// Common vertex shader for fullscreen quad effects
export const fullscreenVertexShader = `
  attribute vec2 a_position;
  varying vec2 v_uv;
  varying vec2 v_position;

  void main() {
    v_position = a_position;
    v_uv = a_position * 0.5 + 0.5;
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`

// Audio Spectrum Rings - Concentric rings that pulse with frequency
export const spectrumRingsShader = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_bass;
  uniform float u_mid;
  uniform float u_high;
  uniform float u_beatIntensity;
  uniform float u_bpm;
  uniform vec3 u_primaryColor;
  uniform vec3 u_secondaryColor;
  uniform float u_energy;

  varying vec2 v_position;
  varying vec2 v_uv;

  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  void main() {
    vec2 uv = v_position;
    float dist = length(uv);
    float angle = atan(uv.y, uv.x);

    // Beat-synced time
    float beatTime = u_time * (u_bpm > 0.0 ? u_bpm / 120.0 : 1.0);

    // Multiple concentric rings with different frequencies
    float ring1 = sin(dist * 20.0 - beatTime * 4.0 + u_bass * 10.0) * 0.5 + 0.5;
    float ring2 = sin(dist * 15.0 - beatTime * 3.0 + u_mid * 8.0) * 0.5 + 0.5;
    float ring3 = sin(dist * 25.0 - beatTime * 5.0 + u_high * 12.0) * 0.5 + 0.5;

    // Combine rings with frequency bands
    float rings = ring1 * u_bass + ring2 * u_mid * 0.8 + ring3 * u_high * 0.6;

    // Beat pulse
    float pulse = 1.0 + u_beatIntensity * 0.5;

    // Radial gradient
    float fade = 1.0 - smoothstep(0.0, 1.5, dist * pulse);

    // Angular variation
    float angularPattern = sin(angle * 6.0 + beatTime) * 0.5 + 0.5;

    // Color based on frequency
    float hue = fract(u_bass * 0.3 + u_mid * 0.2 + beatTime * 0.1);
    vec3 freqColor = hsv2rgb(vec3(hue, 0.8, 0.9));

    // Mix colors
    vec3 color = mix(u_primaryColor, freqColor, rings * 0.7);
    color = mix(color, u_secondaryColor, angularPattern * 0.3);

    // Apply effects
    color *= fade;
    color *= (0.5 + rings * 0.5);
    color += u_primaryColor * exp(-dist * 3.0) * u_beatIntensity * 2.0;

    // Glow
    color += freqColor * exp(-dist * 2.0) * u_energy;

    gl_FragColor = vec4(color, 1.0);
  }
`

// Waveform Tunnel - 3D tunnel that morphs with audio
export const waveformTunnelShader = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_bass;
  uniform float u_mid;
  uniform float u_high;
  uniform float u_beatIntensity;
  uniform float u_energy;
  uniform vec3 u_primaryColor;
  uniform vec3 u_secondaryColor;
  uniform sampler2D u_frequencyTexture;

  varying vec2 v_position;
  varying vec2 v_uv;

  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  void main() {
    vec2 uv = v_position;
    float time = u_time * 0.5;

    // Tunnel effect
    float angle = atan(uv.y, uv.x);
    float radius = length(uv);

    // Tunnel depth
    float depth = 0.5 / (radius + 0.1);

    // Tunnel UV
    float tunnelX = angle / 3.14159;
    float tunnelY = depth - time;

    // Waveform distortion
    float wave = sin(tunnelX * 10.0 + tunnelY * 5.0 + u_bass * 10.0) * u_mid;
    wave += sin(tunnelX * 20.0 - tunnelY * 3.0) * u_high * 0.5;

    // Tunnel rings
    float rings = sin(depth * 20.0 - time * 5.0 + u_beatIntensity * 5.0);
    rings = smoothstep(0.0, 0.1, rings) - smoothstep(0.4, 0.5, rings);

    // Beat pulse on radius
    float pulse = 1.0 + u_beatIntensity * 0.3;

    // Color gradient through tunnel
    float hue = fract(depth * 0.2 + time * 0.1 + u_bass * 0.3);
    vec3 tunnelColor = hsv2rgb(vec3(hue, 0.7, 0.8));

    // Mix with theme colors
    vec3 color = mix(u_primaryColor, tunnelColor, 0.6);
    color = mix(color, u_secondaryColor, rings * 0.5);

    // Apply depth fade
    color *= smoothstep(5.0, 0.5, depth);

    // Add edge glow
    color += u_primaryColor * rings * 0.5;

    // Beat flash
    color += u_secondaryColor * u_beatIntensity * 0.3;

    // Center glow
    float centerGlow = exp(-radius * 3.0) * u_energy * 2.0;
    color += u_primaryColor * centerGlow;

    // Vignette
    color *= 1.0 - smoothstep(0.5, 1.5, radius);

    gl_FragColor = vec4(color, 1.0);
  }
`

// Particle Galaxy - Swirling particles that react to audio
export const particleGalaxyShader = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_bass;
  uniform float u_mid;
  uniform float u_high;
  uniform float u_beatIntensity;
  uniform float u_energy;
  uniform vec3 u_primaryColor;
  uniform vec3 u_secondaryColor;

  varying vec2 v_position;

  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
  }

  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  void main() {
    vec2 uv = v_position;
    float time = u_time * 0.3;

    // Polar coordinates
    float angle = atan(uv.y, uv.x);
    float radius = length(uv);

    // Spiral arms
    float arms = 3.0;
    float spiral = angle * arms + radius * 5.0 - time * 2.0;
    spiral += u_bass * 2.0;

    // Particle field
    vec2 particleUV = uv * 10.0;
    particleUV += vec2(sin(time), cos(time)) * u_mid;

    float particles = 0.0;
    for (float i = 0.0; i < 3.0; i++) {
      vec2 p = particleUV * (1.0 + i * 0.5);
      p += vec2(time * (0.5 + i * 0.2));
      float n = noise(p);
      particles += smoothstep(0.7, 0.9, n) * (1.0 - i * 0.2);
    }

    // Spiral structure
    float spiralPattern = sin(spiral) * 0.5 + 0.5;
    spiralPattern *= smoothstep(1.5, 0.2, radius);

    // Galaxy core glow
    float core = exp(-radius * 3.0) * (1.0 + u_beatIntensity);

    // Color gradient
    float hue = fract(angle / 6.28318 + time * 0.1 + u_mid * 0.3);
    vec3 galaxyColor = hsv2rgb(vec3(hue, 0.6, 0.8));

    // Combine
    vec3 color = vec3(0.0);
    color += galaxyColor * spiralPattern * 0.5;
    color += u_primaryColor * particles * u_energy;
    color += u_secondaryColor * core * 2.0;

    // Beat pulse
    color += u_primaryColor * u_beatIntensity * 0.4 * smoothstep(1.0, 0.0, radius);

    // Star points
    float stars = step(0.98, random(floor(uv * 50.0)));
    stars *= sin(time * 5.0 + random(floor(uv * 50.0)) * 10.0) * 0.5 + 0.5;
    color += vec3(1.0) * stars * u_high;

    gl_FragColor = vec4(color, 1.0);
  }
`

// Neon Grid - Retro grid with audio-reactive waves
export const neonGridShader = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_bass;
  uniform float u_mid;
  uniform float u_high;
  uniform float u_beatIntensity;
  uniform float u_energy;
  uniform vec3 u_primaryColor;
  uniform vec3 u_secondaryColor;

  varying vec2 v_position;
  varying vec2 v_uv;

  void main() {
    vec2 uv = v_position;
    float time = u_time;

    // Perspective transform for ground plane
    float horizon = 0.0;
    float perspective = 1.0 / (uv.y - horizon + 0.5);
    vec2 groundUV = vec2(uv.x * perspective * 2.0, perspective);

    // Scroll
    groundUV.y -= time * 2.0 + u_bass * 2.0;

    // Grid lines
    float gridX = abs(sin(groundUV.x * 10.0));
    float gridY = abs(sin(groundUV.y * 5.0));

    float lineWidth = 0.05 + u_beatIntensity * 0.02;
    float grid = smoothstep(lineWidth, 0.0, gridX) + smoothstep(lineWidth, 0.0, gridY);

    // Wave on horizon
    float wave = sin(uv.x * 10.0 + time * 3.0) * u_bass * 0.1;
    wave += sin(uv.x * 20.0 - time * 2.0) * u_mid * 0.05;

    // Horizon line
    float horizonLine = smoothstep(0.02, 0.0, abs(uv.y - horizon - wave));

    // Sun
    vec2 sunPos = vec2(0.0, 0.3);
    float sunDist = length(uv - sunPos);
    float sun = smoothstep(0.3, 0.0, sunDist);
    float sunRays = sin(atan(uv.y - sunPos.y, uv.x - sunPos.x) * 20.0 + time) * 0.5 + 0.5;
    sun += sunRays * smoothstep(0.5, 0.2, sunDist) * 0.3;

    // Ground fade
    float groundFade = smoothstep(horizon - 0.5, horizon, uv.y);

    // Sky gradient
    vec3 skyColor = mix(vec3(0.0, 0.0, 0.1), vec3(0.1, 0.0, 0.2), uv.y + 0.5);

    // Colors
    vec3 color = skyColor;

    // Sun
    color += u_secondaryColor * sun * 2.0;

    // Grid
    color += u_primaryColor * grid * perspective * 0.5 * groundFade;

    // Horizon glow
    color += mix(u_primaryColor, u_secondaryColor, 0.5) * horizonLine * 2.0;

    // Mountains silhouette
    float mountain = sin(uv.x * 3.0 + 1.0) * 0.1 + sin(uv.x * 7.0) * 0.05;
    mountain = smoothstep(horizon + mountain + 0.05, horizon + mountain, uv.y);
    color *= 1.0 - mountain * 0.8;

    // Beat pulse
    color += u_primaryColor * u_beatIntensity * 0.2;

    // Scanlines
    color *= 0.95 + 0.05 * sin(v_uv.y * u_resolution.y * 2.0);

    gl_FragColor = vec4(color, 1.0);
  }
`

// Audio DNA - Double helix that reacts to frequency
export const audioDNAShader = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_bass;
  uniform float u_mid;
  uniform float u_high;
  uniform float u_beatIntensity;
  uniform float u_energy;
  uniform vec3 u_primaryColor;
  uniform vec3 u_secondaryColor;

  varying vec2 v_position;

  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  void main() {
    vec2 uv = v_position;
    float time = u_time * 0.5;

    // DNA helix parameters
    float twist = 8.0;
    float amplitude = 0.3 + u_bass * 0.2;

    // Two helices
    float helix1 = sin(uv.y * twist + time * 2.0) * amplitude;
    float helix2 = sin(uv.y * twist + time * 2.0 + 3.14159) * amplitude;

    // Distance to helices
    float dist1 = abs(uv.x - helix1);
    float dist2 = abs(uv.x - helix2);

    // Helix lines
    float lineWidth = 0.02 + u_mid * 0.02;
    float line1 = smoothstep(lineWidth, 0.0, dist1);
    float line2 = smoothstep(lineWidth, 0.0, dist2);

    // Connecting bars
    float barPhase = fract(uv.y * twist / 6.28318 + time * 0.3);
    float barDist = abs(barPhase - 0.5);
    float showBar = step(barDist, 0.1);

    float barX = mix(helix1, helix2, barPhase * 2.0);
    float barLine = smoothstep(lineWidth * 0.5, 0.0, abs(uv.x - barX)) * showBar;
    barLine *= step(min(helix1, helix2), uv.x) * step(uv.x, max(helix1, helix2));

    // Node points
    float nodes = 0.0;
    for (float i = -5.0; i < 5.0; i++) {
      float y = i * 0.4 + fract(time * 0.5) * 0.4;
      if (abs(uv.y - y) < 0.5) {
        float x1 = sin(y * twist + time * 2.0) * amplitude;
        float x2 = sin(y * twist + time * 2.0 + 3.14159) * amplitude;
        nodes += smoothstep(0.05, 0.0, length(uv - vec2(x1, y)));
        nodes += smoothstep(0.05, 0.0, length(uv - vec2(x2, y)));
      }
    }

    // Color based on position
    float hue = fract(uv.y * 0.2 + time * 0.1);
    vec3 helixColor = hsv2rgb(vec3(hue, 0.7, 0.9));

    // Combine
    vec3 color = vec3(0.0);
    color += u_primaryColor * line1;
    color += u_secondaryColor * line2;
    color += mix(u_primaryColor, u_secondaryColor, 0.5) * barLine * 0.7;
    color += helixColor * nodes * 2.0;

    // Glow
    float glow1 = smoothstep(0.3, 0.0, dist1);
    float glow2 = smoothstep(0.3, 0.0, dist2);
    color += u_primaryColor * glow1 * 0.3 * u_energy;
    color += u_secondaryColor * glow2 * 0.3 * u_energy;

    // Beat pulse
    color += vec3(1.0) * nodes * u_beatIntensity;

    // Fade edges
    color *= smoothstep(1.0, 0.5, abs(uv.y));

    gl_FragColor = vec4(color, 1.0);
  }
`

// Frequency Bars 3D - Modern spectrum analyzer
export const frequencyBars3DShader = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_bass;
  uniform float u_mid;
  uniform float u_high;
  uniform float u_beatIntensity;
  uniform float u_energy;
  uniform vec3 u_primaryColor;
  uniform vec3 u_secondaryColor;
  uniform sampler2D u_frequencyTexture;

  varying vec2 v_position;
  varying vec2 v_uv;

  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  void main() {
    vec2 uv = v_uv;

    // Number of bars
    float numBars = 32.0;
    float barIndex = floor(uv.x * numBars);
    float barX = (barIndex + 0.5) / numBars;

    // Sample frequency
    float freq = texture2D(u_frequencyTexture, vec2(barX, 0.5)).r;
    freq = pow(freq, 0.8) * (1.0 + u_beatIntensity * 0.5);

    // Bar dimensions
    float barWidth = 0.7 / numBars;
    float barLocalX = fract(uv.x * numBars) - 0.5;

    // Bar shape
    float inBar = step(abs(barLocalX), barWidth * numBars * 0.5);
    float barHeight = freq;

    // Draw bar
    float bar = inBar * step(uv.y, barHeight);

    // Top cap with glow
    float topGlow = smoothstep(0.05, 0.0, abs(uv.y - barHeight)) * inBar;

    // Reflection
    float reflection = inBar * step(uv.y, -barHeight * 0.3) * step(-0.3, uv.y);
    reflection *= (1.0 + uv.y / 0.3) * 0.3;

    // Color gradient based on height
    float hue = barHeight * 0.3 + barX * 0.2;
    vec3 barColor = hsv2rgb(vec3(hue, 0.8, 0.9));
    barColor = mix(u_primaryColor, barColor, 0.6);

    // Apply bar
    vec3 color = vec3(0.0);
    color += barColor * bar * (0.5 + uv.y / barHeight * 0.5);
    color += u_secondaryColor * topGlow * 2.0;
    color += barColor * reflection * 0.5;

    // Beat flash
    color += u_primaryColor * u_beatIntensity * 0.1 * bar;

    // Background gradient
    vec3 bg = mix(vec3(0.02, 0.02, 0.05), vec3(0.0), uv.y + 0.5);
    color = mix(bg, color, step(0.01, bar + topGlow + reflection));

    gl_FragColor = vec4(color, 1.0);
  }
`

// Plasma Wave - Organic flowing patterns
export const plasmaWaveShader = `
  precision highp float;

  uniform vec2 u_resolution;
  uniform float u_time;
  uniform float u_bass;
  uniform float u_mid;
  uniform float u_high;
  uniform float u_beatIntensity;
  uniform float u_energy;
  uniform vec3 u_primaryColor;
  uniform vec3 u_secondaryColor;

  varying vec2 v_position;

  vec3 hsv2rgb(vec3 c) {
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
  }

  void main() {
    vec2 uv = v_position * 2.0;
    float time = u_time * 0.5;

    // Multiple plasma layers
    float plasma = 0.0;

    // Layer 1 - Slow moving base
    plasma += sin(uv.x * 3.0 + time + u_bass * 5.0);
    plasma += sin(uv.y * 3.0 + time * 0.7);
    plasma += sin((uv.x + uv.y) * 2.0 + time * 0.5);

    // Layer 2 - Medium detail
    plasma += sin(length(uv) * 5.0 - time * 2.0 + u_mid * 3.0) * 0.5;
    plasma += sin(atan(uv.y, uv.x) * 4.0 + time) * 0.5;

    // Layer 3 - Fine detail
    vec2 rotUV = vec2(
      uv.x * cos(time * 0.2) - uv.y * sin(time * 0.2),
      uv.x * sin(time * 0.2) + uv.y * cos(time * 0.2)
    );
    plasma += sin(rotUV.x * 8.0 + u_high * 5.0) * 0.3;
    plasma += sin(rotUV.y * 8.0 - time) * 0.3;

    // Normalize
    plasma = plasma / 5.0;
    plasma = plasma * 0.5 + 0.5;

    // Beat modulation
    plasma = pow(plasma, 1.0 - u_beatIntensity * 0.3);

    // Color mapping
    float hue = plasma * 0.5 + time * 0.05 + u_bass * 0.2;
    vec3 plasmaColor = hsv2rgb(vec3(hue, 0.7, 0.8));

    // Mix with theme colors
    vec3 color = mix(u_primaryColor, plasmaColor, 0.7);
    color = mix(color, u_secondaryColor, sin(plasma * 3.14159) * 0.3);

    // Brightness based on energy
    color *= 0.5 + u_energy * 1.0;

    // Center glow on beat
    float centerDist = length(v_position);
    color += u_primaryColor * exp(-centerDist * 2.0) * u_beatIntensity;

    // Vignette
    color *= 1.0 - centerDist * 0.3;

    gl_FragColor = vec4(color, 1.0);
  }
`

// Shader collection type
export interface ShaderInfo {
  name: string
  displayName: string
  fragment: string
  vertex: string
  description: string
  category: 'geometric' | 'organic' | 'retro' | 'spectrum'
}

export const advancedShaders: ShaderInfo[] = [
  {
    name: 'spectrumRings',
    displayName: 'Spectrum Rings',
    fragment: spectrumRingsShader,
    vertex: fullscreenVertexShader,
    description: 'Concentric rings pulsing with frequency bands',
    category: 'spectrum'
  },
  {
    name: 'waveformTunnel',
    displayName: 'Waveform Tunnel',
    fragment: waveformTunnelShader,
    vertex: fullscreenVertexShader,
    description: '3D tunnel morphing with audio',
    category: 'geometric'
  },
  {
    name: 'particleGalaxy',
    displayName: 'Particle Galaxy',
    fragment: particleGalaxyShader,
    vertex: fullscreenVertexShader,
    description: 'Swirling galaxy of audio-reactive particles',
    category: 'organic'
  },
  {
    name: 'neonGrid',
    displayName: 'Neon Grid',
    fragment: neonGridShader,
    vertex: fullscreenVertexShader,
    description: 'Retro synthwave grid with audio waves',
    category: 'retro'
  },
  {
    name: 'audioDNA',
    displayName: 'Audio DNA',
    fragment: audioDNAShader,
    vertex: fullscreenVertexShader,
    description: 'Double helix reacting to frequencies',
    category: 'organic'
  },
  {
    name: 'frequencyBars3D',
    displayName: 'Spectrum Bars',
    fragment: frequencyBars3DShader,
    vertex: fullscreenVertexShader,
    description: 'Modern 3D spectrum analyzer',
    category: 'spectrum'
  },
  {
    name: 'plasmaWave',
    displayName: 'Plasma Wave',
    fragment: plasmaWaveShader,
    vertex: fullscreenVertexShader,
    description: 'Organic flowing plasma patterns',
    category: 'organic'
  }
]

export default advancedShaders
