'use strict';

//====================================
// Récupération canvas + WebGL
//====================================
// 1. Récupérer le canvas html
const canvas = document.querySelector('#glcanvas');

// 2. Récupérer le WebGL
const gl = canvas.getContext('webgl2');
if (!gl) {
  throw new Error("No WebGL for you!")
};

//====================================
// Création et Association des shaders
//====================================
const vertex_GLSL = `#version 300 es

in vec4 position;
uniform mat2 u_matrix;
uniform vec2 u_translation;
uniform vec3 u_color;
out vec3 v_color;
out vec2 v_position;

void main() {
  // On applique d'abord la rotation puis la translation
  vec2 rotated = u_matrix * position.xy;
  vec2 translated = rotated + u_translation;
  
  // Passage de la couleur au fragment shader
  v_color = u_color;
  
  // Passage de la position au fragment shader
  v_position = translated;
  
  gl_Position = vec4(translated, 0.0, 1.2);
}
`;

const fragment_GLSL = `#version 300 es
precision highp float;

in vec3 v_color;
in vec2 v_position;
out vec4 outColor;

void main() {
  // Calcul de la distance à l'origine avec la fonction length()
  float distance = length(v_position);
  
  // Si la distance est inférieure ou égale à 0.75, on affiche en bleu
  if (distance <= 0.75) {
    outColor = vec4(0.0, 0.0, 1.0, 1.0); // Bleu
  } else {
    outColor = vec4(v_color, 1.0); // Couleur normale
  }
}
`;

// Création du programme de shading
const prg = creation_programme_shading(gl, [
  [gl.VERTEX_SHADER, vertex_GLSL],
  [gl.FRAGMENT_SHADER, fragment_GLSL]
]);

// Références vers l'attribut 'position' et les uniforms
const positionLoc = gl.getAttribLocation(prg, 'position');
const matrixLoc = gl.getUniformLocation(prg, 'u_matrix');
const translationLoc = gl.getUniformLocation(prg, 'u_translation');
const colorLoc = gl.getUniformLocation(prg, 'u_color');

// Variables pour l'animation des branches
let branchScales = Array(5).fill(1.0);
let updateCounter = 0;
const UPDATE_FREQUENCY = 30;

function updateBranchScales() {
  for (let i = 0; i < 5; i++) {
    branchScales[i] = 0.8 + (Math.random() * 0.4); // Entre 0.8 et 1.2
  }
}

function calcGauche() {
  let finalArray = [];

  for (let k = 0; k < 5; k++) {
    let scale = branchScales[k];
    // Point extérieur (avec scale)
    let p1 = [-0.2 * scale * Math.sin((k * 2 * Math.PI) / 5), 0.2 * scale * Math.cos((k * 2 * Math.PI) / 5)];
    finalArray.push(p1[0], p1[1]);
    // Point intermédiaire (sans scale)
    let p2 = [-0.1 * Math.sin(((k * 2 * Math.PI) / 5) + ((2 * Math.PI) / 10)), (0.1 * Math.cos(((k * 2 * Math.PI) / 5) + (2 * Math.PI) / 10))];
    finalArray.push(p2[0], p2[1]);
    // Centre
    let p3 = [0, 0];
    finalArray.push(p3[0], p3[1]);
  }

  for (let k = 0; k < 5; k++) {
    let scale = branchScales[k];
    // Point intermédiaire (sans scale)
    let p1 = [-0.1 * Math.sin(((k * 2 * Math.PI) / 5) - ((2 * Math.PI) / 10)), (0.1 * Math.cos(((k * 2 * Math.PI) / 5) - (2 * Math.PI) / 10))];
    finalArray.push(p1[0], p1[1]);
    // Point extérieur (avec scale)
    let p2 = [-0.2 * scale * Math.sin((k * 2 * Math.PI) / 5), 0.2 * scale * Math.cos((k * 2 * Math.PI) / 5)];
    finalArray.push(p2[0], p2[1]);
    // Centre
    let p3 = [0, 0];
    finalArray.push(p3[0], p3[1]);
  }

  console.log(finalArray);
  return finalArray;
}

// Points du triangle
const vertexPositions = new Float32Array(calcGauche());

// Buffer OpenGL contenant les points du triangles
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, vertexPositions, gl.STATIC_DRAW);

// Association buffer <-> attribut 'position'
gl.enableVertexAttribArray(positionLoc);
gl.vertexAttribPointer(
  positionLoc,
  2,
  gl.FLOAT,
  false,
  0,
  0,
);

let angle = 0;

function draw() {
  // Mise à jour des coefficients
  updateCounter++;
  if (updateCounter >= UPDATE_FREQUENCY) {
    updateCounter = 0;
    updateBranchScales();
    const newPositions = new Float32Array(calcGauche());
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, newPositions, gl.STATIC_DRAW);
  }

  // Réinitialiser la zone d'affichage avec une couleur bleu ciel
  gl.clearColor(0.529, 0.808, 0.922, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Mise à jour de l'angle et création de la matrice de rotation
  angle += 0.02;
  const rotationMatrix = new Float32Array([
    Math.cos(angle), Math.sin(angle),
    -Math.sin(angle), Math.cos(angle)
  ]);

  // Utilisation du programme
  gl.useProgram(prg);
  gl.uniformMatrix2fv(matrixLoc, false, rotationMatrix);

  // Dessin des 12 étoiles sur une grille 4x3
  for (let k = 0; k < 3; k++) {        // lignes
    for (let j = 0; j < 4; j++) {    // colonnes
      // Calcul de la position de l'étoile selon la formule
      const translation = [
        -0.75 + 0.5 * j,    // x
        -0.75 + 0.75 * k    // y
      ];

      // Mise à jour de la translation
      gl.uniform2fv(translationLoc, translation);

      // Sélection et mise à jour de la couleur
      const colorIndex = k * 4 + j;
      gl.uniform3f(colorLoc,
        colors[colorIndex * 3],
        colors[colorIndex * 3 + 1],
        colors[colorIndex * 3 + 2]
      );

      // Dessin de l'étoile
      gl.drawArrays(gl.TRIANGLES, 0, vertexPositions.length / 2);
    }
  }

  // Demande la prochaine frame
  requestAnimationFrame(draw);
}

// Démarrage de l'animation
requestAnimationFrame(draw);

