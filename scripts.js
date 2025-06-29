let scene, camera, renderer, loader, currentModel, modelName = "pizza";
init();
animate();

function init() {
  scene = new THREE.Scene();
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  renderer = new THREE.WebGLRenderer({ alpha: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.getElementById("ar-container").appendChild(renderer.domElement);
  camera.position.z = 2;
  loader = new THREE.GLTFLoader();
  loadModel("pizza");

  navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } }).then(stream => {
    const video = document.createElement("video");
    video.srcObject = stream;
    video.play();
    video.style.position = "fixed";
    video.style.top = 0;
    video.style.left = 0;
    video.style.width = "100%";
    video.style.height = "100%";
    video.style.zIndex = "-2";
    document.body.appendChild(video);
  });
}

function loadModel(name) {
  if (currentModel) scene.remove(currentModel);
  const file = name === "pizza" ? "pizza.glb" : "stylized_cheeseburger__low_poly_3d_model.glb";
  loader.load(`models/${file}`, gltf => {
    currentModel = gltf.scene;
    currentModel.scale.set(1, 1, 1);
    scene.add(currentModel);
    modelName = name;
    document.getElementById("watermark").innerText = name.charAt(0).toUpperCase() + name.slice(1);
  });
}

function switchModel(name) { loadModel(name); }

function placeOrder() {
  const db = firebase.firestore();
  db.collection("orders").add({ item: modelName, table: "1" }).then(() => {
    alert("Order placed!");
  });
}

function animate() {
  requestAnimationFrame(animate);
  if (currentModel) currentModel.rotation.y += 0.01;
  renderer.render(scene, camera);
}
