"use client";
import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { Camera, RefreshCw, ArrowLeft, Loader2, Sparkles, X, ScanLine } from "lucide-react";
import Link from "next/link";

export default function ScanPage() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [report, setReport] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCameraOpen, setIsCameraOpen] = useState(false);

  // --- Camera Cleanup Logic ---
  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      videoRef.current.srcObject = null;
      setIsCameraOpen(false);
    }
  };

  useEffect(() => {
    return () => stopCamera();
  }, []);

  const startCamera = async () => {
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert("Camera API is not supported in this browser.");
        return;
      }
      
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
            facingMode: "environment",
            width: { ideal: 1920 },
            height: { ideal: 1080 }
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsCameraOpen(true); 
        
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play().catch(e => console.error("Play error:", e));
        };
      }
    } catch (err) {
      console.error("Camera initialization failed:", err);
      alert("Camera access denied! Please allow camera permissions.");
    }
  };

  const handleScan = async () => {
    if (!videoRef.current || !canvasRef.current) return;
    setLoading(true);
    setReport(""); // Clear previous report
    console.log("🚀 Scanning started..."); 

    const context = canvasRef.current.getContext("2d");
    if (!context) {
        setLoading(false);
        return;
    }
    
    // Ensure video dimensions are valid
    if (videoRef.current.videoWidth === 0 || videoRef.current.videoHeight === 0) {
        alert("Camera not ready yet. Please wait a moment.");
        setLoading(false);
        return;
    }

    // Set canvas dimensions to match actual video stream
    canvasRef.current.width = videoRef.current.videoWidth;
    canvasRef.current.height = videoRef.current.videoHeight;
    
    context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);

    canvasRef.current.toBlob(async (blob) => {
      if (!blob) {
        setLoading(false);
        return;
      }
      const formData = new FormData();
      formData.append("file", blob, "scan.jpg");

      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";

      try {
        console.log(`📡 Sending request to: ${apiUrl}/inventory/scan`);
        const res = await axios.post(`${apiUrl}/inventory/scan`, formData);
        console.log("✅ Response:", res.data); 
        
        if (res.data.agent_analysis) {
          setReport(res.data.agent_analysis);
        } else if (res.data.message) {
          setReport(`Server Message: ${res.data.message}`);
        } else {
          setReport("Analysis complete, but no detailed report was returned.");
        }
      } catch (err) {
        console.error("❌ Error:", err);
        setReport("Error: Backend connection failed. Ensure backend is running.");
      } finally {
        setLoading(false);
      }
    }, "image/jpeg");
  };

  return (
    <div className="min-h-screen p-4 flex flex-col items-center bg-slate-950 text-white font-sans">
      
      {/* 1. Header Row */}
      <div className="w-full max-w-md flex items-center justify-between mb-6">
        <Link href="/" className="p-2 rounded-full bg-slate-900 hover:bg-slate-800 text-slate-400 transition-colors">
            <ArrowLeft size={20} />
        </Link>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest">
            <Sparkles size={12} /> AI Vision
        </div>
      </div>

      {/* 2. Main Content Wrapper */}
      <div className="w-full max-w-md flex flex-col gap-6">
        
        {/* CAMERA CARD */}
        <div className="relative w-full aspect-[4/3] bg-black rounded-3xl overflow-hidden shadow-2xl border-4 border-slate-900">
            
            {/* Camera Controls Overlay (Stop Button) */}
            {isCameraOpen && (
                <button 
                    onClick={stopCamera}
                    className="absolute top-4 right-4 z-20 bg-black/50 hover:bg-red-600/80 text-white p-2 rounded-full backdrop-blur-md transition-all"
                >
                    <X size={18} />
                </button>
            )}

            {/* Video Element */}
            {/* Added object-contain to fix 'zoomed in' issue */}
            <video 
                ref={videoRef} 
                autoPlay 
                playsInline 
                muted 
                className={`w-full h-full object-contain ${!isCameraOpen ? 'hidden' : ''}`} 
            />

            {/* Placeholder / Start UI */}
            {!isCameraOpen && (
                <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
                    <div className="w-16 h-16 bg-slate-800 rounded-2xl flex items-center justify-center mb-4 text-slate-500">
                        <ScanLine size={32} />
                    </div>
                    <p className="text-slate-400 text-sm mb-6">Camera is inactive</p>
                    <button 
                        onClick={startCamera}
                        className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-xl font-semibold text-sm transition-all shadow-lg shadow-blue-900/20"
                    >
                        Tap to Start
                    </button>
                </div>
            )}

            {/* Scanning Animation */}
            {loading && (
                 <div className="absolute inset-0 pointer-events-none z-10">
                    <div className="w-full h-1 bg-blue-400 shadow-[0_0_20px_rgba(59,130,246,1)] animate-scan-move absolute top-0"></div>
                 </div>
            )}
            
            <canvas ref={canvasRef} className="hidden" />
        </div>

        {/* 3. CONTROL BUTTONS */}
        <div className="flex gap-3">
            <button 
                onClick={startCamera} 
                className="p-4 bg-slate-900 hover:bg-slate-800 rounded-2xl border border-slate-800 text-slate-400 transition-colors"
                title="Restart Camera"
            >
                <RefreshCw size={20} />
            </button>
            
            <button 
                onClick={handleScan} 
                disabled={loading || !isCameraOpen}
                className="flex-1 bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold py-4 rounded-2xl flex items-center justify-center gap-2 shadow-xl transition-all active:scale-[0.98]"
            >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Camera size={20} />}
                <span>{loading ? "Analyzing..." : "Identify Product"}</span>
            </button>
        </div>

        {/* 4. RESULTS SECTION (Vertical Flow) */}
        {report && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-lg">
                    <div className="flex items-center gap-2 mb-4 text-blue-400">
                        <Sparkles size={16} />
                        <h3 className="font-bold text-sm uppercase tracking-wide">Analysis Result</h3>
                    </div>
                    
                    <div className="text-slate-300 text-sm leading-relaxed whitespace-pre-wrap font-mono bg-black/20 p-4 rounded-xl border border-slate-800/50">
                        {report}
                    </div>

                    <div className="mt-4 pt-4 border-t border-slate-800 flex gap-3">
                        <button 
                            onClick={() => setReport("")}
                            className="flex-1 py-3 rounded-xl border border-slate-700 text-slate-400 text-sm font-semibold hover:bg-slate-800 transition-colors"
                        >
                            Discard
                        </button>
                        <button 
                            onClick={() => alert("Saved!")}
                            className="flex-1 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-bold shadow-lg shadow-emerald-900/20 transition-colors"
                        >
                            Confirm & Save
                        </button>
                    </div>
                </div>
            </div>
        )}

      </div>
    </div>
  );
}