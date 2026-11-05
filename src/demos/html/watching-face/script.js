// Get the elements
const eyes = document.querySelectorAll(".eye")
const body = document.querySelector("body")

// Turn the eyes as the pointer moves over the body. Pointer events cover a
// finger on a touch screen as well as the mouse.
body.addEventListener("pointermove", (event) => {
  eyes.forEach((eye) => {
    let x = eye.getBoundingClientRect().left + eye.clientWidth / 2
    let y = eye.getBoundingClientRect().top + eye.clientHeight / 2
    // clientX, not pageX: getBoundingClientRect is in viewport coordinates.
    let radian = Math.atan2(event.clientX - x, event.clientY - y)
    let rot = radian * (180 / Math.PI) * -1 + 270
    eye.style.transform = `rotate(${rot}deg)`
  })
})
