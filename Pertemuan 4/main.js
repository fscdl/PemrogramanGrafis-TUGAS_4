const canvas = document.querySelector("canvas");
const gl = canvas.getContext("webgl");

if (!gl) {
  throw new Error("Tidak Support WebGL");
}


const canvasWidth = 400;
const canvasHeight = 400;
canvas.width = canvasWidth;
canvas.height = canvasHeight;
gl.viewport(0, 0, canvas.width, canvas.height);

gl.clearColor(1.0, 1.0, 0.0, 1.0); 
gl.clear(gl.COLOR_BUFFER_BIT);


const line = [
  -0.8, -0.8, // Point 1
  0.8, -0.8,  // Point 2
];

// kode sumber vertex shade
const vertexShaderSource = `
  attribute vec2 a_position;
  void main() {
    gl_Position = vec4(a_position, 0.0, 1.0);
  }
`;

// kode sumber fragment shader
const fragmentShaderSource = `
  precision mediump float;  
  void main() {
    gl_FragColor = vec4(0, 0, 0, 1);
  }
`;

// Membuat dan mengkompilasi shader
const vertexShader = gl.createShader(gl.VERTEX_SHADER);
gl.shaderSource(vertexShader, vertexShaderSource);
gl.compileShader(vertexShader);

const fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
gl.shaderSource(fragmentShader, fragmentShaderSource);
gl.compileShader(fragmentShader);

// Membuat program shader dan menghubungkan shader
const shaderProgram = gl.createProgram();
gl.attachShader(shaderProgram, vertexShader);
gl.attachShader(shaderProgram, fragmentShader);
gl.linkProgram(shaderProgram);
gl.useProgram(shaderProgram);

// Membuat buffer untuk koordinat garis
const positionBuffer = gl.createBuffer();
gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(line), gl.STATIC_DRAW);

// Mendapatkan lokasi atribut dan mengaktifkannya
const positionAttributeLocation = gl.getAttribLocation(shaderProgram, "a_position");
gl.enableVertexAttribArray(positionAttributeLocation);

// Menunjuk suatu atribut ke VBO (Vertex Buffer Object) yang saat ini terikat
gl.vertexAttribPointer(positionAttributeLocation, 2, gl.FLOAT, false, 0, 0);

// Variabel-variabel animasi
let positionY = -0.8;
let direction = 1; // Arah awal: bawah
const speed = 0.01;

// Fungsi animasi
function animate() {
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Memperbarui posisi untuk animasi
  positionY += speed * direction;

  // Mengubah arah jika mencapai batas atas atau bawah
  if (positionY >= 0.8 || positionY <= -0.8) {
    direction *= -1; // Reverse direction
  }

  // Mengatur koordinat Y baru untuk garis
  const animatedLine = [
    -0.8, positionY,
    0.8, positionY,
  ];

  // Memperbarui data buffer dengan koordinat garis yang baru
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(animatedLine), gl.STATIC_DRAW);

  // Draw the line
  gl.drawArrays(gl.LINES, 0, 2);

  // Meminta bingkai animasi berikutnya
  requestAnimationFrame(animate);
}

// Memulai animasi
animate();
