'use strict';

//====================================
// Récupération canvas + WebGL
//====================================
// 1. Récupérer le canvas html
const canvas = document.querySelector('canvas');

// 2. Récupérer le WebGL
const gl = canvas.getContext('webgl2');
if (!gl) {
  throw new Error("No WebGL for you!")
};


//====================================
// Création et Association des shaders
//====================================
// 1. Ecrire le code des shaders
const vertex_GLSL = `#version 300 es

in vec4 position;
uniform mat2 u_matrix;

void main() {
  vec2 rotated = u_matrix * position.xy;
  gl_Position = vec4(rotated, 0.0, 1.0);
}
`;

const fragment_GLSL = `#version 300 es
precision highp float;

out vec4 outColor;

void main() {
  outColor = vec4(1,1,0,1);
}
`;

// 2. Créer un programme de shading avec le code des shaders
const prg = creation_programme_shading(gl, [
    [ gl.VERTEX_SHADER,   vertex_GLSL ],
    [ gl.FRAGMENT_SHADER, fragment_GLSL ]
]);

// Références vers l'attribut 'position' et l'uniform 'u_matrix'
const positionLoc = gl.getAttribLocation(prg, 'position');
const matrixLoc = gl.getUniformLocation(prg, 'u_matrix');

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
    // Réinitialiser la zone d'affichage avec une couleur bleu ciel
    gl.clearColor(0.529, 0.808, 0.922, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Mise à jour de l'angle et création de la matrice de rotation
    angle += 0.02; // Vitesse de rotation paisible
    const rotationMatrix = new Float32Array([
        Math.cos(angle), Math.sin(angle),
        -Math.sin(angle), Math.cos(angle)
    ]);

    // Utilisation du programme et mise à jour de la matrice
    gl.useProgram(prg);
    gl.uniformMatrix2fv(matrixLoc, false, rotationMatrix);

    // Dessin des triangles
    gl.drawArrays(gl.TRIANGLES, 0, vertexPositions.length/2);

    // Demande la prochaine frame
    requestAnimationFrame(draw);
}

// Démarrage de l'animation
requestAnimationFrame(draw);

function calcGauche() {
  let finalArray = [];
  
  for (let k = 0; k < 5; k++) {
    let p1 = [ -0.2*Math.sin((k*2*Math.PI)/5), 0.2*Math.cos((k*2*Math.PI)/5)];
    finalArray.push(p1[0],p1[1]);
    let p2 = [ -0.1*Math.sin(((k*2*Math.PI)/5) + ((2*Math.PI)/10)), (0.1*Math.cos(((k*2*Math.PI)/5) + (2*Math.PI)/10))];
    finalArray.push(p2[0],p2[1]);
    let p3 = [0, 0];
    finalArray.push(p3[0],p3[1]);
  };

  for (let k = 0; k < 5; k++) {
    let p1 = [ -0.1*Math.sin(((k*2*Math.PI)/5) - ((2*Math.PI)/10)), (0.1*Math.cos(((k*2*Math.PI)/5) - (2*Math.PI)/10))];
    finalArray.push(p1[0],p1[1]);
    let p2 = [ -0.2*Math.sin((k*2*Math.PI)/5), 0.2*Math.cos((k*2*Math.PI)/5)];
    finalArray.push(p2[0],p2[1]);
    let p3 = [0, 0];
    finalArray.push(p3[0],p3[1]);
  };

  console.log(finalArray);
  return finalArray;
}

