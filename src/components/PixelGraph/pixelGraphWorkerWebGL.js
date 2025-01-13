/* eslint-disable no-restricted-globals */
self.onmessage = (event) => {
  self.postMessage('worker-ready');
  if (event.data.canvas) {
    self.canvas = event.data.canvas
    self.gl = self.canvas.getContext('webgl') || self.canvas.getContext('experimental-webgl')
    if (!self.gl) {
      console.error('WebGL not supported')
      return
    }

    // Initialize WebGL
    self.initWebGL()
  } else if (event.data.pixels) {
    const { pixels, rows, cols } = event.data
    self.canvas.width = cols
    self.canvas.height = rows
    self.gl.viewport(0, 0, cols, rows)

    // Update texture with new pixel data
    self.updateTexture(pixels, rows, cols)
  }
}

self.initWebGL = () => {
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

  const vertexShader = self.createShader(self.gl.VERTEX_SHADER, vertexShaderSource)
  const fragmentShader = self.createShader(self.gl.FRAGMENT_SHADER, fragmentShaderSource)
  const program = self.createProgram(vertexShader, fragmentShader)

  self.gl.useProgram(program)

  // Look up where the vertex data needs to go.
  const positionLocation = self.gl.getAttribLocation(program, 'a_position')
  const texCoordLocation = self.gl.getAttribLocation(program, 'a_texCoord')

  // Create a buffer and put a single clipspace rectangle in it (2 triangles)
  const positionBuffer = self.gl.createBuffer()
  self.gl.bindBuffer(self.gl.ARRAY_BUFFER, positionBuffer)
  self.gl.bufferData(self.gl.ARRAY_BUFFER, new Float32Array([
    -1.0, -1.0,
     1.0, -1.0,
    -1.0,  1.0,
    -1.0,  1.0,
     1.0, -1.0,
     1.0,  1.0,
  ]), self.gl.STATIC_DRAW)

  // Create a buffer for texture coordinates
  const texCoordBuffer = self.gl.createBuffer()
  self.gl.bindBuffer(self.gl.ARRAY_BUFFER, texCoordBuffer)
  self.gl.bufferData(self.gl.ARRAY_BUFFER, new Float32Array([
    0.0, 1.0,
    1.0, 1.0,
    0.0, 0.0,
    0.0, 0.0,
    1.0, 1.0,
    1.0, 0.0,
  ]), self.gl.STATIC_DRAW)

  // Create a texture
  self.texture = self.gl.createTexture()
  self.gl.bindTexture(self.gl.TEXTURE_2D, self.texture)
  self.gl.texParameteri(self.gl.TEXTURE_2D, self.gl.TEXTURE_WRAP_S, self.gl.CLAMP_TO_EDGE)
  self.gl.texParameteri(self.gl.TEXTURE_2D, self.gl.TEXTURE_WRAP_T, self.gl.CLAMP_TO_EDGE)
  self.gl.texParameteri(self.gl.TEXTURE_2D, self.gl.TEXTURE_MIN_FILTER, self.gl.NEAREST)
  self.gl.texParameteri(self.gl.TEXTURE_2D, self.gl.TEXTURE_MAG_FILTER, self.gl.NEAREST)

  // Tell WebGL how to pull out the positions from the position buffer
  self.gl.bindBuffer(self.gl.ARRAY_BUFFER, positionBuffer)
  self.gl.enableVertexAttribArray(positionLocation)
  self.gl.vertexAttribPointer(positionLocation, 2, self.gl.FLOAT, false, 0, 0)

  // Tell WebGL how to pull out the texture coordinates from the texCoord buffer
  self.gl.bindBuffer(self.gl.ARRAY_BUFFER, texCoordBuffer)
  self.gl.enableVertexAttribArray(texCoordLocation)
  self.gl.vertexAttribPointer(texCoordLocation, 2, self.gl.FLOAT, false, 0, 0)
}

self.createShader = (type, source) => {
  const shader = self.gl.createShader(type)
  self.gl.shaderSource(shader, source)
  self.gl.compileShader(shader)
  if (!self.gl.getShaderParameter(shader, self.gl.COMPILE_STATUS)) {
    console.error('Error compiling shader:', self.gl.getShaderInfoLog(shader))
    self.gl.deleteShader(shader)
    return null
  }
  return shader
}

self.createProgram = (vertexShader, fragmentShader) => {
  const program = self.gl.createProgram()
  self.gl.attachShader(program, vertexShader)
  self.gl.attachShader(program, fragmentShader)
  self.gl.linkProgram(program)
  if (!self.gl.getProgramParameter(program, self.gl.LINK_STATUS)) {
    console.error('Error linking program:', self.gl.getProgramInfoLog(program))
    self.gl.deleteProgram(program)
    return null
  }
  return program
}

self.updateTexture = (pixels, rows, cols) => {
  self.gl.bindTexture(self.gl.TEXTURE_2D, self.texture)
  self.gl.texImage2D(
    self.gl.TEXTURE_2D,
    0,
    self.gl.RGBA,
    cols,
    rows,
    0,
    self.gl.RGBA,
    self.gl.UNSIGNED_BYTE,
    new Uint8Array(pixels.flatMap(p => [p.r, p.g, p.b, 255]))
  )

  // Draw the rectangle
  self.gl.clear(self.gl.COLOR_BUFFER_BIT)
  self.gl.drawArrays(self.gl.TRIANGLES, 0, 6)
}