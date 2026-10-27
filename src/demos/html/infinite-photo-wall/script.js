const photobox = {
  container: document.querySelector(".photos"),
  img_data: [],
  container_width: 0,
  container_height: 0,
  photo_width: 0,
  photo_height: 0,
  if_movable: false,
  mouse_x: 0,
  mouse_y: 0,
  standard_width: 1440,
  scale_nums: 1,
  key_steps: {
    ArrowLeft: [120, 0],
    ArrowRight: [-120, 0],
    ArrowUp: [0, 120],
    ArrowDown: [0, -120],
  },
  init() {
    this.container = document.querySelector(".photos");
    this.resize();
    window.addEventListener("resize", () => {
      this.resize();
    });
    // Pointer events cover mouse, touch and pen alike.
    this.container.addEventListener("pointerdown", (e) => {
      this.if_movable = true;
      this.mouse_x = e.clientX;
      this.mouse_y = e.clientY;
    });
    this.container.addEventListener("pointerup", () => {
      this.if_movable = false;
    });
    this.container.addEventListener("pointerleave", () => {
      this.if_movable = false;
    });
    this.container.addEventListener("pointermove", (e) => {
      this.move(e.clientX, e.clientY);
    });
    this.container.addEventListener("keydown", (e) => {
      const step = this.key_steps[e.key];
      if (!step) return;
      e.preventDefault();
      this.pan(step[0], step[1]);
    });
  },
  resize() {
    let imgs = [...document.querySelectorAll(".photo")];
    this.container_width = this.container.offsetWidth;
    this.container_height = this.container.offsetHeight;
    this.photo_width = imgs[0].offsetWidth;
    this.photo_height = imgs[0].offsetHeight;
    this.scale_nums = document.body.offsetWidth / this.standard_width;
    this.container.style.transform = `scale(${this.scale_nums})`;
    gsap.to(imgs, {
      transform: `translate(0,0)`,
      duration: 0,
      ease: "power4.out",
    });
    this.img_data = [];
    imgs.forEach((img) => {
      this.img_data.push({
        node: img,
        x: img.offsetLeft,
        y: img.offsetTop,
        mov_x: 0,
        mov_y: 0,
        ani: 0,
      });
    });
  },
  move(x, y) {
    if (!this.if_movable) return 0;
    this.pan(
      (x - this.mouse_x) / this.scale_nums,
      (y - this.mouse_y) / this.scale_nums
    );
    this.mouse_x = x;
    this.mouse_y = y;
  },
  pan(distance_x, distance_y) {
    this.img_data.forEach((img) => {
      let duration = 1;
      img.mov_x += distance_x;
      if (img.x + img.mov_x > this.container_width) {
        img.mov_x -= this.container_width;
        duration = 0;
      }
      if (img.x + img.mov_x < -this.photo_width) {
        img.mov_x += this.container_width;
        duration = 0;
      }
      img.mov_y += distance_y;
      if (img.y + img.mov_y > this.container_height) {
        img.mov_y -= this.container_height;
        duration = 0;
      }
      if (img.y + img.mov_y < -this.photo_height) {
        img.mov_y += this.container_height;
        duration = 0;
      }
      if (img.ani) img.ani.kill();
      img.ani = gsap.to(img.node, {
        transform: `translate(${img.mov_x}px,${img.mov_y}px)`,
        duration: duration,
        ease: "power4.out",
      });
    });
  },
};

const shuffle = (arr) => {
  let newarray = [];
  while (arr.length > 0) {
    let chosenIndex = Math.floor(Math.random() * arr.length);
    let chosenValue = arr[chosenIndex];
    newarray.push(chosenValue);
    arr.splice(chosenIndex, 1);
  }
  return newarray;
};

const createPhotoGallery = () => {
  const lines = 4;
  const photoGallery = document.createElement("div");
  photoGallery.className = "photos";
  photoGallery.tabIndex = 0;
  photoGallery.setAttribute("role", "region");
  photoGallery.setAttribute("aria-label", "Photo wall. Drag, or use the arrow keys, to pan.");

  const images = [
    {
      src: "https://hongdalin.blog/hd-demo/demos/html/infinite-photo-wall/images/fuji.png",
      alt: "Mount Fuji at sunrise behind a pagoda and cherry blossom",
    },
    {
      src: "https://hongdalin.blog/hd-demo/demos/html/infinite-photo-wall/images/beach.png",
      alt: "Sunset over the sea beside a palm tree",
    },
    {
      src: "https://hongdalin.blog/hd-demo/demos/html/infinite-photo-wall/images/alps.png",
      alt: "Snowy peaks mirrored in a still lake",
    },
    {
      src: "https://hongdalin.blog/hd-demo/demos/html/infinite-photo-wall/images/desert.png",
      alt: "A camel caravan crossing the dunes at sundown",
    },
    {
      src: "https://hongdalin.blog/hd-demo/demos/html/infinite-photo-wall/images/terraces.png",
      alt: "Rice terraces stepping down a misty valley",
    },
    {
      src: "https://hongdalin.blog/hd-demo/demos/html/infinite-photo-wall/images/santorini.png",
      alt: "White houses and blue domes above the sea",
    },
    {
      src: "https://hongdalin.blog/hd-demo/demos/html/infinite-photo-wall/images/balloons.png",
      alt: "Hot-air balloons over a valley of rock chimneys",
    },
  ];

  for (let i = 0; i < lines; i++) {
    const photosLine = document.createElement("div");
    photosLine.className = "photo-line";

    const shuffledImages = shuffle([...images]);

    shuffledImages.forEach((image) => {
      const photo = document.createElement("div");
      photo.className = "photo";

      const img = document.createElement("img");
      img.src = image.src;
      img.alt = image.alt;

      photo.appendChild(img);
      photosLine.appendChild(photo);
    });

    photoGallery.appendChild(photosLine);
  }

  document.body.appendChild(photoGallery);
  photobox.init();
};

document.addEventListener("DOMContentLoaded", createPhotoGallery);
