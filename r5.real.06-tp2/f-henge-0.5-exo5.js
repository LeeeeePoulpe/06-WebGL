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

const vertex_GLSL = `#version 300 es
in vec3 a_position;
in vec4 a_color;
out vec4 v_color;
uniform mat4 u_projectionMatrix;
uniform mat4 u_modelViewMatrix;

void main() {
    gl_Position = u_projectionMatrix * u_modelViewMatrix * vec4(a_position, 1);
    v_color = a_color;
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

// Localisation des uniforms
const projectionMatrixLocation = gl.getUniformLocation(
  prg,
  "u_projectionMatrix",
);
const modelViewMatrixLocation = gl.getUniformLocation(prg, "u_modelViewMatrix");

//====================================
// Création des buffers
//====================================

// Buffer de positions
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(
  gl.ARRAY_BUFFER,
  new Float32Array(getFGeometry()),
  gl.STATIC_DRAW,
);
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);

// Buffer de couleurs
const colorArray = [];

// Face avant (6 premiers triangles)
for (let i = 0; i < 18; i++) {
  colorArray.push(
    ui8Colors[0] / 255,
    ui8Colors[1] / 255,
    ui8Colors[2] / 255,
    1.0,
  );
}

// Face arrière (6 triangles suivants)
for (let i = 0; i < 18; i++) {
  colorArray.push(
    ui8Colors[4] / 255,
    ui8Colors[5] / 255,
    ui8Colors[6] / 255,
    1.0,
  );
}

// 10 faces latérales (20 triangles)
for (let i = 0; i < 10; i++) {
  const baseIndex = i * 3 + 8;
  for (let j = 0; j < 6; j++) {
    colorArray.push(
      ui8Colors[baseIndex] / 255,
      ui8Colors[baseIndex + 1] / 255,
      ui8Colors[baseIndex + 2] / 255,
      1.0,
    );
  }
}

const colorBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colorArray), gl.STATIC_DRAW);
gl.enableVertexAttribArray(colorLocation);
gl.vertexAttribPointer(colorLocation, 4, gl.FLOAT, false, 0, 0);

// Vecteur UP
const angleX = degToRad(-25);

// angle de visée vers le bas
const angleY = degToRad(-30);

// Matrice de rotation camera
let cameraMatrix = math.identity(4);

// on applique les trucs sur la camera
cameraMatrix = math.multiply(cameraMatrix, translation(0, 250, 500));
// cameraMatrix = math.multiply(cameraMatrix, yRotation(angleY));
cameraMatrix = math.multiply(cameraMatrix, xRotation(angleX));

cameraMatrix = math.inv(cameraMatrix);

//====================================
// Dessin de l'image
//====================================

gl.useProgram(prg);

const aspect = canvas.clientWidth / canvas.clientHeight;
const fieldOfViewInRadians = degToRad(60);
const zNear = 1;
const zFar = 800;
const projectionMatrix = projection(fieldOfViewInRadians, aspect, zNear, zFar);

gl.uniformMatrix4fv(
  projectionMatrixLocation,
  true,
  math.flatten(projectionMatrix).valueOf(),
);

gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(0.5, 0.7, 1.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
gl.enable(gl.CULL_FACE);
gl.enable(gl.DEPTH_TEST);

const primitiveType = gl.TRIANGLES;
const offset = 0;
const count = 96;

const nb_f = 5;

for (let k = 0; k < nb_f; k++) {
    const angle = (k * Math.PI * 2) / nb_f;
    const x = Math.cos(angle) * 200;
    const z = -Math.sin(angle) * 200;

    const modelViewMatrix = math.multiply(
        cameraMatrix,
        translation(x, 0, z),
        yRotation(angle + 90),
    )

    gl.uniformMatrix4fv(
        modelViewMatrixLocation,
        true,
        math.flatten(modelViewMatrix).valueOf(),
    )

    gl.drawArrays(primitiveType, offset, count);
}
