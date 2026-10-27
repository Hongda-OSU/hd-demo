// https://codepen.io/SahilAFX/pen/OxeeNV

var reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches

// Pointer events cover touch as well as the mouse; with reduced motion the
// card simply stays still.
if (!reduceMotion) {
  $("#container").on("pointermove", function (e) {
    parallaxIt(e, "#fire-1", -140)
    parallaxIt(e, "#fire-2", 120)
    parallaxIt(e, ".element", -30)
    parallaxIt(e, "#g-img", -20)
  })
}

function parallaxIt(e, target, movement) {
  var $this = $("#container")
  var relX = e.pageX - $this.offset().left
  var relY = e.pageY - $this.offset().top

  TweenMax.to(target, 1, {
    x: ((relX - $this.width() / 2) / $this.width()) * movement,
    y: ((relY - $this.height() / 2) / $this.height()) * movement,
  })
}
