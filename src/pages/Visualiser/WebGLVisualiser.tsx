import { useRef, useEffect, useCallback, useState } from 'react'
import { useTheme } from '@mui/material/styles'
import {
  createShader,
  createProgram,
  vertexShaderSource,
  fragmentShaderSource,
  spectrumFragmentShader,
  particleVertexShader,
  particleFragmentShader,
  bleepFragmentShader,
  concentricFragmentShader,
  gifFragmentShader,
  quadVertexShader,
  hexToRgb,
  matrixRainShader,
  terrainShader,
  geometricShader
} from './shaders'

export type WebGLVisualisationType = 'bars3d' | 'particles' | 'waveform3d' | 'radial3d' | 'bleep' | 'concentric' | 'gif' | 'matrix' | 'terrain' | 'geometric'

interface WebGLVisualiserProps {
  audioData: number[]
  isPlaying: boolean
  visualType: WebGLVisualisationType
  config: Record<string, any>
  customShader?: string
  beatData?: {
    isBeat: boolean
    beatIntensity: number
    bpm: number
  }
}

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  life: number
  size: number
  amplitude: number
}

const MAX_PARTICLES = 2000

export const WebGLVisualiser = ({
  audioData,
  isPlaying,
  visualType,
  config,
  customShader,
  beatData
}: WebGLVisualiserProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const glRef = useRef<WebGLRenderingContext | null>(null)
  const programRef = useRef<WebGLProgram | null>(null)
  const animationRef = useRef<number | undefined>(undefined)
  const startTimeRef = useRef<number>(Date.now())
  const previousDataRef = useRef<number[]>([])
  const particlesRef = useRef<Particle[]>([])
  const historyRef = useRef<number[]>(new Array(128).fill(0))
  const beatRef = useRef<number>(0)

  const theme = useTheme()

  // Extract common config with defaults
  const sensitivity = config.sensitivity ?? 1.0
  const smoothing = config.smoothing ?? 0.5

  // Initialize WebGL
  const initWebGL = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return false

    const gl = canvas.getContext('webgl', {
      alpha: true,
      antialias: true,
      premultipliedAlpha: false
    })

    if (!gl) {
      console.error('WebGL not supported')
      return false
    }

    glRef.current = gl

    // Create shaders based on visual type
    let vertexSource = vertexShaderSource
    let fragmentSource = customShader || fragmentShaderSource

    if (!customShader) {
      if (visualType === 'particles') {
        vertexSource = particleVertexShader
        fragmentSource = particleFragmentShader
      } else if (visualType === 'radial3d') {
        fragmentSource = spectrumFragmentShader
      } else if (visualType === 'bleep') {
        vertexSource = quadVertexShader
        fragmentSource = bleepFragmentShader
      } else if (visualType === 'concentric') {
        vertexSource = quadVertexShader
        fragmentSource = concentricFragmentShader
      } else if (visualType === 'gif') {
        vertexSource = quadVertexShader
        fragmentSource = gifFragmentShader
      } else if (visualType === 'matrix') {
        vertexSource = quadVertexShader
        fragmentSource = matrixRainShader
      } else if (visualType === 'terrain') {
        vertexSource = quadVertexShader
        fragmentSource = terrainShader
      } else if (visualType === 'geometric') {
        vertexSource = quadVertexShader
        fragmentSource = geometricShader
      }
    } else {
       // If custom shader, assume it's a quad shader (fullscreen effect)
       vertexSource = quadVertexShader
    }

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexSource)
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentSource)

    if (!vertexShader || !fragmentShader) return false

    const program = createProgram(gl, vertexShader, fragmentShader)
    if (!program) return false

    programRef.current = program
    gl.useProgram(program)

    // Enable blending for transparency
    gl.enable(gl.BLEND)
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA)

    return true
  }, [visualType, customShader])

  // Apply smoothing
  const getSmoothData = useCallback(
    (data: number[]): number[] => {
      if (previousDataRef.current.length !== data.length) {
        previousDataRef.current = [...data]
        return data
      }

      const smoothed = data.map((val, i) => {
        const prev = previousDataRef.current[i] || 0
        return prev * smoothing + val * (1 - smoothing)
      })
      previousDataRef.current = smoothed
      return smoothed
    },
    [smoothing]
  )

  // Draw bars with 3D effect
  const drawBars3D = useCallback(
    (gl: WebGLRenderingContext, data: number[], width: number, height: number) => {
      const program = programRef.current
      if (!program) return

      const bufferLength = data.length
      const barWidth = width / bufferLength
      const vertices: number[] = []
      const amplitudes: number[] = []
      const indices: number[] = []

      for (let i = 0; i < bufferLength; i++) {
        const amplitude = Math.min(data[i] * sensitivity * 0.5, 1)
        const barHeight = amplitude * height
        const x = i * barWidth
        const w = barWidth - 2
        const depth = amplitude * 20 // 3D depth effect

        // Front face (2 triangles)
        // BL, BR, TR, BL, TR, TL
        vertices.push(
          x, height,
          x + w, height,
          x + w, height - barHeight,
          x, height,
          x + w, height - barHeight,
          x, height - barHeight
        )

        // Top/Depth face (2 triangles)
        // TL, TR, TR_D, TL, TR_D, TL_D
        vertices.push(
          x, height - barHeight,
          x + w, height - barHeight,
          x + w + depth, height - barHeight - depth,
          x, height - barHeight,
          x + w + depth, height - barHeight - depth,
          x + depth, height - barHeight - depth
        )

        for (let j = 0; j < 12; j++) {
          amplitudes.push(amplitude)
          indices.push(i / bufferLength)
        }
      }

      // Create and bind buffers
      const positionBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW)

      const positionLoc = gl.getAttribLocation(program, 'a_position')
      gl.enableVertexAttribArray(positionLoc)
      gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)

      // Amplitude buffer
      const amplitudeBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, amplitudeBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(amplitudes), gl.DYNAMIC_DRAW)

      const amplitudeLoc = gl.getAttribLocation(program, 'a_amplitude')
      if (amplitudeLoc !== -1) {
        gl.enableVertexAttribArray(amplitudeLoc)
        gl.vertexAttribPointer(amplitudeLoc, 1, gl.FLOAT, false, 0, 0)
      }

      // Index buffer
      const indexBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, indexBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(indices), gl.DYNAMIC_DRAW)

      const indexLoc = gl.getAttribLocation(program, 'a_index')
      if (indexLoc !== -1) {
        gl.enableVertexAttribArray(indexLoc)
        gl.vertexAttribPointer(indexLoc, 1, gl.FLOAT, false, 0, 0)
      }

      // Set uniforms
      const resolutionLoc = gl.getUniformLocation(program, 'u_resolution')
      gl.uniform2f(resolutionLoc, width, height)

      const timeLoc = gl.getUniformLocation(program, 'u_time')
      gl.uniform1f(timeLoc, (Date.now() - startTimeRef.current) / 1000)

      const primaryColorLoc = gl.getUniformLocation(program, 'u_primaryColor')
      const secondaryColorLoc = gl.getUniformLocation(program, 'u_secondaryColor')
      const primaryRgb = hexToRgb(theme.palette.primary.main)
      const secondaryRgb = hexToRgb(theme.palette.secondary.main)
      gl.uniform3f(primaryColorLoc, ...primaryRgb)
      gl.uniform3f(secondaryColorLoc, ...secondaryRgb)

      // Draw
      gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2)

      // Cleanup
      gl.deleteBuffer(positionBuffer)
      gl.deleteBuffer(amplitudeBuffer)
      gl.deleteBuffer(indexBuffer)
    },
    [sensitivity, theme.palette.primary.main, theme.palette.secondary.main]
  )

  // Draw particles
  const drawParticles = useCallback(
    (gl: WebGLRenderingContext, data: number[], width: number, height: number) => {
      const program = programRef.current
      if (!program) return

      // Calculate average amplitude for particle spawning
      const avgAmplitude = data.reduce((a, b) => a + b, 0) / data.length

      // Spawn new particles based on audio intensity
      const spawnCount = Math.floor(avgAmplitude * sensitivity * 20)
      for (let i = 0; i < spawnCount && particlesRef.current.length < MAX_PARTICLES; i++) {
        const freqIndex = Math.floor(Math.random() * data.length)
        const amp = data[freqIndex] * sensitivity * 0.5

        particlesRef.current.push({
          x: (freqIndex / data.length) * width,
          y: height,
          vx: (Math.random() - 0.5) * 2,
          vy: -Math.random() * 3 - 1,
          life: 0,
          size: Math.random() * 8 + 4,
          amplitude: amp
        })
      }

      // Update particles
      const dt = 0.016 // ~60fps
      particlesRef.current = particlesRef.current.filter((p) => {
        p.x += p.vx * 60 * dt
        p.y += p.vy * 60 * dt
        p.vy -= 0.1 // Gravity
        p.life += dt * 0.5

        return p.life < 1 && p.y > 0 && p.x > 0 && p.x < width
      })

      if (particlesRef.current.length === 0) return

      // Prepare vertex data
      const positions: number[] = []
      const velocities: number[] = []
      const lives: number[] = []
      const sizes: number[] = []
      const amplitudesArr: number[] = []

      particlesRef.current.forEach((p) => {
        positions.push(p.x, p.y)
        velocities.push(p.vx, p.vy)
        lives.push(p.life)
        sizes.push(p.size)
        amplitudesArr.push(p.amplitude)
      })

      // Position buffer
      const positionBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.DYNAMIC_DRAW)

      const positionLoc = gl.getAttribLocation(program, 'a_position')
      gl.enableVertexAttribArray(positionLoc)
      gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)

      // Velocity buffer
      const velocityBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, velocityBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(velocities), gl.DYNAMIC_DRAW)

      const velocityLoc = gl.getAttribLocation(program, 'a_velocity')
      if (velocityLoc !== -1) {
        gl.enableVertexAttribArray(velocityLoc)
        gl.vertexAttribPointer(velocityLoc, 2, gl.FLOAT, false, 0, 0)
      }

      // Life buffer
      const lifeBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, lifeBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(lives), gl.DYNAMIC_DRAW)

      const lifeLoc = gl.getAttribLocation(program, 'a_life')
      if (lifeLoc !== -1) {
        gl.enableVertexAttribArray(lifeLoc)
        gl.vertexAttribPointer(lifeLoc, 1, gl.FLOAT, false, 0, 0)
      }

      // Size buffer
      const sizeBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, sizeBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(sizes), gl.DYNAMIC_DRAW)

      const sizeLoc = gl.getAttribLocation(program, 'a_size')
      if (sizeLoc !== -1) {
        gl.enableVertexAttribArray(sizeLoc)
        gl.vertexAttribPointer(sizeLoc, 1, gl.FLOAT, false, 0, 0)
      }

      // Amplitude buffer
      const amplitudeBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, amplitudeBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(amplitudesArr), gl.DYNAMIC_DRAW)

      const amplitudeLoc = gl.getAttribLocation(program, 'a_amplitude')
      if (amplitudeLoc !== -1) {
        gl.enableVertexAttribArray(amplitudeLoc)
        gl.vertexAttribPointer(amplitudeLoc, 1, gl.FLOAT, false, 0, 0)
      }

      // Set uniforms
      const resolutionLoc = gl.getUniformLocation(program, 'u_resolution')
      gl.uniform2f(resolutionLoc, width, height)

      const timeLoc = gl.getUniformLocation(program, 'u_time')
      gl.uniform1f(timeLoc, (Date.now() - startTimeRef.current) / 1000)

      const primaryColorLoc = gl.getUniformLocation(program, 'u_primaryColor')
      const secondaryColorLoc = gl.getUniformLocation(program, 'u_secondaryColor')
      const primaryRgb = hexToRgb(theme.palette.primary.main)
      const secondaryRgb = hexToRgb(theme.palette.secondary.main)
      gl.uniform3f(primaryColorLoc, ...primaryRgb)
      gl.uniform3f(secondaryColorLoc, ...secondaryRgb)

      // Draw points
      gl.drawArrays(gl.POINTS, 0, particlesRef.current.length)

      // Cleanup
      gl.deleteBuffer(positionBuffer)
      gl.deleteBuffer(velocityBuffer)
      gl.deleteBuffer(lifeBuffer)
      gl.deleteBuffer(sizeBuffer)
      gl.deleteBuffer(amplitudeBuffer)
    },
    [sensitivity, theme.palette.primary.main, theme.palette.secondary.main]
  )

  // Draw radial visualization
  const drawRadial3D = useCallback(
    (gl: WebGLRenderingContext, data: number[], width: number, height: number) => {
      const program = programRef.current
      if (!program) return

      const centerX = width / 2
      const centerY = height / 2
      const baseRadius = Math.min(width, height) / 4
      const vertices: number[] = []
      const amplitudes: number[] = []
      const indices: number[] = []

      const bufferLength = data.length

      for (let i = 0; i < bufferLength; i++) {
        const amplitude = Math.min(data[i] * sensitivity * 0.5, 1)
        const angle = (i / bufferLength) * Math.PI * 2
        const nextAngle = ((i + 1) / bufferLength) * Math.PI * 2

        const innerRadius = baseRadius
        const outerRadius = baseRadius + amplitude * baseRadius

        // Create a segment
        const x1 = centerX + Math.cos(angle) * innerRadius
        const y1 = centerY + Math.sin(angle) * innerRadius
        const x2 = centerX + Math.cos(angle) * outerRadius
        const y2 = centerY + Math.sin(angle) * outerRadius
        const x3 = centerX + Math.cos(nextAngle) * outerRadius
        const y3 = centerY + Math.sin(nextAngle) * outerRadius
        const x4 = centerX + Math.cos(nextAngle) * innerRadius
        const y4 = centerY + Math.sin(nextAngle) * innerRadius

        // Two triangles for the segment
        vertices.push(x1, y1, x2, y2, x3, y3)
        vertices.push(x1, y1, x3, y3, x4, y4)

        for (let j = 0; j < 6; j++) {
          amplitudes.push(amplitude)
          indices.push(i / bufferLength)
        }
      }

      // Create and bind buffers
      const positionBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW)

      const positionLoc = gl.getAttribLocation(program, 'a_position')
      gl.enableVertexAttribArray(positionLoc)
      gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)

      // Amplitude buffer
      const amplitudeBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, amplitudeBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(amplitudes), gl.DYNAMIC_DRAW)

      const amplitudeLoc = gl.getAttribLocation(program, 'a_amplitude')
      if (amplitudeLoc !== -1) {
        gl.enableVertexAttribArray(amplitudeLoc)
        gl.vertexAttribPointer(amplitudeLoc, 1, gl.FLOAT, false, 0, 0)
      }

      // Index buffer for color
      const indexBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, indexBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(indices), gl.DYNAMIC_DRAW)

      const indexLoc = gl.getAttribLocation(program, 'a_index')
      if (indexLoc !== -1) {
        gl.enableVertexAttribArray(indexLoc)
        gl.vertexAttribPointer(indexLoc, 1, gl.FLOAT, false, 0, 0)
      }

      // Set uniforms
      const resolutionLoc = gl.getUniformLocation(program, 'u_resolution')
      gl.uniform2f(resolutionLoc, width, height)

      const timeLoc = gl.getUniformLocation(program, 'u_time')
      gl.uniform1f(timeLoc, (Date.now() - startTimeRef.current) / 1000)

      // Draw
      gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2)

      // Cleanup
      gl.deleteBuffer(positionBuffer)
      gl.deleteBuffer(amplitudeBuffer)
      gl.deleteBuffer(indexBuffer)
    },
    [sensitivity]
  )

  // Draw waveform with 3D effect
  const drawWaveform3D = useCallback(
    (gl: WebGLRenderingContext, data: number[], width: number, height: number) => {
      const program = programRef.current
      if (!program) return

      const vertices: number[] = []
      const amplitudes: number[] = []
      const indices: number[] = []

      const bufferLength = data.length
      const sliceWidth = width / bufferLength
      const centerY = height / 2

      // Create a filled waveform
      for (let i = 0; i < bufferLength - 1; i++) {
        const amplitude1 = data[i] * sensitivity * 0.3
        const amplitude2 = data[i + 1] * sensitivity * 0.3

        const x1 = i * sliceWidth
        const x2 = (i + 1) * sliceWidth
        const y1 = centerY + (amplitude1 - 0.5) * height * 0.8
        const y2 = centerY + (amplitude2 - 0.5) * height * 0.8

        // Create quad for filled waveform
        vertices.push(x1, centerY, x1, y1, x2, y1)
        vertices.push(x1, centerY, x2, y1, x2, centerY)

        for (let j = 0; j < 6; j++) {
          amplitudes.push((amplitude1 + amplitude2) / 2)
          indices.push(i / bufferLength)
        }
      }

      // Create and bind buffers
      const positionBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.DYNAMIC_DRAW)

      const positionLoc = gl.getAttribLocation(program, 'a_position')
      gl.enableVertexAttribArray(positionLoc)
      gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)

      // Amplitude buffer
      const amplitudeBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, amplitudeBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(amplitudes), gl.DYNAMIC_DRAW)

      const amplitudeLoc = gl.getAttribLocation(program, 'a_amplitude')
      if (amplitudeLoc !== -1) {
        gl.enableVertexAttribArray(amplitudeLoc)
        gl.vertexAttribPointer(amplitudeLoc, 1, gl.FLOAT, false, 0, 0)
      }

      // Index buffer
      const indexBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, indexBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(indices), gl.DYNAMIC_DRAW)

      const indexLoc = gl.getAttribLocation(program, 'a_index')
      if (indexLoc !== -1) {
        gl.enableVertexAttribArray(indexLoc)
        gl.vertexAttribPointer(indexLoc, 1, gl.FLOAT, false, 0, 0)
      }

      // Set uniforms
      const resolutionLoc = gl.getUniformLocation(program, 'u_resolution')
      gl.uniform2f(resolutionLoc, width, height)

      const timeLoc = gl.getUniformLocation(program, 'u_time')
      gl.uniform1f(timeLoc, (Date.now() - startTimeRef.current) / 1000)

      const primaryColorLoc = gl.getUniformLocation(program, 'u_primaryColor')
      const secondaryColorLoc = gl.getUniformLocation(program, 'u_secondaryColor')
      const primaryRgb = hexToRgb(theme.palette.primary.main)
      const secondaryRgb = hexToRgb(theme.palette.secondary.main)
      gl.uniform3f(primaryColorLoc, ...primaryRgb)
      gl.uniform3f(secondaryColorLoc, ...secondaryRgb)

      // Draw
      gl.drawArrays(gl.TRIANGLES, 0, vertices.length / 2)

      // Cleanup
      gl.deleteBuffer(positionBuffer)
      gl.deleteBuffer(amplitudeBuffer)
      gl.deleteBuffer(indexBuffer)
    },
    [sensitivity, theme.palette.primary.main, theme.palette.secondary.main]
  )

  // Draw Bleep
  const drawBleep = useCallback(
    (gl: WebGLRenderingContext, data: number[], width: number, height: number) => {
      const program = programRef.current
      if (!program) return

      // Config
      const speed = config.scroll_time ? 1.0 / config.scroll_time : 1.0

      // Update history
      const avg = data.reduce((a, b) => a + b, 0) / data.length
      historyRef.current.push(avg * sensitivity)
      if (historyRef.current.length > 128) {
        historyRef.current.shift()
      }

      // Full screen quad
      const vertices = [
        -1, -1,
        1, -1,
        -1, 1,
        1, 1,
      ]

      const positionBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

      const positionLoc = gl.getAttribLocation(program, 'a_position')
      gl.enableVertexAttribArray(positionLoc)
      gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)

      // Create texture for history
      const texture = gl.createTexture()
      gl.activeTexture(gl.TEXTURE0)
      gl.bindTexture(gl.TEXTURE_2D, texture)
      
      // Fill texture with history
      const textureData = new Uint8Array(historyRef.current.length)
      for(let i=0; i<historyRef.current.length; i++) {
        textureData[i] = Math.min(255, Math.max(0, historyRef.current[i] * 255))
      }
      
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.LUMINANCE, historyRef.current.length, 1, 0, gl.LUMINANCE, gl.UNSIGNED_BYTE, textureData)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)

      // Uniforms
      const resolutionLoc = gl.getUniformLocation(program, 'u_resolution')
      gl.uniform2f(resolutionLoc, width, height)
      
      const timeLoc = gl.getUniformLocation(program, 'u_time')
      gl.uniform1f(timeLoc, (Date.now() - startTimeRef.current) / 1000 * speed)

      const historyLoc = gl.getUniformLocation(program, 'u_history')
      gl.uniform1i(historyLoc, 0)

      const primaryColorLoc = gl.getUniformLocation(program, 'u_primaryColor')
      const secondaryColorLoc = gl.getUniformLocation(program, 'u_secondaryColor')
      const primaryRgb = hexToRgb(theme.palette.primary.main)
      const secondaryRgb = hexToRgb(theme.palette.secondary.main)
      gl.uniform3f(primaryColorLoc, ...primaryRgb)
      gl.uniform3f(secondaryColorLoc, ...secondaryRgb)

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      
      gl.deleteBuffer(positionBuffer)
      gl.deleteTexture(texture)
    },
    [sensitivity, theme.palette.primary.main, theme.palette.secondary.main, config]
  )

  // Draw Concentric
  const drawConcentric = useCallback(
    (gl: WebGLRenderingContext, data: number[], width: number, height: number) => {
      const program = programRef.current
      if (!program) return
      
      const scale = config.gradient_scale ?? 1.0

      const avg = data.reduce((a, b) => a + b, 0) / data.length
      if (beatData) {
        beatRef.current += beatData.beatIntensity * 0.2
      } else {
        beatRef.current += avg * sensitivity * 0.1
      }

      // Full screen quad
      const vertices = [ -1, -1, 1, -1, -1, 1, 1, 1 ]
      
      const positionBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

      const positionLoc = gl.getAttribLocation(program, 'a_position')
      gl.enableVertexAttribArray(positionLoc)
      gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)

      // Uniforms
      const resolutionLoc = gl.getUniformLocation(program, 'u_resolution')
      gl.uniform2f(resolutionLoc, width, height)

      const timeLoc = gl.getUniformLocation(program, 'u_time')
      gl.uniform1f(timeLoc, (Date.now() - startTimeRef.current) / 1000)
      
      const beatLoc = gl.getUniformLocation(program, 'u_beat')
      gl.uniform1f(beatLoc, beatRef.current)

      const scaleLoc = gl.getUniformLocation(program, 'u_scale')
      if (scaleLoc) gl.uniform1f(scaleLoc, scale)

      const primaryColorLoc = gl.getUniformLocation(program, 'u_primaryColor')
      const secondaryColorLoc = gl.getUniformLocation(program, 'u_secondaryColor')
      const primaryRgb = hexToRgb(theme.palette.primary.main)
      const secondaryRgb = hexToRgb(theme.palette.secondary.main)
      gl.uniform3f(primaryColorLoc, ...primaryRgb)
      gl.uniform3f(secondaryColorLoc, ...secondaryRgb)

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      
      gl.deleteBuffer(positionBuffer)
    },
    [sensitivity, theme.palette.primary.main, theme.palette.secondary.main, config]
  )

  // Draw Custom / GIF
  const drawCustom = useCallback(
    (gl: WebGLRenderingContext, data: number[], width: number, height: number) => {
      const program = programRef.current
      if (!program) return
      
      const avg = data.reduce((a, b) => a + b, 0) / data.length
      
      // Common uniforms from config
      const rotation = config.rotate ? config.rotate * (Math.PI / 180) : 0
      const brightness = config.brightness ?? 1.0
      const fps = config.gif_fps ?? 30
      const speed = fps / 30.0 

      // Full screen quad
      const vertices = [ -1, -1, 1, -1, -1, 1, 1, 1 ]
      
      const positionBuffer = gl.createBuffer()
      gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer)
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW)

      const positionLoc = gl.getAttribLocation(program, 'a_position')
      gl.enableVertexAttribArray(positionLoc)
      gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0)

      // Uniforms
      const resolutionLoc = gl.getUniformLocation(program, 'u_resolution')
      gl.uniform2f(resolutionLoc, width, height)

      const timeLoc = gl.getUniformLocation(program, 'u_time')
      gl.uniform1f(timeLoc, ((Date.now() - startTimeRef.current) / 1000) * speed)
      
      const energyLoc = gl.getUniformLocation(program, 'u_energy')
      if (energyLoc) gl.uniform1f(energyLoc, avg * sensitivity)

      const beatLoc = gl.getUniformLocation(program, 'u_beat')
      if (beatLoc) {
         if (beatData) {
            beatRef.current += beatData.beatIntensity * 0.2
         } else {
            beatRef.current += avg * sensitivity * 0.1
         }
         gl.uniform1f(beatLoc, beatRef.current)
      }
      
      const rotateLoc = gl.getUniformLocation(program, 'u_rotate')
      if (rotateLoc) gl.uniform1f(rotateLoc, rotation)
        
      const brightnessLoc = gl.getUniformLocation(program, 'u_brightness')
      if (brightnessLoc) gl.uniform1f(brightnessLoc, brightness)

      const primaryColorLoc = gl.getUniformLocation(program, 'u_primaryColor')
      const secondaryColorLoc = gl.getUniformLocation(program, 'u_secondaryColor')
      const primaryRgb = hexToRgb(theme.palette.primary.main)
      const secondaryRgb = hexToRgb(theme.palette.secondary.main)
      gl.uniform3f(primaryColorLoc, ...primaryRgb)
      gl.uniform3f(secondaryColorLoc, ...secondaryRgb)

      gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
      
      gl.deleteBuffer(positionBuffer)
    },
    [sensitivity, theme.palette.primary.main, theme.palette.secondary.main, config]
  )

  // Main draw function
  const draw = useCallback(() => {
    const gl = glRef.current
    const canvas = canvasRef.current
    if (!gl || !canvas) return

    const width = canvas.width
    const height = canvas.height

    // Clear with fade effect
    gl.clearColor(0, 0, 0, 0.15)
    gl.clear(gl.COLOR_BUFFER_BIT)

    if (audioData.length === 0) {
      animationRef.current = requestAnimationFrame(draw)
      return
    }

    const smoothedData = getSmoothData(audioData)

    if (customShader) {
       drawCustom(gl, smoothedData, width, height)
    } else {
      switch (visualType) {
        case 'bars3d':
          drawBars3D(gl, smoothedData, width, height)
          break
        case 'particles':
          drawParticles(gl, smoothedData, width, height)
          break
        case 'waveform3d':
          drawWaveform3D(gl, smoothedData, width, height)
          break
        case 'radial3d':
          drawRadial3D(gl, smoothedData, width, height)
          break
        case 'bleep':
          drawBleep(gl, smoothedData, width, height)
          break
        case 'concentric':
          drawConcentric(gl, smoothedData, width, height)
          break
        case 'gif':
        case 'matrix':
        case 'terrain':
        case 'geometric':
          drawCustom(gl, smoothedData, width, height)
          break
      }
    }

    animationRef.current = requestAnimationFrame(draw)
  }, [audioData, visualType, getSmoothData, drawBars3D, drawParticles, drawWaveform3D, drawRadial3D, drawBleep, drawConcentric, drawCustom, customShader])

  // Initialize and cleanup
  useEffect(() => {
    if (isPlaying) {
      const success = initWebGL()
      if (success) {
        startTimeRef.current = Date.now()
        draw()
      }
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, initWebGL, draw])

  // Resize handler
  useEffect(() => {
    const updateCanvasSize = () => {
      if (canvasRef.current) {
        const container = canvasRef.current.parentElement
        if (container) {
          canvasRef.current.width = container.clientWidth
          canvasRef.current.height = container.clientHeight

          const gl = glRef.current
          if (gl) {
            gl.viewport(0, 0, canvasRef.current.width, canvasRef.current.height)
          }
        }
      }
    }

    updateCanvasSize()
    window.addEventListener('resize', updateCanvasSize)
    return () => window.removeEventListener('resize', updateCanvasSize)
  }, [])

  // Reinitialize when visual type changes
  useEffect(() => {
    if (isPlaying && glRef.current) {
      initWebGL()
    }
  }, [visualType, isPlaying, initWebGL, customShader])

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: '100%',
        height: '100%',
        display: 'block',
        backgroundColor: '#000'
      }}
    />
  )
}

export default WebGLVisualiser
