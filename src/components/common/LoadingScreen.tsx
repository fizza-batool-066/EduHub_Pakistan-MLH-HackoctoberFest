"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { GraduationCap } from "lucide-react";

const TAGLINE = "Connecting Students with the Right Education";

export function LoadingScreen({ onDone }: { onDone: () => void }) {
  const [progress, setProgress] = useState(0);
  const [show, setShow] = useState(true);

  useEffect(() => {
    const start = Date.now();
    const duration = 2400; // ~2.5s
    let raf: number;

    const tick = () => {
      const elapsed = Date.now() - start;
      const pct = Math.min(100, (elapsed / duration) * 100);
      setProgress(pct);
      if (pct < 100) {
        raf = requestAnimationFrame(tick);
      } else {
        // Fade out then call onDone
        setTimeout(() => {
          setShow(false);
          setTimeout(onDone, 400); // wait for fade out
        }, 150);
      }
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [onDone]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeInOut" }}
          className="fixed inset-0 z-[100] flex flex-col items-center justify-center"
          style={{
            background:
              "linear-gradient(135deg, #0B1120 0%, #1E293B 50%, #064E3B 100%)",
          }}
        >
          {/* Animated background blobs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <motion.div
              animate={{
                x: [0, 100, 0],
                y: [0, -50, 0],
                scale: [1, 1.2, 1],
              }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full blur-3xl"
              style={{ background: "rgba(37, 99, 235, 0.3)" }}
            />
            <motion.div
              animate={{
                x: [0, -80, 0],
                y: [0, 80, 0],
                scale: [1.2, 1, 1.2],
              }}
              transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full blur-3xl"
              style={{ background: "rgba(16, 185, 129, 0.25)" }}
            />
          </div>

          {/* Centered content */}
          <div className="relative z-10 flex flex-col items-center px-6">
            {/* Animated logo */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              transition={{ type: "spring", stiffness: 120, damping: 12, delay: 0.1 }}
              className="relative mb-8"
            >
              {/* Glow ring */}
              <motion.div
                animate={{ scale: [1, 1.15, 1], opacity: [0.4, 0.7, 0.4] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                className="absolute inset-0 rounded-3xl blur-2xl"
                style={{ background: "linear-gradient(135deg, #2563EB, #10B981)" }}
              />
              {/* Logo box */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="relative h-20 w-20 sm:h-24 sm:w-24 rounded-3xl flex items-center justify-center shadow-2xl"
                style={{
                  background: "linear-gradient(135deg, #2563EB 0%, #1E40AF 100%)",
                }}
              >
                <GraduationCap className="h-10 w-10 sm:h-12 sm:w-12 text-white" />
                {/* Sparkle dots */}
                {[0, 1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute h-1.5 w-1.5 rounded-full bg-white"
                    style={{
                      top: i === 0 ? "8%" : i === 2 ? "92%" : "50%",
                      left: i === 1 ? "92%" : i === 3 ? "8%" : "50%",
                    }}
                    animate={{ opacity: [0, 1, 0], scale: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                  />
                ))}
              </motion.div>
            </motion.div>

            {/* Brand name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
              className="text-center mb-2"
            >
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-white">
                EduHub <span className="gradient-text">Pakistan</span>
              </h1>
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-sm sm:text-base text-slate-300 mb-10 text-center max-w-xs"
            >
              {TAGLINE}
            </motion.p>

            {/* Progress bar */}
            <div className="w-64 sm:w-80">
              <div className="relative h-1.5 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  className="absolute inset-y-0 left-0 rounded-full"
                  style={{
                    width: `${progress}%`,
                    background: "linear-gradient(90deg, #2563EB, #10B981)",
                  }}
                />
              </div>
              <div className="flex justify-between mt-2 text-[10px] text-slate-400 font-mono">
                <span>Loading</span>
                <span>{Math.round(progress)}%</span>
              </div>
            </div>

            {/* Loading dots */}
            <div className="flex gap-1.5 mt-6">
              {[0, 1, 2].map((i) => (
                <motion.div
                  key={i}
                  className="h-2 w-2 rounded-full bg-white/60"
                  animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
                  transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.2 }}
                />
              ))}
            </div>
          </div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1 }}
            className="absolute bottom-6 text-[10px] text-slate-500 font-mono"
          >
            © 2024 EduHub Pakistan · AI-Powered Education Discovery
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
