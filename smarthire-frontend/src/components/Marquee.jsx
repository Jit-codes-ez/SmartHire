import { Clock } from "lucide-react"

function Marquee() {
  const message = (
    <span className="inline-flex items-center gap-2 whitespace-nowrap font-medium text-sm px-10">
      <Clock className="h-4 w-4 shrink-0" />
      Please wait a moment for the server to respond — first request may take up to a minute to wake up. Thanks for your patience!
    </span>
  )

  return (
    <div
      className="relative w-full h-10 border-b overflow-hidden flex items-center transition-colors duration-200"
      style={{
        background: "var(--surface, #fff)",
        borderColor: "var(--border, #e2e8f0)",
      }}
    >
      <div
        className="flex items-center animate-marquee"
        style={{ color: "var(--primary, #2563eb)" }}
      >
        {message}
        {message}
      </div>
    </div>
  )
}

export default Marquee