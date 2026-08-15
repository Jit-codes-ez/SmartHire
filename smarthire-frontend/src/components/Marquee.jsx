import { Clock } from "lucide-react"

const MESSAGE =
  "Please wait a moment for the server to respond — first request may take up to a minute to wake up. Thanks for your patience!"

function Marquee() {
  const item = (
    <span className="inline-flex items-center gap-2 whitespace-nowrap font-medium text-sm pr-10">
      <Clock className="h-4 w-4 shrink-0" />
      {MESSAGE}
    </span>
  )

  // Repeat enough times so one "half" is wider than any screen —
  // this is what actually prevents the gap/jump.
  const half = Array.from({ length: 6 }, (_, i) => (
    <span key={i} className="inline-flex items-center">{item}</span>
  ))

  return (
    <div
      className="relative w-full border-b overflow-hidden flex items-center transition-colors duration-200"
      style={{
        background: "var(--surface, #fff)",
        borderColor: "var(--border, #e2e8f0)",
      }}
    >
      <div
        className="flex items-center animate-marquee py-2"
        style={{ color: "var(--primary, #2563eb)" }}
      >
        <span className="inline-flex items-center">{half}</span>
        <span className="inline-flex items-center" aria-hidden="true">{half}</span>
      </div>
    </div>
  )
}

export default Marquee