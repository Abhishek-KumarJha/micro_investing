import Link from 'next/link';

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden flex flex-col items-center justify-center">
      {/* Background Gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-600/20 rounded-full blur-[120px] pointer-events-none" />

      <div className="z-10 text-center px-4 max-w-4xl">
        <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 bg-clip-text text-transparent bg-gradient-to-r from-emerald-400 via-teal-300 to-blue-500 animate-pulse">
          Micro-Investing, Macro Impact.
        </h1>
        <p className="text-lg md:text-2xl text-slate-300 mb-10 max-w-2xl mx-auto font-light">
          Your AI-powered financial assistant that turns everyday spare change into a powerful investment portfolio.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/dashboard"
            className="group relative px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-slate-900 font-bold rounded-full transition-all duration-300 shadow-[0_0_20px_rgba(16,185,129,0.4)] hover:shadow-[0_0_30px_rgba(16,185,129,0.6)] transform hover:-translate-y-1"
          >
            Go to Dashboard
            <span className="absolute inset-0 rounded-full border border-white/20 group-hover:border-white/40 transition-colors" />
          </Link>
          <Link
            href="/questionnaire"
            className="px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-medium rounded-full border border-slate-600 transition-all duration-300 hover:border-slate-400 transform hover:-translate-y-1"
          >
            Take Risk Assessment
          </Link>
        </div>

        <div className="mt-20 grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {[
            {
              title: "Behavioral Analytics",
              desc: "We analyze your spending habits to find the perfect micro-investment opportunities.",
              icon: "🧠"
            },
            {
              title: "Hybrid Recommendations",
              desc: "Deep Learning based hybrid recommendations personalized to your risk profile.",
              icon: "⚡"
            },
            {
              title: "Automated Round-offs",
              desc: "Seamlessly invest the spare change from your daily coffee or grocery runs.",
              icon: "🔄"
            }
          ].map((feature, idx) => (
            <div key={idx} className="glassmorphism p-6 rounded-2xl hover:bg-slate-800/50 transition-colors cursor-default">
              <div className="text-4xl mb-4">{feature.icon}</div>
              <h3 className="text-xl font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
