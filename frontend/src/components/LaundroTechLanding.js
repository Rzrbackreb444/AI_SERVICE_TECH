import React from 'react';
import { 
  BuildingOfficeIcon,
  ArrowRightIcon,
  LockClosedIcon,
  MapPinIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  BoltIcon
} from '@heroicons/react/24/outline';

const LaundroTechLanding = ({ onOpenAuth }) => {
  const features = [
    {
      icon: MapPinIcon,
      title: 'Location Intelligence',
      description: 'Precision site scoring with demographics, demand density, traffic flows, and accessibility — powered by live external data.',
      gradient: 'from-cyan-500 to-emerald-500'
    },
    {
      icon: ChartBarIcon,
      title: 'Market Signals',
      description: 'Real-time market saturation, competitor movements, and trend inflections with anomaly detection.',
      gradient: 'from-violet-500 to-fuchsia-500'
    },
    {
      icon: BoltIcon,
      title: 'Predictive Models',
      description: 'Next-gen scoring and risk models highlight asymmetric opportunities before the market sees them.',
      gradient: 'from-amber-500 to-rose-500'
    },
    {
      icon: ShieldCheckIcon,
      title: 'Risk Controls',
      description: 'Multi-factor risk assessment: volatility, concentration, policy, and competitor resilience.',
      gradient: 'from-sky-500 to-indigo-500'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      {/* Top Nav */}
      <nav className="fixed inset-x-0 top-0 z-50 border-b border-white/5 bg-slate-950/70 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 flex items-center justify-center mr-3 shadow-[0_0_24px_-6px_#06b6d4]">
                <BuildingOfficeIcon className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold tracking-tight text-white/90">LaundroTech Intelligence</span>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <a href="#features" className="text-slate-400 hover:text-white transition-colors">Platform</a>
              <a href="/pricing" className="text-slate-400 hover:text-white transition-colors">Pricing</a>
              <a href="/blog" className="text-slate-400 hover:text-white transition-colors">Blog</a>
              <a href="/support" className="text-slate-400 hover:text-white transition-colors">Support</a>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={() => onOpenAuth('login')}
                className="px-4 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-white/5 transition-colors"
              >
                Sign in
              </button>
              <button
                onClick={() => onOpenAuth('register')}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-emerald-500 text-white font-medium hover:from-cyan-400 hover:to-emerald-400 shadow-lg shadow-cyan-500/20"
              >
                Start free
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-28 pb-20 overflow-hidden">
        {/* Ambient glows */}
        <div className="pointer-events-none absolute -top-24 -left-16 w-[40rem] h-[40rem] rounded-full bg-cyan-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -right-16 w-[40rem] h-[40rem] rounded-full bg-fuchsia-600/10 blur-3xl" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center text-xs font-medium text-cyan-300/80 mb-4">
                <span className="px-2.5 py-1 rounded-full bg-cyan-400/10 border border-cyan-400/20">Live data platform</span>
                <span className="mx-3 text-slate-600">|</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-400/10 border border-emerald-400/20">Risk-aware analytics</span>
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight leading-tight text-white">
                The operating system for laundromat investment
              </h1>
              <p className="mt-6 text-lg text-slate-300 max-w-xl">
                Make confident decisions with enterprise-grade, real-time intelligence — built specifically for laundromat acquisition, expansion, and portfolio optimization.
              </p>
              <div className="mt-8 flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => onOpenAuth('register')}
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white text-slate-900 font-semibold hover:bg-slate-100 transition-colors"
                >
                  Start analysis
                  <ArrowRightIcon className="h-5 w-5 ml-2" />
                </button>
                <a
                  href="/pricing"
                  className="inline-flex items-center justify-center px-6 py-3 rounded-xl bg-white/5 text-slate-200 hover:bg-white/10 border border-white/10"
                >
                  View pricing
                </a>
              </div>

              {/* No mock numbers — neutral trust line */}
              <div className="mt-6 text-sm text-slate-400">
                Live metrics and reports are visible after sign-in.
              </div>
            </div>

            {/* Live card (locked preview) */}
            <div className="relative">
              <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-semibold text-white/90">Live Analysis Preview</h3>
                  <div className="flex items-center text-xs text-slate-400">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                    Connected
                  </div>
                </div>

                {/* Locked layer */}
                <div className="relative">
                  <div className="space-y-3 opacity-80">
                    <div className="h-10 rounded-lg bg-gradient-to-r from-white/5 to-white/0 border border-white/10" />
                    <div className="h-10 rounded-lg bg-gradient-to-r from-white/5 to-white/0 border border-white/10" />
                    <div className="h-10 rounded-lg bg-gradient-to-r from-white/5 to-white/0 border border-white/10" />
                    <div className="h-10 rounded-lg bg-gradient-to-r from-white/5 to-white/0 border border-white/10" />
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-slate-950/60 backdrop-blur-sm border border-white/10">
                    <div className="text-center">
                      <div className="mx-auto w-12 h-12 rounded-full bg-white/10 border border-white/10 flex items-center justify-center mb-3">
                        <LockClosedIcon className="h-6 w-6 text-white/80" />
                      </div>
                      <div className="text-sm text-slate-300">Sign in to view live metrics</div>
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => onOpenAuth('login')}
                    className="text-xs px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200"
                  >
                    Unlock
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <h2 className="text-3xl font-semibold text-white">Platform capabilities</h2>
            <p className="mt-2 text-slate-400 max-w-2xl">Built for serious operators. Every critical signal, in one place — no gimmicks, no fluff.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <div key={i} className="group relative rounded-2xl border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.05] transition-colors">
                <div className={`w-11 h-11 rounded-xl bg-gradient-to-r ${f.gradient} flex items-center justify-center shadow-lg shadow-black/20 mb-4`}>
                  <f.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-white font-semibold mb-1">{f.title}</h3>
                <p className="text-sm text-slate-400 leading-relaxed">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="rounded-2xl border border-white/10 bg-gradient-to-r from-cyan-500/10 via-emerald-500/10 to-cyan-500/10 p-8 text-center">
            <h3 className="text-2xl font-semibold text-white">Ready when you are</h3>
            <p className="mt-2 text-slate-300">Create your account to unlock live analysis, predictive models, and risk dashboards.</p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => onOpenAuth('register')}
                className="px-6 py-3 rounded-xl bg-white text-slate-900 font-semibold hover:bg-slate-100"
              >
                Create account
              </button>
              <button
                onClick={() => onOpenAuth('login')}
                className="px-6 py-3 rounded-xl bg-white/5 text-slate-200 hover:bg-white/10 border border-white/10"
              >
                Sign in
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-sm text-slate-400">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center">
              <div className="w-8 h-8 rounded-md bg-gradient-to-r from-cyan-500 to-emerald-500 flex items-center justify-center mr-3">
                <BuildingOfficeIcon className="h-4 w-4 text-white" />
              </div>
              <span className="text-slate-300">LaundroTech Intelligence</span>
            </div>
            <div className="space-x-6">
              <a href="/privacy" className="hover:text-white">Privacy</a>
              <a href="/terms" className="hover:text-white">Terms</a>
              <a href="/disclaimer" className="hover:text-white">Disclaimer</a>
            </div>
          </div>
          <div className="mt-6 text-center md:text-left">© {new Date().getFullYear()} LaundroTech Intelligence. All rights reserved.</div>
        </div>
      </footer>
    </div>
  );
};

export default LaundroTechLanding;