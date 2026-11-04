import React, { useEffect, useRef } from "react";
import "./ParallaxEffect.css";

const range = 40;

// 计算旋转角度的函数
const calcValue = (a, b) => ((a / b) * range - range / 2).toFixed(1);

const ParallaxEffect = () => {
  const pageXRef = useRef(null);
  const cardsRef = useRef(null);
  const imagesRef = useRef([]);
  const backgroundsRef = useRef([]);

  // 挂载和卸载事件监听器
  useEffect(() => {
    // 减少动态效果时卡片保持正面
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const pageX = pageXRef.current;

    // 视差动画函数
    const parallax = (e) => {
      // 指针回来了，跟手转，不再缓动
      pageX.classList.remove("is-resetting");

      const x = e.clientX;
      const y = e.clientY;
      const xValue = calcValue(x, window.innerWidth);
      const yValue = calcValue(y, window.innerHeight);

      // 设置卡片容器的旋转角度
      if (cardsRef.current) {
        cardsRef.current.style.transform = `rotateX(${yValue}deg) rotateY(${xValue}deg)`;
      }

      // 设置所有图片的位移
      imagesRef.current.forEach((item) => {
        item.style.transform = `translateX(${-xValue}px) translateY(${yValue}px)`;
      });

      // 设置所有背景图的位置
      backgroundsRef.current.forEach((item) => {
        item.style.backgroundPosition = `${xValue * 0.45}px ${-yValue * 0.45}px`;
      });
    };

    // 指针离开时缓缓回正
    const reset = () => {
      pageX.classList.add("is-resetting");
      if (cardsRef.current) {
        cardsRef.current.style.transform = "";
      }
      imagesRef.current.forEach((item) => {
        item.style.transform = "";
      });
      backgroundsRef.current.forEach((item) => {
        item.style.backgroundPosition = "";
      });
    };

    // pointermove 同时覆盖鼠标和触摸
    if (pageX) {
      pageX.addEventListener("pointermove", parallax);
      pageX.addEventListener("pointerleave", reset);
    }

    return () => {
      if (pageX) {
        pageX.removeEventListener("pointermove", parallax);
        pageX.removeEventListener("pointerleave", reset);
      }
    };
  }, []);

  return (
    <div className="parallax-container">
      <div className="page-x" id="pageX" ref={pageXRef}>
        <div className="cards" ref={cardsRef}>
          <h3>Scenes</h3>
          <h1>Dreamscapes</h1>
          {/* 浮岛 */}
          <div className="card floating-isle">
            <div
              className="card-bg"
              ref={(el) => (backgroundsRef.current[0] = el)}
            ></div>
            <img
              className="card-img"
              src="https://hongdalin.blog/hd-demo/demos/react/scene-cards/images/isle.webp"
              ref={(el) => (imagesRef.current[0] = el)}
              alt="A floating island with a tree and a waterfall"
            />
            <div className="card-text">
              <p className="card-title">The Floating Isle</p>
            </div>
          </div>
          {/* 灯笼 */}
          <div className="card lantern-night">
            <div
              className="card-bg"
              ref={(el) => (backgroundsRef.current[1] = el)}
            ></div>
            <img
              className="card-img"
              src="https://hongdalin.blog/hd-demo/demos/react/scene-cards/images/lantern.webp"
              ref={(el) => (imagesRef.current[1] = el)}
              alt="A glowing red paper lantern"
            />
            <div className="card-text">
              <p className="card-title">Lantern Night</p>
            </div>
          </div>
          {/* 夜车 */}
          <div className="card night-train">
            <div
              className="card-bg"
              ref={(el) => (backgroundsRef.current[2] = el)}
            ></div>
            <img
              className="card-img"
              src="https://hongdalin.blog/hd-demo/demos/react/scene-cards/images/train.webp"
              ref={(el) => (imagesRef.current[2] = el)}
              alt="A green steam locomotive puffing steam"
            />
            <div className="card-text">
              <p className="card-title">Night Train</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ParallaxEffect;
