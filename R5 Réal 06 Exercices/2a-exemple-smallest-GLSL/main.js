'use strict';

const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl2');

const vsGLSL = `#version 300 es
void main() {
    gl_Position = vec4(0, 0, 0, 1);
    gl_PointSize = 100.0;
}
`;

const fsGLSL = `#version 300 es
precision highp float;

out vec4 outColor;

void main() {
    outColor = vec4(1, 0.5, 0, 1);
}
`;

const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vsGLSL);
gl.compileShader(vertexShader);
if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
  throw new Error(gl.getShaderInfoLog(vertexShader))
};

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fsGLSL);
gl.compileShader(fragmentShader);
if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
  throw new Error(gl.getShaderInfoLog(fragmentShader))
};

const prg = gl.createProgram();
gl.attachShader(prg, vertexShader);
gl.attachShader(prg, fragmentShader);
gl.linkProgram(prg);

if (!gl.getProgramParameter(prg, gl.LINK_STATUS)) {
  throw new Error(gl.getProgramInfoLog(prg))
};

gl.useProgram(prg);

// draw 1 point
gl.drawArrays(gl.POINTS, 0, 1);