// Ajout de la perspective
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
const vertex_GLSL = `#version 300 es
in vec3 a_position;
uniform mat4 u_projectionMatrix;
uniform mat4 u_modelViewMatrix;

void main() {
  gl_Position =  u_projectionMatrix * u_modelViewMatrix * vec4(a_position,1);
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
// Localisation des uniforms
const projectionMatrixLocation = gl.getUniformLocation(prg, "u_projectionMatrix");
const modelViewMatrixLocation = gl.getUniformLocation(prg, "u_modelViewMatrix");

//====================================
// Création des buffers
//====================================
// [removed] Construire un VAO spécifique
//const vao = gl.createVertexArray();
//gl.bindVertexArray(vao);

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

// Données constantes pour toutes les images de l'animation

// La matrice de projection : transforme un frustum contenant la scène en le cube [-1;1]x[-1;1]x[-1;1]
// de telle sorte que la projection orthographique du cube sur sa face avant corresponde
// à la projection en perspective du frustum sur sa petite face avant (modulo la déformation
// des proportions de la face avant).
// Pour projection(fov,a,n,f), le frustum est l'espace entre les profondeurs -n et -f,
// l'angle d'ouverture verticale est fov, et le ratio largeur/hauteur de l'écran est a.
//
// La projection du cube sur sa face avant sera à son tour déformée lors de son rendu dans le viewport.
// Il faut donc que cette déformation soit l'inverse de celle appliquée entre frustum et le cube :
//  -> Le ratio a est celui du viewport = celui du canevas.
// La caméra se trouvant à la pointe de la pyramide prolongeant le frustum, il faut n > 0.
//  -> On choisit n=1.
// La scene doit contenir le F translaté.
// La bounding-box du F étant [-15;85]x[0;150]x[-15;15], il faut z_t > 15 et f > 30,
// ainsi que fov > 2*atan(150/(z_t-15)) = 0.97rad = 55,5°
//  -> On choisit z_t = 300, f = 800 et fov = 60°
// Jouer pour comprendre l'effet de ces différents paramètres.
const aspect = canvas.clientWidth / canvas.clientHeight;
const fieldOfViewInRadians = degToRad(60);
const zNear = 1; //1
const zFar = 800;//2000;
const projectionMatrix = projection(fieldOfViewInRadians, aspect, zNear, zFar);

gl.uniformMatrix4fv(projectionMatrixLocation, true, math.flatten(projectionMatrix).valueOf());


// Réinitialiser le viewport
// Le fragment shader dessine les pixels du viewport.
// Le viewport définit normalement un sous-ensemble (et non un sur-ensemble) du canvas.
// Le css vient ensuite déformer le canvas aux dimensions de la fenêtre.
// Si pour la caméra, ce sont les dimensions de la fenêtre (cliente) qu'il faut récupérer
// pour compenser la future déformation,
// pour le viewport, ce sont les dimensions du canvas (avant déformation par le css).
gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.5, 0.7, 1.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
gl.enable(gl.CULL_FACE);
gl.enable(gl.DEPTH_TEST);

// Mise à jour des uniforms (et attributes)

// - définir la matrice de positionnement de l'objet dans la scène
const objectMatrixWorld = translation(0, 0, -300);

//  - en déduire la matrice de vue de la scène
const modelViewMatrix = objectMatrixWorld;
gl.uniformMatrix4fv(modelViewMatrixLocation, true, math.flatten(modelViewMatrix).valueOf());

const primitiveType = gl.TRIANGLES;
const offset = 0;
const count = 96; // 16 tuiles de 2 triangles avec 3 vertices chacun
gl.drawArrays(primitiveType, offset, count);
