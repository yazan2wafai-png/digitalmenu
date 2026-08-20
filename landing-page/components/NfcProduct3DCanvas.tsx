"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RotateCw, MousePointerClick, Smartphone, Info } from "lucide-react";

export default function NfcProduct3DCanvas() {
  const [activeTab, setActiveTab] = useState<"stand" | "card" | "sticker">("stand");
  const [rotationX, setRotationX] = useState(0);
  const [rotationY, setRotationY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [autoRotate, setAutoRotate] = useState(true);

  // Auto-rotation effect
  useEffect(() => {
    let animationFrame: number;
    if (autoRotate && !isDragging) {
      const animate = () => {
        setRotationY((prev) => (prev + 0.5) % 360);
        animationFrame = requestAnimationFrame(animate);
      };
      animationFrame = requestAnimationFrame(animate);
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [autoRotate, isDragging]);

  const handleDragStart = () => {
    setIsDragging(true);
    setAutoRotate(false);
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  const handleDrag = (e: React.MouseEvent | React.TouchEvent, info: any) => {
    if (isDragging) {
      setRotationY((prev) => prev + info.delta.x * 0.5);
      setRotationX((prev) => Math.max(-45, Math.min(45, prev - info.delta.y * 0.5)));
    }
  };

  const products = {
    stand: {
      name: "Table Acrylic Stand",
      description: "Premium acrylic with wooden base. Perfect for restaurant tables.",
      render: () => (
        <div className="relative w-48 h-64 mx-auto preserve-3d" style={{ transformStyle: "preserve-3d" }}>
          {/* Base */}
          <div 
            className="absolute bottom-0 w-56 h-8 -left-4 bg-amber-800 rounded-sm border-2 border-amber-900 shadow-xl"
            style={{ transform: "translateZ(20px) rotateX(90deg)", transformOrigin: "bottom" }}
          >
             <div className="w-full h-full bg-amber-700 opacity-80" />
          </div>
          
          {/* Acrylic front */}
          <div 
            className="absolute inset-0 bg-white/20 backdrop-blur-md rounded-t-lg border-2 border-white/50 flex flex-col items-center justify-center p-4 shadow-[0_0_20px_rgba(255,255,255,0.3)]"
            style={{ transform: "translateZ(10px)", backfaceVisibility: "hidden" }}
          >
            <Smartphone className="w-12 h-12 text-white mb-4" />
            <div className="w-24 h-24 bg-white rounded-lg flex items-center justify-center mb-4">
              <span className="font-bold text-gray-800 text-sm text-center">SCAN OR TAP</span>
            </div>
            <p className="text-white text-center font-semibold text-lg">View Menu</p>
          </div>

          {/* Acrylic back */}
          <div 
            className="absolute inset-0 bg-white/10 backdrop-blur-md rounded-t-lg border-2 border-white/30 flex flex-col items-center justify-center p-4"
            style={{ transform: "translateZ(-10px) rotateY(180deg)", backfaceVisibility: "hidden" }}
          >
            <p className="text-white/70 text-center font-medium">NFCMyPlace</p>
          </div>
        </div>
      )
    },
    card: {
      name: "Google Review Card",
      description: "Matte black with gold foil text. Tap-to-review instantly.",
      render: () => (
        <div className="relative w-72 h-44 mx-auto preserve-3d" style={{ transformStyle: "preserve-3d" }}>
          {/* Front */}
          <div 
            className="absolute inset-0 bg-zinc-900 rounded-xl border border-zinc-700 shadow-2xl flex flex-col items-center justify-between p-6 overflow-hidden"
            style={{ transform: "translateZ(2px)", backfaceVisibility: "hidden" }}
          >
            {/* Gold accent line */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-yellow-600 via-yellow-400 to-yellow-600" />
            
            <div className="flex items-center w-full justify-between">
              <div className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-600 to-yellow-400 font-serif font-bold text-xl tracking-wider">
                REVIEW US
              </div>
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-yellow-400 to-yellow-600 flex items-center justify-center text-zinc-900 font-bold">
                G
              </div>
            </div>

            <div className="flex items-center justify-center space-x-2">
              <MousePointerClick className="w-6 h-6 text-yellow-500" />
              <span className="text-white font-light tracking-widest text-sm">TAP TO RATE</span>
            </div>
          </div>

          {/* Back */}
          <div 
            className="absolute inset-0 bg-zinc-900 rounded-xl border border-zinc-700 flex flex-col items-center justify-center p-6"
            style={{ transform: "translateZ(-2px) rotateY(180deg)", backfaceVisibility: "hidden" }}
          >
             <div className="w-20 h-20 bg-white p-1 rounded-sm mb-4">
                <div className="w-full h-full border-4 border-dashed border-zinc-800 flex items-center justify-center">
                  <span className="text-xs font-bold text-zinc-800">QR</span>
                </div>
             </div>
             <p className="text-zinc-500 text-xs">Powered by NFCMyPlace</p>
          </div>
        </div>
      )
    },
    sticker: {
      name: "Waterproof Table Sticker",
      description: "Ultra-durable, waterproof adhesive. Blends with any surface.",
      render: () => (
        <div className="relative w-48 h-48 mx-auto preserve-3d rounded-full" style={{ transformStyle: "preserve-3d" }}>
           {/* Front */}
           <div 
            className="absolute inset-0 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full shadow-lg flex flex-col items-center justify-center p-6 border-4 border-white"
            style={{ transform: "translateZ(1px)", backfaceVisibility: "hidden" }}
          >
            <div className="absolute inset-0 rounded-full border-2 border-white/20 m-2" />
            <Smartphone className="w-10 h-10 text-white mb-2" />
            <p className="text-white font-bold text-lg text-center leading-tight">TAP FOR<br/>MENU</p>
          </div>
           {/* Back (Adhesive side) */}
           <div 
            className="absolute inset-0 bg-zinc-200 rounded-full flex items-center justify-center"
            style={{ transform: "translateZ(-1px) rotateY(180deg)", backfaceVisibility: "hidden" }}
          >
            <p className="text-zinc-400 font-bold transform -rotate-45 text-xl opacity-50">3M ADHESIVE</p>
          </div>
        </div>
      )
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-4 md:p-8">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-400 mb-4">
          Interactive Product Viewer
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Experience our NFC-enabled products in 3D. Drag to rotate and explore every angle.
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-8 items-center justify-center bg-gray-50 dark:bg-zinc-900/50 p-8 rounded-3xl border border-gray-200 dark:border-zinc-800">
        
        {/* Controls / Tabs */}
        <div className="w-full lg:w-1/3 flex flex-col gap-4">
          {(Object.keys(products) as Array<keyof typeof products>).map((key) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className={`text-left p-4 rounded-xl transition-all duration-300 relative overflow-hidden ${
                activeTab === key 
                  ? "bg-white dark:bg-zinc-800 shadow-md border-blue-500 border" 
                  : "bg-transparent hover:bg-gray-100 dark:hover:bg-zinc-800/50 border border-transparent"
              }`}
            >
              <h3 className={`font-semibold text-lg ${activeTab === key ? "text-blue-600 dark:text-blue-400" : "text-gray-700 dark:text-gray-200"}`}>
                {products[key].name}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                {products[key].description}
              </p>
            </button>
          ))}
          
          <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl flex items-start gap-3">
            <Info className="w-5 h-5 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800 dark:text-blue-300">
              All products include pre-programmed NFC chips. Simply tap with any modern smartphone to trigger the action.
            </p>
          </div>
        </div>

        {/* 3D Canvas Area */}
        <div className="w-full lg:w-2/3 h-[500px] relative perspective-1000">
          
          <div className="absolute top-4 right-4 z-10 flex gap-2">
            <button 
              onClick={() => setAutoRotate(!autoRotate)}
              className={`p-2 rounded-full backdrop-blur-md border ${
                autoRotate 
                  ? "bg-blue-500/10 border-blue-500 text-blue-500" 
                  : "bg-gray-500/10 border-gray-500 text-gray-500"
              }`}
              title="Toggle Auto-Rotate"
            >
              <RotateCw className={`w-5 h-5 ${autoRotate ? "animate-spin-slow" : ""}`} style={{ animationDuration: '3s' }} />
            </button>
          </div>

          <motion.div 
            className="w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing touch-none"
            drag
            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
            dragElastic={0}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
            onDrag={handleDrag}
            style={{ perspective: 1000 }}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, scale: 0.8, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.8, y: -20 }}
                transition={{ duration: 0.5 }}
                className="relative preserve-3d"
                style={{ 
                  transformStyle: "preserve-3d",
                  transform: `rotateX(${rotationX}deg) rotateY(${rotationY}deg)`
                }}
              >
                {/* Floating animation wrapper */}
                <motion.div
                  animate={{ y: [-10, 10, -10] }}
                  transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                  className="preserve-3d"
                  style={{ transformStyle: "preserve-3d" }}
                >
                  {products[activeTab].render()}
                </motion.div>
                
                {/* Shadow */}
                <div 
                  className="absolute -bottom-24 left-1/2 -translate-x-1/2 w-48 h-8 bg-black/10 dark:bg-black/40 rounded-full blur-xl"
                  style={{ transform: "rotateX(90deg) translateZ(-50px)" }}
                />
              </motion.div>
            </AnimatePresence>
          </motion.div>
          
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-sm text-gray-400 flex items-center gap-2 pointer-events-none">
            <MousePointerClick className="w-4 h-4" />
            Drag to rotate
          </div>
        </div>
      </div>
    </div>
  );
}
