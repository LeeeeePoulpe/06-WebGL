// version 0.5 : question 1 de l'exercice 1 (révisions du TP1)
"use strict";

//====================================
// Récupération canvas + WebGL
//====================================
const canvas = document.querySelector("canvas");

const gl = canvas.getContext("webgl2");
if (!gl) {
  throw new Error("No WebGL for you!");
}

//====================================
// Création et Association des shaders
//====================================
// l'ordre de la multiplication est important
const vertex_GLSL = `#version 300 es
in vec3 a_position;
uniform mat4 m_projection;
uniform mat4 m_translate;
uniform mat4 m_camera;

in vec3 a_color;
out vec4 v_color;

void main() {
  gl_Position = m_projection * m_camera * m_translate * vec4(a_position,1);
  v_color = vec4(a_color,1);
}
`;

const fragment_GLSL = `#version 300 es
precision highp float;

in vec4 v_color;
out vec4 outColor;

void main() {
   outColor = v_color;
}
`;

const prg = creation_programme_shading(gl, [
  [gl.VERTEX_SHADER, vertex_GLSL],
  [gl.FRAGMENT_SHADER, fragment_GLSL],
]);

// Localisation des attributs
const positionLocation = gl.getAttribLocation(prg, "a_position");
const colorLocation = gl.getAttribLocation(prg, "a_color");

const matrix_projection = gl.getUniformLocation(prg, "m_projection");
const matrix_translate = gl.getUniformLocation(prg, "m_translate");
const matrix_camera = gl.getUniformLocation(prg, "m_camera");

//====================================
// Création des buffers
//====================================
// Pour chaque attribut, définir un buffer de données
// et spécifier le parcours des données du buffer
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array(getFGeometry()),
  gl.STATIC_DRAW
);
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

// Buffer de couleur

const colorArray = [];

// 18 pcq un triangle a 3 point donc 3*6 = 18
for (let i = 0; i < 18; i++) {
  colorArray.push(
    ui8Colors[0] / 255, // Le divisé par 255 c'est pour adapter les unité entre les fichier
    ui8Colors[1] / 255,
    ui8Colors[2] / 255
  );
}

for (let i = 0; i < 18; i++) {
  colorArray.push(
    ui8Colors[4] / 255, // Le divisé par 255 c'est pour adapter les unité entre les fichier
    ui8Colors[5] / 255,
    ui8Colors[6] / 255
  );
}

// on parcour les 10 face
// oncherche l'index pour appicque une couleur
// on parcours les 6 points qui compose les 2 triangle qui compse une face
for (let i = 0; i < 10; i++) {
  const baseIndex = i * 3 + 6;
  for (let j = 0; j < 6; j++) {
    colorArray.push(
      ui8Colors[baseIndex] / 255,
      ui8Colors[baseIndex + 1] / 255,
      ui8Colors[baseIndex + 2] / 255
    );
  }
}

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorArray), gl.STATIC_DRAW);
gl.enableVertexAttribArray(colorLocation);
gl.vertexAttribPointer(colorLocation, 3, gl.FLOAT, false, 0, 0);

//====================================
// Dessin de l'image
//====================================

// Spécifier le programme utilisé (i.e. les shaders utilisés)
gl.useProgram(prg);

const RAD = Math.PI / 180;

function draw() {
  const time = performance.now() * 0.001;

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
  const aspect = canvas.clientWidth / canvas.clientHeight;
  const near = 1;
  const far = 1000;

  const u_projectonMatrix = projection(fov, aspect, near, far);
  gl.uniformMatrix4fv(
    matrix_projection,
    true,
    math.flatten(u_projectonMatrix).valueOf()
  );

  //==============================================================================
  // Mettre le F au bon endroit
  // On recul la cam sur Z
  //==============================================================================

  let objectMatrixWorld = translation(0, 0, -700);

  //==============================================================================
  // Mise en place de la caméra
  //==============================================================================

  let cameraMatrix = translation(0, 0, 0);
  cameraMatrix = math.multiply(
    zRotation(degToRad(0)), // tourne
    yRotation(degToRad(-300 * time)), // met de face
    xRotation(degToRad(-40)), // met a plat
    translation(30, 30, 0)
  );

  // Permet d'utilisé des valeur positive (pour avoir plus de sens dans le code)
  // Ca change la ou est l'origine du reppert qui passe de en bas a gauche a en haut a droite
  cameraMatrix = math.inv(cameraMatrix);

  // Application de la caméra sur le modèle (cameraMatrix)
  const modelCamera = math.multiply(objectMatrixWorld, cameraMatrix);

  gl.uniformMatrix4fv(matrix_camera, true, math.flatten(modelCamera).valueOf());

  const raduis = 200;
  const copies = 10;
  for (let i = 0; i < copies; i++) {
    const angle = (i / copies) * 2 * Math.PI;

    const x = raduis * math.cos(angle);
    const z = raduis * math.sin(angle);
    const rotaionY = -angle + 90;

    let u_modelViewMatrix = math.multiply(
      translation(x, 0, z),
      yRotation(rotaionY),
      zRotation(time * 100 * RAD ),
      xRotation(time * 100 * RAD)
    );

    gl.uniformMatrix4fv(
      matrix_translate,
      true,
      math.flatten(u_modelViewMatrix).valueOf()
    );
    gl.drawArrays(primitiveType, offset, count);
  }

  requestAnimationFrame(draw);
}

draw();
