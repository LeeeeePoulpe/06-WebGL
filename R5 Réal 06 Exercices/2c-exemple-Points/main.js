'use strict';

const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl2');

const vertex_GLSL = `#version 300 es

in vec4 position;

void main() {
    float x = position.t * 1.0 - 0.5;
    float y = position.t * 1.6 - 0.8;
    gl_Position = vec4(x, y, position.zw);
    gl_PointSize = 20.0;
}
`;

const fragment_GLSL = `#version 300 es
precision highp float;

out vec4 glFragColor;

void main() {
    glFragColor = vec4(1, 0.5, 0, 1);
}
`;

// Creation du programme de shading en fournissant le code des shaders
this.prg = creation_programme_shading(gl, [
    [ gl.VERTEX_SHADER,   vertex_GLSL ],
    [ gl.FRAGMENT_SHADER, fragment_GLSL ]
]);

// Référence sur l'attribut (ici coordonnées des vertex)
const attribPosition = gl.getAttribLocation(prg, 'position');

gl.useProgram(prg);

// Affichage d'une série de points
const nb_points = 10;
for (let i = 0; i < nb_points; ++i) {
  const t = i / (nb_points - 1);  // 0 to 1
  gl.vertexAttrib2f(attribPosition, 0, t);

  const offset = 0;
  const count = 1;
  gl.drawArrays(gl.POINTS, offset, count);
}