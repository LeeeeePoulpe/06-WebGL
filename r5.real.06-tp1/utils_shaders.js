//
// Création d'un module de shading et compilation du code
//
function charger_code_shader(gl, type_shader, code_source_shader) {
  // Création d'un module de shading
  const shader = gl.createShader(type_shader);

  // Envoi du code source au shader
  gl.shaderSource(shader, code_source_shader);

  // Compilation du code source
  gl.compileShader(shader);

  // Vérification
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    alert(`Problème de compilation: ${gl.getShaderInfoLog(shader)}`);
    gl.deleteShader(shader);

    return null;
  }

  return shader;
}

//
// Création d'un programme de shading et association de modules de shading
//
function creation_programme_shading(gl, shaders) {
  const program = gl.createProgram();
  for (let [type, source] of shaders) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error(gl.getShaderInfoLog(shader));
      gl.deleteShader(shader);
      throw new Error("Erreur de compilation du shader");
    }
    gl.attachShader(program, shader);
  }
  gl.linkProgram(program);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    console.error(gl.getProgramInfoLog(program));
    throw new Error("Erreur de liaison du programme");
  }
  return program;
}