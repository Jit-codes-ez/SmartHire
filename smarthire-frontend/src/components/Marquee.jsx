import { Clock } from "lucide-react"

function Marquee() {
  const message = (
    <span className="inline-flex items-center gap-2">
      <Clock className="h-4 w-4 shrink-0" />
      Please wait a moment for the server to respond — first request may take up to a minute to wake up. Thanks for your patience!
    </span>
  )

  return (
    <div
      className="w-full border-b overflow-hidden py-2 transition-colors duration-200"
      style={{
        background: "var(--surface, #fff)",
        borderColor: "var(--border, #e2e8f0)",
      }}
    >
      <div
        className="inline-flex items-center gap-8 whitespace-nowrap animate-marquee font-medium text-sm"
        style={{ color: "var(--primary, #2563eb)" }}
      >
        {message}
        {message}
        {message}
      </div>
    </div>
  )
}

export default Marquee