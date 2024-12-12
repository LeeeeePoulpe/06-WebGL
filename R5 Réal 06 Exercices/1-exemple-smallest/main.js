'use strict';

const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl2');

gl.clearColor(1, 0, 0, 1);
gl.clear(gl.COLOR_BUFFER_BIT);