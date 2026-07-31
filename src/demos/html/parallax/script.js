window.addEventListener('scroll', () => {
  const y = window.scrollY
  document.querySelector('.bg').style.transform = `translateY(${y * 0.3}px)`
  document.querySelector('.mid').style.transform = `translateY(${y * 0.6}px)`
})
