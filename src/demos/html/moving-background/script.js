// https://css-tricks.com/moving-backgrounds/

var container = document.querySelector(".container");

// Pointer events cover touch as well as the mouse.
container.addEventListener("pointermove", function(e) {
  var rect = container.getBoundingClientRect();

  // 获取鼠标在容器内的相对位置
  var x = e.clientX - rect.left;
  var y = e.clientY - rect.top;

  // 计算相对移动量
  var moveX = ((x / rect.width) - 0.5) * 2; // -1 到 1 之间的值
  var moveY = ((y / rect.height) - 0.5) * 2; // -1 到 1 之间的值

  // 根据比例调整背景位置，初始位置为 50% 30%
  var backgroundX = 50 + moveX * 20; // 调整 20 可以控制水平移动的敏感度
  var backgroundY = 30 + moveY * 15; // 调整 15 可以控制垂直移动的敏感度

  container.style.backgroundPosition = backgroundX + "% " + backgroundY + "%";
});

container.addEventListener("pointerleave", function() {
  container.style.backgroundPosition = "50% 30%"; // 恢复到初始位置
});
