import { useEffect, useRef } from 'react';
import * as kokomi from 'kokomi.js';
import * as THREE from 'three';
import gsap from 'gsap';
import './WebGLGallery.css';

// ============== Shaders ==============
const vertexShader = /* glsl */ `
uniform vec2 uMeshSize;
uniform vec2 uOffset;
uniform float uMouseEnter;

varying vec2 vUv;

const float PI = 3.14159265359;

vec2 scale(vec2 st, vec2 s, vec2 center) {
    return (st - center) * s + center;
}

float saturate(float a) { return clamp(a, 0., 1.); }

vec3 deformationCurve(vec3 position, vec2 uv, vec2 offset) {
    position.x += sin(uv.y * PI) * offset.x;
    position.y += sin(uv.x * PI) * offset.y;
    return position;
}

vec2 getUVScale() {
    float d = length(uMeshSize);
    float longEdge = max(uMeshSize.x, uMeshSize.y);
    return vec2((uMeshSize.x / uMeshSize.y) / (d / longEdge));
}

float getProgress(float activation, float latestStart, float progress, float progressLimit) {
    float startAt = activation * latestStart;
    float pr = smoothstep(startAt, 1., progress);
    return min(saturate(pr / progressLimit), saturate((1. - pr) / (1. - progressLimit)));
}

vec3 distort(vec3 p) {
    vec2 uvDistortion = scale((uv - .5) * 2., getUVScale(), vec2(0.));
    float d = length(uvDistortion);
    float pr = getProgress(d, .8, uMouseEnter, .75) * .08;
    p.xy *= (1. + pr);
    return p;
}

void main() {
    vec3 p = distort(deformationCurve(position, uv, uOffset));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.);
    vUv = uv;
}
`;

const fragmentShader = /* glsl */ `
uniform sampler2D iChannel0;
uniform vec2 uMeshSize;
uniform vec2 uMediaSize;
uniform float uOpacity;
uniform float uMouseEnter;
uniform float uMouseEnterMask;

varying vec2 vUv;

vec2 cover(vec2 s, vec2 i, vec2 uv) {
    float rs = s.x / s.y, ri = i.x / i.y;
    vec2 new = rs < ri ? vec2(i.x * s.y / i.y, s.y) : vec2(s.x, i.y * s.x / i.x);
    vec2 offset = (rs < ri ? vec2((new.x - s.x) / 2., 0.) : vec2(0., (new.y - s.y) / 2.)) / new;
    return uv * s / new + offset;
}

vec2 ratio2(vec2 v, vec2 s) {
    return mix(vec2(v.x, v.y * (s.y / s.x)), vec2(v.x * s.x / s.y, v.y), step(s.x, s.y));
}

vec2 distort(vec2 uv) {
    uv -= .5;
    float mRatio = uMeshSize.x / uMeshSize.y;
    float pSum = pow(uv.x * mRatio, 2.) + pow(uv.y, 2.);
    uv *= 1. - 10. * (1. - uMouseEnter) * pSum;
    return uv + .5;
}

float getMaskDist(vec2 uv) {
    uv = ratio2(uv * 2. - 1., uMeshSize);
    float aspect = min(uMeshSize.x / uMeshSize.y, uMeshSize.y / uMeshSize.x);
    return length(uv) / sqrt(1. + aspect * aspect);
}

void main() {
    vec2 uv = cover(uMeshSize, uMediaSize, vUv);
    float mask = 1. - step(uMouseEnterMask, getMaskDist(uv));
    uv = distort(uv * vec2(1. / (1. + (1. - uMouseEnter) * .25)) + (1. - 1. / (1. + (1. - uMouseEnter) * .25)) * .5);
    gl_FragColor = vec4(texture2D(iChannel0, uv).rgb, mask * uOpacity);
}
`;

