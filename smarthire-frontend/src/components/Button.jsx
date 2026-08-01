const variantClass = {
  primary: 'btn-primary',
  secondary: 'btn-secondary',
  danger: 'btn-danger',
}

export default function Button({ variant = 'primary', className = '', children, ...rest }) {
  return (
    <button className={`btn ${variantClass[variant]} ${className}`} {...rest}>
      {children}
    </button>
  )
}
