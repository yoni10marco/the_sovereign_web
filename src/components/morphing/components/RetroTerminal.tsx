"use client";
import { useEffect, useRef, useState } from "react";
import type { RetroTerminalProps } from "@/lib/morphing/config-schema";

export function RetroTerminal({ title = "TERMINAL", lines, prompt_symbol = "$", typing_speed = "normal" }: RetroTerminalProps) {
  const [visibleLines, setVisibleLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const containerRef = useRef<HTMLDivElement>(null);

  const charDelay = typing_speed === "fast" ? 20 : typing_speed === "slow" ? 80 : 40;

  useEffect(() => {
    const interval = setInterval(() => setShowCursor((c) => !c), 530);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (!lines || currentLine >= lines.length) return;
    const line = lines[currentLine];
    if (currentChar < line.length) {
      const t = setTimeout(() => {
        setCurrentChar((c) => c + 1);
      }, charDelay);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setVisibleLines((prev) => [...prev, line]);
        setCurrentLine((l) => l + 1);
        setCurrentChar(0);
        if (containerRef.current) containerRef.current.scrollTop = containerRef.current.scrollHeight;
      }, 200);
      return () => clearTimeout(t);
    }
  }, [lines, currentLine, currentChar, charDelay]);

  const allDone = currentLine >= (lines?.length ?? 0);

  return (
    <section className="px-4 sm:px-8 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-2 rounded-t-lg" style={{ backgroundColor: "#1a1a1a" }}>
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="w-3 h-3 rounded-full bg-yellow-400" />
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-4 text-xs text-gray-400 font-mono">{title}</span>
        </div>
        {/* Terminal body */}
        <div
          ref={containerRef}
          className="p-6 rounded-b-lg font-mono text-sm overflow-y-auto"
          style={{ backgroundColor: "#0d0d0d", color: "#00ff41", minHeight: 280, maxHeight: 420 }}
        >
          {visibleLines.map((line, i) => (
            <div key={i} className="mb-1">
              <span style={{ color: "#00ff41", opacity: 0.6 }}>{prompt_symbol} </span>
              <span>{line}</span>
            </div>
          ))}
          {!allDone && lines && (
            <div className="mb-1">
              <span style={{ color: "#00ff41", opacity: 0.6 }}>{prompt_symbol} </span>
              <span>{lines[currentLine].slice(0, currentChar)}</span>
              <span style={{ opacity: showCursor ? 1 : 0 }}>▋</span>
            </div>
          )}
          {allDone && (
            <div className="mt-2">
              <span style={{ color: "#00ff41", opacity: 0.6 }}>{prompt_symbol} </span>
              <span style={{ opacity: showCursor ? 1 : 0 }}>▋</span>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
