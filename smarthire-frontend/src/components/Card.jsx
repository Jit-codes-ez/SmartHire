/** Generic content card — white/dark surface with the 3.5px role-coloured left border. */
export default function Card({ children, className = '', as: As = 'div', ...rest }) {
  return (
    <As className={`card ${className}`} {...rest}>
      {children}
    </As>
  )
}