// ============== Component ==============
export function WebGLGallery({
  items,
  hoverImageSize = { width: 330, height: 405 },
  offsetAmount = 1,
}) {
  const canvasRef = useRef(null);
  const hoverImgRef = useRef(null);
  const galleryRef = useRef(null);
  const itemRefs = useRef(new Map());
  const sketchRef = useRef(null);
  const containerIdRef = useRef(
    `webgl-gallery-${Math.random().toString(36).slice(2, 11)}`
  );

  useEffect(() => {
    if (!canvasRef.current || !hoverImgRef.current || !galleryRef.current)
      return;

    const hoverImg = hoverImgRef.current;
    const galleryEl = galleryRef.current;
    const canvasEl = canvasRef.current;

    canvasEl.id = containerIdRef.current;

    class Sketch extends kokomi.Base {
      async create() {
        const resourceList = items.map((item) => ({
          name: item.id,
          type: 'texture',
          path: item.imageSrc,
        }));

        const am = new kokomi.AssetManager(this, resourceList);

        am.on('ready', () => {
          const screenCamera = new kokomi.ScreenCamera(this);
          screenCamera.addExisting();

          const uj = new kokomi.UniformInjector(this);
          const material = new THREE.ShaderMaterial({
            vertexShader,
            fragmentShader,
            transparent: true,
            uniforms: {
              ...uj.shadertoyUniforms,
              iChannel0: { value: null },
              uMeshSize: {
                value: new THREE.Vector2(
                  hoverImageSize.width,
                  hoverImageSize.height
                ),
              },
              uMediaSize: { value: new THREE.Vector2(0, 0) },
              uOffset: { value: new THREE.Vector2(0, 0) },
              uOpacity: { value: 0 },
              uMouseEnter: { value: 0 },
              uMouseEnterMask: { value: 0 },
            },
          });

          const mesh = new THREE.Mesh(
            new THREE.PlaneGeometry(1, 1, 64, 64),
            material
          );
          mesh.scale.set(hoverImageSize.width, hoverImageSize.height, 1);
          this.scene.add(mesh);

          if (this.renderer?.domElement) {
            const canvas = this.renderer.domElement;
            canvas.style.position = 'fixed';
            canvas.style.top = '0';
            canvas.style.left = '0';
            canvas.style.width = '100%';
            canvas.style.height = '100%';
            canvas.style.zIndex = '10';
            canvas.style.pointerEvents = 'none';
          }

          let offsetX = 0,
            offsetY = 0;

          this.update(() => {
            uj.injectShadertoyUniforms(material.uniforms);

            const targetX = this.interactionManager.mouse.x;
            const targetY = this.interactionManager.mouse.y;

            offsetX = THREE.MathUtils.lerp(offsetX, targetX, 0.1);
            offsetY = THREE.MathUtils.lerp(offsetY, targetY, 0.1);

            material.uniforms.uOffset.value.set(
              (targetX - offsetX) * offsetAmount,
              (targetY - offsetY) * offsetAmount
            );

            gsap.to(mesh.position, {
              x: (targetX * window.innerWidth) / 2,
              y: (targetY * window.innerHeight) / 2,
            });

            gsap.to(hoverImg, {
              x: this.iMouse.mouseDOM.x - hoverImageSize.width / 2,
              y: this.iMouse.mouseDOM.y - hoverImageSize.height / 2,
            });
          });

          const doTransition = (item) => {
            if (item) {
              const tex = am.items[item.id];
              material.uniforms.iChannel0.value = tex;
              material.uniforms.uMediaSize.value.set(
                tex.image.width,
                tex.image.height
              );
              gsap.to(material.uniforms.uOpacity, { value: 1, duration: 0.3 });
              gsap.fromTo(
                material.uniforms.uMouseEnter,
                { value: 0 },
                { value: 1, duration: 1.2, ease: 'power2.out' }
              );
              gsap.fromTo(
                material.uniforms.uMouseEnterMask,
                { value: 0 },
                { value: 1, duration: 0.7, ease: 'power2.out' }
              );
            } else {
              gsap.to(material.uniforms.uOpacity, { value: 0, duration: 0.3 });
            }
          };

          const itemHandlers = new Map();
          items.forEach((item) => {
            const el = itemRefs.current.get(item.id);
            if (el) {
              const handler = () => doTransition(item);
              itemHandlers.set(item.id, handler);
              el.addEventListener('mouseenter', handler);
            }
          });

          const galleryLeaveHandler = () => doTransition(null);
          galleryEl.addEventListener('mouseleave', galleryLeaveHandler);

          sketch._cleanup = () => {
            itemHandlers.forEach((handler, itemId) => {
              const el = itemRefs.current.get(itemId);
              el?.removeEventListener('mouseenter', handler);
            });
            galleryEl.removeEventListener('mouseleave', galleryLeaveHandler);
          };
        });
      }
    }

    const sketch = new Sketch(`#${containerIdRef.current}`);
    sketch.create();
    sketchRef.current = sketch;

    return () => {
      if (sketchRef.current) {
        sketchRef.current._cleanup?.();
        sketchRef.current.destroy?.();
        sketchRef.current = null;
      }
    };
  }, [items, hoverImageSize, offsetAmount]);

  return (
    <div className="webgl-gallery-container">
      <div ref={canvasRef} className="webgl-gallery-canvas" />

      <img
        ref={hoverImgRef}
        alt=""
        className="webgl-gallery-hover-image"
        style={{
          width: hoverImageSize.width,
          height: hoverImageSize.height,
        }}
      />

      <div ref={galleryRef} className="webgl-gallery-list">
        {items.map((item) => (
          <div
            key={item.id}
            ref={(el) => {
              if (el) itemRefs.current.set(item.id, el);
            }}
            className="webgl-gallery-item"
          >
            {item.label}
          </div>
        ))}
      </div>
    </div>
  );
}
