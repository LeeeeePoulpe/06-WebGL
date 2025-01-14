// version 0.5 : question 1 de l'exercice 1 (révisions du TP1)
'use strict';

//====================================
// Récupération canvas + WebGL
//====================================
const canvas = document.querySelector('canvas');

const gl = canvas.getContext('webgl2');
if (!gl) {
  throw new Error("No WebGL for you!")
};

//====================================
// Création et Association des shaders
//====================================
// l'ordre de la multiplication est important
const vertex_GLSL = `#version 300 es
in vec3 a_position;
uniform mat4 m_projection;
uniform mat4 m_camera;

void main() {
  gl_Position = m_projection * m_camera * vec4(a_position,1);
}
`;

const fragment_GLSL = `#version 300 es
precision highp float;

out vec4 outColor;

void main() {
   outColor = vec4(0.8,0.2,0.2,1.0);
}
`;

const prg = creation_programme_shading(gl, [
    [ gl.VERTEX_SHADER,   vertex_GLSL ],
    [ gl.FRAGMENT_SHADER, fragment_GLSL ]
]);

// Localisation des attributs
const positionLocation = gl.getAttribLocation(prg, "a_position");
const matrix_projection = gl.getUniformLocation(prg, "m_projection");
const matrix_camera = gl.getUniformLocation(prg, "m_camera");

//====================================
// Création des buffers
//====================================
// Pour chaque attribut, définir un buffer de données
// et spécifier le parcours des données du buffer
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(getFGeometry()), gl.STATIC_DRAW);
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

//====================================
// Dessin de l'image
//====================================

// Spécifier le programme utilisé (i.e. les shaders utilisés)
gl.useProgram(prg);

// Réinitialiser le viewport
// Le fragment shader dessine les pixels du viewport.
// Le viewport définit normalement un sous-ensemble (et non un sur-ensemble) du canvas.
// Le css vient ensuite déformer le canvas aux dimensions de la fenêtre.
// Si pour la caméra, ce sont les dimensions de la fenêtre (cliente) qu'il faut récupérer
// pour compenser la future déformation,
// pour le viewport, ce sont les dimensions du canvas (avant déformation par le css).
gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.5, 0.7, 1.0, 1.0); // couleur du canvas et non du viewport
gl.clear(gl.COLOR_BUFFER_BIT);
gl.enable(gl.CULL_FACE);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
gl.enable(gl.DEPTH_TEST);

const primitiveType = gl.TRIANGLES;
const offset = 0;
const count = 96; // 16 tuiles de 2 triangles avec 3 vertices chacun

//==============================================================================
// Matrice de projection
//==============================================================================

const fov = degToRad(60);
const aspect = canvas.clientWidth/canvas.clientHeight
const near = 1;
const far = 1000;

const u_projectonMatrix = projection(fov,aspect,near,far);
gl.uniformMatrix4fv(matrix_projection, true, math.flatten(u_projectonMatrix).valueOf())

// Mettre le F au bon endroit
// On recul la cam sur Z
const objectMatrixWorld = translation(0,0,-300);

const modelCamera = objectMatrixWorld;

gl.uniformMatrix4fv(matrix_camera, true, math.flatten(modelCamera).valueOf());

gl.drawArrays(primitiveType, offset, count);