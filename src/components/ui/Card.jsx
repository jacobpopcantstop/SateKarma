export default function Card({ children, className = '', onClick }) {
  const base =
    'bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm'
  const interactive = onClick ? 'cursor-pointer hover:bg-white/10 transition-colors duration-200' : ''

  return (
    <div className={`${base} ${interactive} ${className}`} onClick={onClick}>
      {children}
    </div>
  )
}
