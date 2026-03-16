export default function Card({ children, className = '', onClick, glow }) {
  const interactive = onClick
    ? 'cursor-pointer glass-hover transition-all duration-300'
    : ''
  const glowClass = glow === 'violet' ? 'glow-violet' : glow === 'teal' ? 'glow-teal' : ''

  return (
    <div
      className={`glass ${interactive} ${glowClass} ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
