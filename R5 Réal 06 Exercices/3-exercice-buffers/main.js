'use strict';

const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl2');

const vertex_GLSL = `#version 300 es
in vec4 position;
void main() {
    gl_Position = position;
}
`;

const fragment_GLSL = `#version 300 es
precision highp float;

out vec4 glFragColor;

void main() {
    glFragColor = vec4(0, 1, 0.5, 1);
}
`;

// Creation du programme de shading en fournissant le code des shaders
this.prg = creation_programme_shading(gl, [
    [ gl.VERTEX_SHADER,   vertex_GLSL ],
    [ gl.FRAGMENT_SHADER, fragment_GLSL ]
]);

gl.useProgram(prg);

// Références vers l'attribut 'position'

// A COMPLETER

// Buffer OpenGL contenant les points du triangles
// A COMPLETER



// compute 3 vertices for 1 triangle

// A COMPLETER
