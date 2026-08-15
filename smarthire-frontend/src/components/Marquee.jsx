import { Clock } from "lucide-react"

const MESSAGE =
  "Please wait a moment for the server to respond — first request may take up to a minute to wake up. Thanks for your patience!"

function Marquee() {
  return (
    <div
      className="relative w-full border-b overflow-hidden py-2 flex items-center transition-colors duration-200"
      style={{
        background: "var(--surface, #fff)",
        borderColor: "var(--border, #e2e8f0)",
      }}
    >
      <span
        className="inline-flex items-center gap-2 whitespace-nowrap font-medium text-sm animate-marquee"
        style={{ color: "var(--primary, #2563eb)" }}
      >
        <Clock className="h-4 w-4 shrink-0" />
        {MESSAGE}
      </span>
    </div>
  )
}

export default Marquee