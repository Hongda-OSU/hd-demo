const LAYERS = [
  { speed: 0.3, background: 'radial-gradient(circle at 30% 30%, #23234a, transparent 60%)' },
  { speed: 0.6, background: 'radial-gradient(circle at 70% 60%, #4a2350, transparent 55%)' },
]

export default function Layers({ y }) {
  return LAYERS.map((layer, i) => (
    <div
      key={i}
      style={{
        position: 'fixed',
        inset: 0,
        background: layer.background,
        transform: `translateY(${y * layer.speed}px)`,
      }}
    />
  ))
}
