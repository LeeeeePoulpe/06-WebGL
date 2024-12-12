'use strict';

const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl2');

const vertex_GLSL = `#version 300 es
// A COMPLETER


void main() {
// A COMPLETER
}
`;

const fragment_GLSL = `#version 300 es
precision highp float;

// A COMPLETER

void main() {
// A COMPLETER
}
`;


// Creation du programme de shading en fournissant le code des shaders
const prg = creation_programme_shading(gl, [
    [ gl.VERTEX_SHADER,   vertex_GLSL ],
    [ gl.FRAGMENT_SHADER, fragment_GLSL ]
]);

// Références vers les attributs 'position' et 'color'
// A COMPLETER

// Points des triangles
// A COMPLETER


// Buffer OpenGL contenant les points du triangles
// A COMPLETER

// Indication du programme à utiliser (et buffers associés)
gl.useProgram(prg);

// Affichage

// A COMPLETER
