// maku.js imports three itself; pinning its copy to the same version keeps
// a single three instance on the page.
import * as THREE from "https://esm.sh/three@0.170.0";
import Lenis from "https://esm.sh/lenis@1.3.27";
import { getScreenFov, Maku, MakuGroup } from "https://esm.sh/maku.js@1.0.8?deps=three@0.170.0";

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

const width = window.innerWidth,
  height = window.innerHeight;

const z = 600;
const fov = getScreenFov(z, height);
const camera = new THREE.PerspectiveCamera(fov, width / height, 100, 2000);
camera.position.z = z;

// Create scene
const scene = new THREE.Scene();

// Create renderer
const canvas = document.querySelector("#sketch");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
  alpha: true
});
renderer.setSize(width, height);
renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));
renderer.setAnimationLoop(animation);

// Create clock
const clock = new THREE.Clock();

// Create main objects
const textureLoader = new THREE.TextureLoader();

const material = new THREE.ShaderMaterial({
  vertexShader: /* glsl */ `
uniform float iTime;
uniform vec2 iResolution;

varying vec2 vUv;

uniform float uFloat;

vec3 distort(vec3 p){
    float freq=.25;
    float angle=(iTime*10.+uv.x*20.-uv.y*10.)*freq;
    float amp=uFloat*10.;
    float strength=sin(angle)*amp;
    p.z+=strength;
    return p;
}

void main(){
    vec3 p=position;
    p=distort(p);
    gl_Position=projectionMatrix*modelViewMatrix*vec4(p,1.);

    vUv=uv;
}
  `,
  fragmentShader: /* glsl */ `
varying vec2 vUv;

uniform sampler2D iChannel0;

void main(){
    vec2 uv=vUv;
    vec4 tex=texture(iChannel0,uv);
    vec3 col=tex.xyz;
    gl_FragColor=vec4(col,1.);
}
  `,
  uniforms: {
    iChannel0: {
      value: null
    },
    iTime: {
      value: clock.getElapsedTime()
    },
    iResolution: {
      value: new THREE.Vector2(window.innerWidth, window.innerHeight)
    },
    uFloat: {
      value: 1
    }
  }
});
const elList = [...document.querySelectorAll(".gallery-item-img")];
const makuGroup = new MakuGroup();
const makus = elList.map(
  (image) =>
    new Maku(image, material, scene, {
      meshSizeType: "scale",
      textureUniform: "iChannel0",
      textureLoader
    })
);
makuGroup.addMultiple(makus);

makuGroup.syncPositions();

// Create scroller
const lenis = new Lenis({
  smoothTouch: true,
  syncTouch: true
});

// With reduced motion the page scrolls natively, without the glide.
const syncScrollMotion = () => {
  lenis.options.smoothWheel = !reduceMotion.matches;
  lenis.options.syncTouch = !reduceMotion.matches;
};
syncScrollMotion();
reduceMotion.addEventListener("change", syncScrollMotion);

// Handle animation
function animation(time) {
  lenis.raf(time);

  makuGroup.makus.forEach((maku) => {
    const { mesh } = maku;
    mesh.material.uniforms.iTime.value = clock.getElapsedTime();
    mesh.material.uniforms.iResolution.value.set(
      window.innerWidth,
      window.innerHeight
    );
    // With reduced motion the planes lie flat but still follow the scroll.
    mesh.material.uniforms.uFloat.value = reduceMotion.matches ? 0 : 1;
  });
  makuGroup.syncPositions();

  renderer.render(scene, camera);
}

// Handle resize
const resize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));

  if (camera.isPerspectiveCamera) {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.fov = getScreenFov(camera.position.z, window.innerHeight);
    camera.updateProjectionMatrix();
  }

  makuGroup.syncPositions();
  makuGroup.syncScales();
};

window.addEventListener("resize", resize);
