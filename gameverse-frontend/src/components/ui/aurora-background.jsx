import { cn } from "../../lib/utils";
import React from "react";

export const AuroraBackground = ({
  className,
  children,
  showRadialGradient = true,
  ...props
}) => {
  return (
    <div
      className={cn(
        "relative min-h-screen flex flex-col bg-zinc-50 dark:bg-[#040d1a] text-slate-950 dark:text-white transition-bg",
        className
      )}
      {...props}
    >
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div
          className={cn(
            "absolute -inset-[10px] opacity-30 will-change-transform filter blur-[10px] invert dark:invert-0 pointer-events-none",
            "after:content-[''] after:absolute after:inset-0 after:animate-aurora after:[background-attachment:fixed] after:mix-blend-difference"
          )}
          style={{
            "--white-gradient": "repeating-linear-gradient(100deg, #fff 0%, #fff 7%, transparent 10%, transparent 12%, #fff 16%)",
            "--dark-gradient": "repeating-linear-gradient(100deg, #040d1a 0%, #040d1a 7%, transparent 10%, transparent 12%, #040d1a 16%)",
            "--aurora": "repeating-linear-gradient(100deg, #3b82f6 10%, #a5b4fc 15%, #93c5fd 20%, #ddd6fe 25%, #60a5fa 30%)",
            backgroundImage: "var(--dark-gradient), var(--aurora)",
            backgroundSize: "300% 200%",
            backgroundPosition: "50% 50%, 50% 50%",
            maskImage: showRadialGradient ? "radial-gradient(ellipse at 100% 0%, black 10%, transparent 70%)" : undefined,
            WebkitMaskImage: showRadialGradient ? "radial-gradient(ellipse at 100% 0%, black 10%, transparent 70%)" : undefined,
          }}
        >
          {/* We need an inner div for the 'after' pseudo element styles since we can't do inline styles for pseudo elements easily, but wait, the original used after: classes. Let's just keep the after classes in Tailwind, but they rely on the same variables! */}
          <style>
            {`
              .dark .pointer-events-none::after {
                background-image: var(--dark-gradient), var(--aurora);
                background-size: 200% 100%;
              }
              .pointer-events-none::after {
                background-image: var(--white-gradient), var(--aurora);
                background-size: 200% 100%;
              }
            `}
          </style>
        </div>
      </div>
      <div className="relative z-10 flex flex-col flex-1 min-h-0">{children}</div>
    </div>
  );
};
