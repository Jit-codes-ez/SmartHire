function Marquee() {
  return (
    <div className="w-full bg-slate-800 border-b border-slate-700 text-teal-400 overflow-hidden py-2">
      <div className="whitespace-nowrap animate-marquee font-medium text-sm">
        Please wait a moment for the server to respond — first request may take up to a minute to wake up. Thanks for your patience! &nbsp; &nbsp; &nbsp; &nbsp; Please wait a moment for the server to respond — first request may take up to a minute to wake up. Thanks for your patience!
      </div>
    </div>
  )
}

export default Marquee