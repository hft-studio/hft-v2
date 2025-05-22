"use client"

export function Animations() {
  return (
    <style jsx global>{`
      @keyframes fadeIn {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }
    `}</style>
  );
} 