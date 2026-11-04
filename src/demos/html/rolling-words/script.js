const words = [
  "how to fold a fitted sheet",
  "cat-proof christmas tree",
  "is a hot dog a sandwich",
  "socks that never get lost",
  "why do onions make you cry",
]

let counter = 1

setInterval(() => {
  if (counter >= words.length) {
    counter = 0
  }

  const nextWord = words[counter]

  viewTransition(() => {
    document.querySelector(".word").innerText = nextWord
  })

  counter++
}, 1500)

function viewTransition(fn, params) {
  if (document.startViewTransition) {
    document.startViewTransition(() => fn(params))
  } else {
    fn(params)
  }
}
