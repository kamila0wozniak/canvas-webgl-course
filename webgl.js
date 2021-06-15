const canvasSketch = require('canvas-sketch');
const random = require('canvas-sketch-util/random');
const palettes = require('nice-color-palettes');
const eases = require('eases');
const BezierEasing = require('bezier-easing');

global.THREE = require('three');

require('three/examples/js/controls/OrbitControls');

const settings = {
  dimensions: [512, 512],
  fps: 24,
  duration:4,
  animate: true,
  context: 'webgl',
  attributes: { antialias: true }
};

const sketch = ({ context }) => {

  const renderer = new THREE.WebGLRenderer({
    canvas: context.canvas
  });

  renderer.setClearColor('hsl(0,0%, 95%)', 1.0);


  const camera = new THREE.OrthographicCamera();

  const scene = new THREE.Scene();

  const box = new THREE.BoxGeometry(1,1,1);

  const palette = random.pick(palettes);

  for (let i=0; i<40; i++){
    const mesh = new THREE.Mesh(
        box,
        new THREE.MeshStandardMaterial({
          color: random.pick(palette),
        })
    );
    mesh.position.set(
        random.range(-1,1),
        random.range(-1,1),
        random.range(-1,1)
    );
    mesh.scale.set(
        random.range(-1,1),
        random.range(-1,1),
        random.range(-1,1)
    );
    mesh.scale.multiplyScalar(0.5);
    scene.add(mesh);
  }

  scene.add(new THREE.AmbientLight('hsl(0, 0%, 40%)'));


  const light = new THREE.DirectionalLight('white',1);
  light.position.set(0,0,4);
  scene.add(light);

  const easeFn = BezierEasing(0.67, 0.03, 0.29, 0.99);

  return {
    resize({ pixelRatio, viewportWidth, viewportHeight }) {
      renderer.setPixelRatio(pixelRatio);
      renderer.setSize(viewportWidth, viewportHeight, false);

      const aspect = viewportWidth / viewportHeight;

      const zoom = 2;

      camera.left = -zoom*aspect;
      camera.right = zoom*aspect;
      camera.top = zoom;
      camera.bottom = -zoom;

      camera.near = -100;
      camera.far = 100;

      camera.position.set(zoom,zoom,zoom);
      camera.lookAt(new THREE.Vector3());


      camera.updateProjectionMatrix();
    },
    render({ playhead }) {
      const t = Math.sin(playhead * Math.PI * 2);
      scene.rotation.z = eases.expoInOut(t);
      renderer.render(scene, camera);
    },
    unload() {
      renderer.dispose();
    }
  };
};

canvasSketch(sketch, settings);
