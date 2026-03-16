export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  disabled = false,
  type = 'button',
}) {
  const base =
    'inline-flex items-center justify-center font-medium rounded-2xl transition-all duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-violet-400 disabled:opacity-30 disabled:cursor-not-allowed active:scale-[0.98]'

  const variants = {
    primary:
      'bg-gradient-to-r from-violet-600 to-violet-500 hover:from-violet-500 hover:to-violet-400 text-white shadow-lg shadow-violet-900/50 hover:shadow-violet-700/40 hover:shadow-xl',
    secondary:
      'glass glass-hover text-slate-200',
    ghost:
      'text-slate-400 hover:text-slate-200 hover:bg-white/5',
    danger:
      'bg-gradient-to-r from-rose-700 to-rose-600 hover:from-rose-600 hover:to-rose-500 text-white',
    teal:
      'bg-gradient-to-r from-teal-600 to-teal-500 hover:from-teal-500 hover:to-teal-400 text-white shadow-lg shadow-teal-900/50 hover:shadow-teal-700/40 hover:shadow-xl',
  }

  const sizes = {
    sm: 'px-4 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-6 py-3.5 text-base',
    xl: 'px-8 py-4 text-lg',
    icon: 'p-2.5',
  }

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  )
}
