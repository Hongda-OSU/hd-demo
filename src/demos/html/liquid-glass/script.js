(function () {
  "use strict";

  // 检查是否已存在液体玻璃效果并销毁
  if (window.liquidGlass) {
    window.liquidGlass.destroy();
    console.log("Previous liquid glass effect removed.");
  }

  // 工具函数
  function smoothStep(a, b, t) {
    t = Math.max(0, Math.min(1, (t - a) / (b - a)));
    return t * t * (3 - 2 * t);
  }

  function length(x, y) {
    return Math.sqrt(x * x + y * y);
  }

  function roundedRectSDF(x, y, width, height, radius) {
    const qx = Math.abs(x) - width + radius;
    const qy = Math.abs(y) - height + radius;
    return (
      Math.min(Math.max(qx, qy), 0) +
      length(Math.max(qx, 0), Math.max(qy, 0)) -
      radius
    );
  }

  function texture(x, y) {
    return { type: "t", x, y };
  }

  // 生成唯一ID
  function generateId() {
    return "liquid-glass-" + Math.random().toString(36).substr(2, 9);
  }

  // 主着色器类
  class Shader {
    constructor(options = {}) {
      this.width = options.width || 100;
      this.height = options.height || 100;
      this.fragment = options.fragment || ((uv) => texture(uv.x, uv.y));
      this.canvasDPI = 1;
      this.id = generateId();
      this.offset = 10; // 视口边界偏移

      this.mouse = { x: 0, y: 0 };
      this.mouseUsed = false;

      this.createElement();
      this.setupEventListeners();
      this.updateShader();
    }

    createElement() {
      // 创建容器
      this.container = document.createElement("div");
      this.container.className = "liquid-glass";
      this.container.tabIndex = 0;
      this.container.setAttribute("aria-label", "Liquid glass, move it with the arrow keys");
      this.container.style.cssText = `
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                width: ${this.width}px;
                height: ${this.height}px;
                backdrop-filter: url(#${this.id}_filter) blur(0.25px) contrast(1.2) brightness(1.05) saturate(1.1);
            `;

      // 创建SVG滤镜
      this.svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
      this.svg.setAttribute("xmlns", "http://www.w3.org/2000/svg");
      this.svg.setAttribute("width", "0");
      this.svg.setAttribute("height", "0");
      this.svg.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 0;
                height: 0;
                pointer-events: none;
                z-index: 9998;
            `;

      const defs = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "defs"
      );
      const filter = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "filter"
      );
      filter.setAttribute("id", `${this.id}_filter`);
      filter.setAttribute("filterUnits", "userSpaceOnUse");
      filter.setAttribute("color-interpolation-filters", "sRGB");
      filter.setAttribute("x", "0");
      filter.setAttribute("y", "0");
      filter.setAttribute("width", this.width.toString());
      filter.setAttribute("height", this.height.toString());

      this.feImage = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "feImage"
      );
      this.feImage.setAttribute("id", `${this.id}_map`);
      this.feImage.setAttribute("width", this.width.toString());
      this.feImage.setAttribute("height", this.height.toString());

      this.feDisplacementMap = document.createElementNS(
        "http://www.w3.org/2000/svg",
        "feDisplacementMap"
      );
      this.feDisplacementMap.setAttribute("in", "SourceGraphic");
      this.feDisplacementMap.setAttribute("in2", `${this.id}_map`);
      this.feDisplacementMap.setAttribute("xChannelSelector", "R");
      this.feDisplacementMap.setAttribute("yChannelSelector", "G");

      filter.appendChild(this.feImage);
      filter.appendChild(this.feDisplacementMap);
      defs.appendChild(filter);
      this.svg.appendChild(defs);

      // 创建位移贴图画布（隐藏）
      this.canvas = document.createElement("canvas");
      this.canvas.width = this.width * this.canvasDPI;
      this.canvas.height = this.height * this.canvasDPI;
      this.canvas.style.display = "none";

      this.context = this.canvas.getContext("2d");
    }

    constrainPosition(x, y) {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      // 计算带偏移的边界
      const minX = this.offset;
      const maxX = viewportWidth - this.width - this.offset;
      const minY = this.offset;
      const maxY = viewportHeight - this.height - this.offset;

      // 约束位置
      const constrainedX = Math.max(minX, Math.min(maxX, x));
      const constrainedY = Math.max(minY, Math.min(maxY, y));

      return { x: constrainedX, y: constrainedY };
    }

    moveTo(x, y) {
      const constrained = this.constrainPosition(x, y);

      this.container.style.left = constrained.x + "px";
      this.container.style.top = constrained.y + "px";
      this.container.style.transform = "none";
    }

    setupEventListeners() {
      let isDragging = false;
      let startX, startY, initialX, initialY;

      this.container.addEventListener("pointerdown", (e) => {
        isDragging = true;
        this.container.classList.add("dragging");
        startX = e.clientX;
        startY = e.clientY;
        const rect = this.container.getBoundingClientRect();
        initialX = rect.left;
        initialY = rect.top;
        e.preventDefault();
      });

      document.addEventListener("pointermove", (e) => {
        if (isDragging) {
          const deltaX = e.clientX - startX;
          const deltaY = e.clientY - startY;

          // 计算新位置，并在视口范围内约束
          this.moveTo(initialX + deltaX, initialY + deltaY);
        }

        // 更新着色器的鼠标位置
        const rect = this.container.getBoundingClientRect();
        this.mouse.x = (e.clientX - rect.left) / rect.width;
        this.mouse.y = (e.clientY - rect.top) / rect.height;

        if (this.mouseUsed) {
          this.updateShader();
        }
      });

      const endDrag = () => {
        isDragging = false;
        this.container.classList.remove("dragging");
      };
      document.addEventListener("pointerup", endDrag);
      document.addEventListener("pointercancel", endDrag);

      // 方向键移动玻璃，按住 Shift 走得更快
      const keySteps = {
        ArrowLeft: [-1, 0],
        ArrowRight: [1, 0],
        ArrowUp: [0, -1],
        ArrowDown: [0, 1],
      };
      this.container.addEventListener("keydown", (e) => {
        const step = keySteps[e.key];
        if (!step) return;
        const distance = e.shiftKey ? 50 : 10;
        const rect = this.container.getBoundingClientRect();
        this.moveTo(rect.left + step[0] * distance, rect.top + step[1] * distance);
        e.preventDefault();
      });

      // 处理窗口大小变化以保持约束
      window.addEventListener("resize", () => {
        const rect = this.container.getBoundingClientRect();
        const constrained = this.constrainPosition(rect.left, rect.top);

        if (rect.left !== constrained.x || rect.top !== constrained.y) {
          this.moveTo(rect.left, rect.top);
        }
      });
    }

    updateShader() {
      const mouseProxy = new Proxy(this.mouse, {
        get: (target, prop) => {
          this.mouseUsed = true;
          return target[prop];
        },
      });

      this.mouseUsed = false;

      const w = this.width * this.canvasDPI;
      const h = this.height * this.canvasDPI;
      const data = new Uint8ClampedArray(w * h * 4);

      let maxScale = 0;
      const rawValues = [];

      for (let i = 0; i < data.length; i += 4) {
        const x = (i / 4) % w;
        const y = Math.floor(i / 4 / w);
        const pos = this.fragment({ x: x / w, y: y / h }, mouseProxy);
        const dx = pos.x * w - x;
        const dy = pos.y * h - y;
        maxScale = Math.max(maxScale, Math.abs(dx), Math.abs(dy));
        rawValues.push(dx, dy);
      }

      maxScale *= 0.5;

      let index = 0;
      for (let i = 0; i < data.length; i += 4) {
        const r = rawValues[index++] / maxScale + 0.5;
        const g = rawValues[index++] / maxScale + 0.5;
        data[i] = r * 255;
        data[i + 1] = g * 255;
        data[i + 2] = 0;
        data[i + 3] = 255;
      }

      this.context.putImageData(new ImageData(data, w, h), 0, 0);
      this.feImage.setAttributeNS(
        "http://www.w3.org/1999/xlink",
        "href",
        this.canvas.toDataURL()
      );
      this.feDisplacementMap.setAttribute(
        "scale",
        (maxScale / this.canvasDPI).toString()
      );
    }

    appendTo(parent) {
      parent.appendChild(this.svg);
      parent.appendChild(this.container);
    }

    destroy() {
      this.svg.remove();
      this.container.remove();
      this.canvas.remove();
    }
  }

  // 创建液体玻璃效果
  function createLiquidGlass() {
    // 创建着色器
    const shader = new Shader({
      width: 300,
      height: 150,
      fragment: (uv, mouse) => {
        const ix = uv.x - 0.5;
        const iy = uv.y - 0.5;
        const distanceToEdge = roundedRectSDF(ix, iy, 0.3, 0.2, 0.6);
        const displacement = smoothStep(0.8, 0, distanceToEdge - 0.15);
        const scaled = smoothStep(0, 1, displacement);
        return texture(ix * scaled + 0.5, iy * scaled + 0.5);
      },
    });

    // 添加到页面
    shader.appendTo(document.body);

    console.log("液体玻璃效果已创建！拖拽玻璃球在页面中移动。");

    // 返回着色器实例以便必要时移除
    window.liquidGlass = shader;
  }

  // 等待 DOM 加载完成后初始化
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", createLiquidGlass);
  } else {
    createLiquidGlass();
  }
})();
