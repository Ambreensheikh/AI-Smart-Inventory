"use client";
import Link from "next/link";
import { Camera, Box, BarChart3, ShieldCheck } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen text-white">
      <main className="max-w-6xl mx-auto px-6 py-20 flex flex-col items-center text-center">
        
        {/* Animated Badge */}
        <div className="animate-glow inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 text-blue-400 text-sm font-medium mb-8 border border-blue-500/20 shadow-[0_0_15px_rgba(59,130,246,0.2)]">
          <ShieldCheck size={16} />
          <span>Powered by Gemini 1.5 Flash</span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-6 bg-gradient-to-b from-white to-slate-500 bg-clip-text text-transparent">
          SmartScan <br /> Inventory AI
        </h1>
        
        <p className="text-slate-400 max-w-2xl mb-12 text-lg leading-relaxed">
          Experience the future of warehouse management. One snap, infinite data.
        </p>

        {/* Buttons with Hover Effects */}
        <div className="flex flex-wrap justify-center gap-6 mb-24">
          <Link href="/scan" className="group relative bg-blue-600 hover:bg-blue-500 text-white px-10 py-5 rounded-2xl font-bold text-xl transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.5)] flex items-center gap-3">
            <Camera className="group-hover:rotate-12 transition-transform" />
            Start Scanning
          </Link>
          <Link href="/dashboard" className="bg-slate-800/50 hover:bg-slate-800 border border-slate-700 text-slate-300 px-10 py-5 rounded-2xl font-bold text-xl transition-all">
            View Dashboard
          </Link>
        </div>

        {/* Features Grid with Hover Cards */}
        <div className="grid md:grid-cols-3 gap-8 w-full">
          {[
            { icon: <Camera />, title: "Instant Scan", desc: "Real-time AI object detection." },
            { icon: <Box />, title: "Auto Inventory", desc: "Syncs directly with NeonDB." },
            { icon: <BarChart3 />, title: "Analytics", desc: "Smart stock level insights." }
          ].map((item, i) => (
            <div key={i} className="glass-card p-10 rounded-[3rem] text-left group">
              <div className="w-14 h-14 bg-blue-600/20 rounded-2xl flex items-center justify-center text-blue-500 mb-6 group-hover:scale-110 transition-transform">
                {item.icon}
              </div>
              <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
              <p className="text-slate-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
  // test deploy).
}