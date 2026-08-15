import { Clock } from "lucide-react"

function Marquee() {
  return (
    <div
      className="relative w-full h-9 border-b overflow-hidden transition-colors duration-200"
      style={{
        background: "var(--surface, #fff)",
        borderColor: "var(--border, #e2e8f0)",
      }}
    >
      <span
        className="absolute top-1/2 -translate-y-1/2 inline-flex items-center gap-2 whitespace-nowrap animate-marquee font-medium text-sm"
        style={{ color: "var(--primary, #2563eb)" }}
      >
        <Clock className="h-4 w-4 shrink-0" />
        Please wait a moment for the server to respond — first request may take up to a minute to wake up. Thanks for your patience!
      </span>
    </div>
  )
}

export default Marquee