"use client";
import { useState } from "react";
import { Mail, Lock, User, ArrowRight, Github } from "lucide-react";
import Link from "next/link";

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-4">
      {/* Background Glow */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[120px] pointer-events-none"></div>
      
      <div className="w-full max-w-md relative">
        <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800 p-8 rounded-[2.5rem] shadow-2xl">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black tracking-tighter text-white mb-2">
              {isLogin ? "WELCOME BACK" : "JOIN THE FUTURE"}
            </h1>
            <p className="text-slate-400 text-sm">Manage your inventory with AI Vision</p>
          </div>

          <form className="space-y-4">
            {!isLogin && (
              <div className="relative group">
                <User className="absolute left-4 top-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
                <input type="text" placeholder="Full Name" className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 transition-all" />
              </div>
            )}
            
            <div className="relative group">
              <Mail className="absolute left-4 top-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input type="email" placeholder="Email Address" className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 transition-all" />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-4 text-slate-500 group-focus-within:text-blue-500 transition-colors" size={20} />
              <input type="password" placeholder="Password" className="w-full bg-slate-950 border border-slate-800 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:border-blue-500 transition-all" />
            </div>

            <button className="w-full bg-blue-600 hover:bg-blue-500 text-white font-black py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl shadow-blue-900/20 transition-all active:scale-95">
              {isLogin ? "LOG IN" : "CREATE ACCOUNT"} <ArrowRight size={20} />
            </button>
          </form>

          <div className="mt-8">
            <div className="relative flex items-center justify-center mb-6">
              <div className="border-t border-slate-800 w-full"></div>
              <span className="bg-[#161d2f] px-4 text-slate-500 text-xs font-bold uppercase tracking-widest absolute">Or continue with</span>
            </div>

            <button className="w-full bg-slate-950 border border-slate-800 text-white py-4 rounded-2xl flex items-center justify-center gap-3 hover:bg-slate-900 transition-all">
              <Github size={20} /> Github
            </button>
          </div>

          <p className="text-center mt-8 text-slate-500 text-sm font-medium">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-blue-500 font-bold hover:underline">
              {isLogin ? "Sign Up" : "Log In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}