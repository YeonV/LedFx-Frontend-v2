interface Pixel {
  r: number
  g: number
  b: number
}

interface InitWebGLMessage {
  canvas: OffscreenCanvas
}

interface UpdateTextureMessage {
  pixels: Pixel[]
  rows: number
  cols: number
}

type WorkerMessageGL = InitWebGLMessage | UpdateTextureMessage

let canvasGL: OffscreenCanvas
let gl: WebGLRenderingContext | null
let texture: WebGLTexture | null

self.onmessage = (event: MessageEvent<WorkerMessageGL>) => {
  self.postMessage('worker-ready')
  if ('canvas' in event.data) {
    canvasGL = event.data.canvas
    /* expect ts(2769) error */
    gl =
      (canvasGL.getContext('webgl' as OffscreenRenderingContextId) as WebGLRenderingContext) ||
      (canvasGL.getContext(
        'experimental-webgl' as OffscreenRenderingContextId
      ) as WebGLRenderingContext)
    if (!gl) {
      console.error('WebGL not supported')
      return
    }

    // Initialize WebGL
    initWebGL()
  } else if ('pixels' in event.data) {
    const { pixels, rows, cols } = event.data
    canvasGL.width = cols
    canvasGL.height = rows
    gl?.viewport(0, 0, cols, rows)

    // Update texture with new pixel data
    updateTexture(pixels, rows, cols)
  }
}

const initWebGL = () => {
  const vertexShaderSource = `
    attribute vec2 a_position;
    attribute vec2 a_texCoord;
    varying vec2 v_texCoord;
    void main() {
      gl_Position = vec4(a_position, 0.0, 1.0);
      v_texCoord = a_texCoord;
    }
  `

  const fragmentShaderSource = `
    precision mediump float;
    varying vec2 v_texCoord;
    uniform sampler2D u_texture;
    void main() {
      gl_FragColor = texture2D(u_texture, v_texCoord);
    }
  `

  const vertexShader = createShader(gl!.VERTEX_SHADER, vertexShaderSource)
  const fragmentShader = createShader(gl!.FRAGMENT_SHADER, fragmentShaderSource)
  const program = createProgram(vertexShader, fragmentShader)

  gl!.useProgram(program)

  // Look up where the vertex data needs to go.
  if (!program) {
    console.error('Failed to create WebGL program')
    return
  }
  const positionLocation = gl!.getAttribLocation(program, 'a_position')
  const texCoordLocation = gl!.getAttribLocation(program, 'a_texCoord')

  // Create a buffer and put a single clipspace rectangle in it (2 triangles)
  const positionBuffer = gl!.createBuffer()
  gl!.bindBuffer(gl!.ARRAY_BUFFER, positionBuffer)
  gl!.bufferData(
    gl!.ARRAY_BUFFER,
    new Float32Array([-1.0, -1.0, 1.0, -1.0, -1.0, 1.0, -1.0, 1.0, 1.0, -1.0, 1.0, 1.0]),
    gl!.STATIC_DRAW
  )

  // Create a buffer for texture coordinates
  const texCoordBuffer = gl!.createBuffer()
  gl!.bindBuffer(gl!.ARRAY_BUFFER, texCoordBuffer)
  gl!.bufferData(
    gl!.ARRAY_BUFFER,
    new Float32Array([0.0, 1.0, 1.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 1.0, 0.0]),
    gl!.STATIC_DRAW
  )

  // Create a texture
  texture = gl!.createTexture()
  gl!.bindTexture(gl!.TEXTURE_2D, texture)
  gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_S, gl!.CLAMP_TO_EDGE)
  gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_WRAP_T, gl!.CLAMP_TO_EDGE)
  gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MIN_FILTER, gl!.NEAREST)
  gl!.texParameteri(gl!.TEXTURE_2D, gl!.TEXTURE_MAG_FILTER, gl!.NEAREST)

  // Tell WebGL how to pull out the positions from the position buffer
  gl!.bindBuffer(gl!.ARRAY_BUFFER, positionBuffer)
  gl!.enableVertexAttribArray(positionLocation)
  gl!.vertexAttribPointer(positionLocation, 2, gl!.FLOAT, false, 0, 0)

  // Tell WebGL how to pull out the texture coordinates from the texCoord buffer
  gl!.bindBuffer(gl!.ARRAY_BUFFER, texCoordBuffer)
  gl!.enableVertexAttribArray(texCoordLocation)
  gl!.vertexAttribPointer(texCoordLocation, 2, gl!.FLOAT, false, 0, 0)
}

const createShader = (type: number, source: string): WebGLShader | null => {
  const shader = gl!.createShader(type)
  if (!shader) {
    console.error('Error creating shader')
    return null
  }
  gl!.shaderSource(shader, source)
  gl!.compileShader(shader)
  if (!gl!.getShaderParameter(shader, gl!.COMPILE_STATUS)) {
    console.error('Error compiling shader:', gl!.getShaderInfoLog(shader))
    gl!.deleteShader(shader)
    return null
  }
  return shader
}

const createProgram = (
  vertexShader: WebGLShader | null,
  fragmentShader: WebGLShader | null
): WebGLProgram | null => {
  const program = gl!.createProgram()
  gl!.attachShader(program, vertexShader!)
  gl!.attachShader(program, fragmentShader!)
  gl!.linkProgram(program)
  if (!gl!.getProgramParameter(program, gl!.LINK_STATUS)) {
    console.error('Error linking program:', gl!.getProgramInfoLog(program))
    gl!.deleteProgram(program)
    return null
  }
  return program
}

const updateTexture = (pixels: Pixel[], rows: number, cols: number) => {
  gl!.bindTexture(gl!.TEXTURE_2D, texture)
  gl!.texImage2D(
    gl!.TEXTURE_2D,
    0,
    gl!.RGBA,
    cols,
    rows,
    0,
    gl!.RGBA,
    gl!.UNSIGNED_BYTE,
    new Uint8Array(pixels.flatMap((p) => [p.r, p.g, p.b, 255]))
  )

  // Draw the rectangle
  gl!.clear(gl!.COLOR_BUFFER_BIT)
  gl!.drawArrays(gl!.TRIANGLES, 0, 6)
}
