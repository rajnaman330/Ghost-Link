import React, { useState } from "react";
import { db } from "./firebase";
import { collection, addDoc } from "firebase/firestore";
import { encryptMessage } from "./utils"; 
import { Ghost, Lock, Copy, Check, Zap, Shield, Terminal } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

function Home() {
  const [text, setText] = useState("");
  const [link, setLink] = useState("");
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const generateLink = async () => {
    if (!text) return;
    setLoading(true);

    try {
      // 1. Message Encrypt karo
      const encrypted = encryptMessage(text);
      
      // 2. Firebase Database mein save karo
      const docRef = await addDoc(collection(db, "secrets"), {
        content: encrypted,
        createdAt: Date.now(),
      });

      // 3. Asli ID wala link banao
      setLink(`${window.location.origin}/view/${docRef.id}`);
      
    } catch (error) {
      console.error("Error adding document: ", error);
      alert("Failed to create link. Check console.");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#050505] text-white font-['JetBrains_Mono'] overflow-hidden relative">
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]" />
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-green-500/10 rounded-full blur-[128px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 rounded-full blur-[128px]" />

      <div className="max-w-xl w-full relative z-10">
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <div className="inline-block relative">
            <div className="bg-zinc-900/80 p-4 rounded-2xl border border-green-500/20 shadow-[0_0_30px_rgba(0,255,157,0.1)] mb-4 inline-flex">
              <Ghost className="text-[#00ff9d] w-10 h-10" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold tracking-tighter mb-2 bg-clip-text text-transparent bg-gradient-to-r from-white via-zinc-400 to-zinc-600">
            GHOST_LINK<span className="text-[#00ff9d] animate-pulse">_</span>
          </h1>
          <p className="text-zinc-500 text-xs md:text-sm tracking-[0.2em] uppercase flex items-center justify-center gap-2">
            <Shield size={12} /> Encrypted • Anonymous • Ephemeral
          </p>
        </motion.div>

        {/* Main Card */}
        <div className="bg-[#0a0a0a]/80 backdrop-blur-xl border border-zinc-800 p-1 rounded-3xl shadow-2xl relative group">
           <div className="absolute -inset-0.5 bg-gradient-to-r from-green-500/20 to-purple-500/20 rounded-3xl blur opacity-30 group-hover:opacity-60 transition duration-1000"></div>

          <div className="bg-[#0c0c0c] rounded-[20px] p-6 relative">
            <AnimatePresence mode="wait">
              {!link ? (
                // Input Section
                <motion.div 
                  key="input"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-6"
                >
                  <div className="relative group/input">
                    <textarea
                      className="w-full h-48 bg-zinc-900/30 border border-zinc-800 rounded-xl p-5 text-zinc-300 placeholder-zinc-700 focus:outline-none focus:border-[#00ff9d]/50 focus:bg-zinc-900/50 transition-all resize-none font-mono text-sm leading-relaxed"
                      placeholder="// Enter your sensitive data here..."
                      onChange={(e) => setText(e.target.value)}
                      value={text}
                    />
                    <div className="absolute bottom-4 right-4 flex items-center gap-2 text-[10px] text-zinc-600 font-bold uppercase tracking-wider">
                      <Terminal size={10} /> AES-256 Active
                    </div>
                  </div>

                  <button
                    onClick={generateLink}
                    disabled={!text || loading}
                    className={`w-full py-4 rounded-xl font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-3 transition-all ${
                      !text || loading
                        ? "bg-zinc-900 text-zinc-600 cursor-not-allowed border border-zinc-800"
                        : "bg-[#00ff9d] text-black shadow-[0_0_20px_rgba(0,255,157,0.4)] hover:shadow-[0_0_30px_rgba(0,255,157,0.6)]"
                    }`}
                  >
                    {loading ? "Encrypting..." : <><Lock size={16} /> Generate Ghost Link</>}
                  </button>
                </motion.div>
              ) : (
                // Result Section
                <motion.div 
                  key="result"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-6 py-4"
                >
                  <div className="text-center space-y-2">
                    <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4 border border-green-500/20">
                      <Check className="text-[#00ff9d] w-8 h-8" />
                    </div>
                    <h3 className="text-xl font-bold text-white">Encryption Complete</h3>
                    <p className="text-zinc-500 text-xs">Link is ready. It will self-destruct after 1 view.</p>
                  </div>

                  <div className="p-4 bg-zinc-950 border border-zinc-800 rounded-xl flex items-center justify-between gap-3 overflow-hidden">
                    <code className="text-[#00ff9d] text-xs md:text-sm font-mono truncate w-full">
                      {link}
                    </code>
                  </div>

                  <div className="flex gap-3">
                    <button
                      onClick={copyToClipboard}
                      className="flex-1 bg-white text-black font-bold py-4 rounded-xl hover:bg-zinc-200 transition-all flex items-center justify-center gap-2 text-sm uppercase tracking-wider"
                    >
                      {copied ? <Check size={16} /> : <Copy size={16} />}
                      {copied ? "Copied!" : "Copy Link"}
                    </button>
                    
                    <button 
                      onClick={() => { setLink(""); setText(""); }}
                      className="px-4 bg-zinc-900 border border-zinc-800 rounded-xl text-zinc-400 hover:text-white transition-colors"
                    >
                      <Zap size={20} />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Home;