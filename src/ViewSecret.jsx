import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, deleteDoc } from "firebase/firestore";
import { db } from "./firebase";
import { decryptMessage } from "./utils";
import { motion } from "framer-motion";
import { AlertTriangle, Eye, EyeOff, Trash2, ShieldAlert } from "lucide-react";

const ViewSecret = () => {
  const { id } = useParams(); // URL se ID nikalta hai
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(10); // 10 second ka timer reading ke liye

  useEffect(() => {
    const fetchSecret = async () => {
      try {
        // 1. Database se data dhundo
        const docRef = doc(db, "secrets", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // 2. Agar mil gaya, to decrypt karo
          const encryptedContent = docSnap.data().content;
          const decrypted = decryptMessage(encryptedContent);
          setMessage(decrypted);
          
          // 3. TURANT DELETE KARO (Burn on Read)
          await deleteDoc(docRef);
        } else {
          setError("This message has already self-destructed or never existed.");
        }
      } catch (err) {
        setError("Error connecting to the secure server.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSecret();
  }, [id]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-[#050505] text-white font-['JetBrains_Mono'] relative overflow-hidden">
      
      {/* Background Effects */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)] bg-[size:14px_24px] opacity-20" />
      <div className="absolute top-[-20%] right-[-10%] w-[500px] h-[500px] bg-red-500/10 rounded-full blur-[128px]" />

      <div className="max-w-md w-full relative z-10">
        
        {loading ? (
          // LOADING STATE
          <div className="text-center space-y-4">
            <div className="w-16 h-16 border-4 border-red-500/30 border-t-red-500 rounded-full animate-spin mx-auto" />
            <p className="text-red-500 animate-pulse tracking-widest uppercase text-xs">Decrypting Secure Data...</p>
          </div>
        ) : error ? (
          // ERROR STATE (Agar link expire ho gaya)
          <motion.div 
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-zinc-900/50 border border-red-500/20 p-8 rounded-2xl text-center backdrop-blur-xl"
          >
            <div className="bg-red-500/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
              <Trash2 className="text-red-500 w-10 h-10" />
            </div>
            <h2 className="text-2xl font-bold text-red-500 mb-2">Link Expired</h2>
            <p className="text-zinc-400 text-sm mb-6">
              This secret has been wiped from our servers forever.
            </p>
            <a href="/" className="inline-flex items-center gap-2 text-white bg-zinc-800 hover:bg-zinc-700 px-6 py-3 rounded-xl transition-all text-sm font-bold uppercase tracking-wider">
              <ShieldAlert size={16} /> Create New Secret
            </a>
          </motion.div>
        ) : (
          // SUCCESS STATE (Message Dikhao)
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="space-y-6"
          >
            <div className="text-center mb-8">
              <div className="inline-flex items-center gap-2 bg-red-500/10 text-red-500 px-4 py-2 rounded-full border border-red-500/20 mb-4 animate-pulse">
                <AlertTriangle size={16} />
                <span className="text-xs font-bold tracking-widest uppercase">Self-Destruct Triggered</span>
              </div>
              <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-white to-zinc-500">
                Secret Message
              </h1>
            </div>

            <div className="bg-zinc-900 border border-red-500/30 rounded-2xl p-6 relative overflow-hidden group">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-600 to-transparent" />
              
              <div className="flex justify-between items-center mb-4 border-b border-zinc-800 pb-4">
                <span className="text-xs text-zinc-500 uppercase tracking-wider flex items-center gap-2">
                  <Eye size={14} /> Decrypted Content
                </span>
                <span className="text-xs text-red-500 font-mono">
                   Data Wiped from DB
                </span>
              </div>

              <div className="font-mono text-lg text-white leading-relaxed break-words">
                {message}
              </div>
            </div>

            <div className="text-center">
              <p className="text-zinc-600 text-[10px] uppercase tracking-widest">
                Do not refresh. This message is gone forever.
              </p>
              <a href="/" className="mt-8 inline-block text-zinc-500 hover:text-white text-sm transition-colors border-b border-transparent hover:border-zinc-500 pb-1">
                Send your own secret →
              </a>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ViewSecret;