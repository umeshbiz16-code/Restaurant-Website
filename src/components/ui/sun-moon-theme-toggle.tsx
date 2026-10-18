'use client';

import * as React from 'react';
import { useTheme } from '@/context/ThemeContext';

export interface SunMoonThemeToggleProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  size?: number;
  duration?: number;
  sky?: boolean;
}

export const SunMoonThemeToggle = React.forwardRef<HTMLButtonElement, SunMoonThemeToggleProps>(
  ({ size = 36, duration = 1200, sky = true, className = '', onClick, ...props }, ref) => {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    // Width proportional to size for smooth pill track
    const width = Math.round(size * 1.85);
    const height = size;
    const knobSize = Math.round(size * 0.78);
    const padding = Math.round((height - knobSize) / 2);
    const translateX = width - knobSize - padding * 2;

    const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
      toggleTheme();
      if (onClick) onClick(e);
    };

    return (
      <button
        ref={ref}
        type="button"
        role="switch"
        aria-checked={isDark}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        onClick={handleClick}
        style={{
          width: `${width}px`,
          height: `${height}px`,
          padding: `${padding}px`,
          transitionDuration: `${Math.min(duration, 500)}ms`,
        }}
        className={`relative inline-flex items-center rounded-full overflow-hidden cursor-pointer select-none border transition-all shadow-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 shrink-0 ${
          isDark
            ? 'bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border-indigo-800/80'
            : 'bg-gradient-to-r from-sky-400 via-sky-300 to-amber-200 border-sky-300'
        } ${className}`}
        {...props}
      >
        {/* Sky Background Elements (Stars at night, clouds during day) */}
        {sky && (
          <div className="absolute inset-0 pointer-events-none overflow-hidden transition-opacity duration-500">
            {isDark ? (
              /* Twinkling Night Stars */
              <div className="absolute inset-0 flex items-center justify-between px-2 text-amber-200/80 animate-fade-in">
                <span className="text-[9px] animate-pulse">✦</span>
                <span className="text-[6px] opacity-70 ml-1">★</span>
                <span className="text-[7px] opacity-90 mr-2">✧</span>
              </div>
            ) : (
              /* Soft Day Clouds */
              <div className="absolute inset-0 flex items-center justify-end pr-2 text-white/90 animate-fade-in">
                <div className="flex space-x-0.5">
                  <span className="inline-block h-2 w-2 rounded-full bg-white/70" />
                  <span className="inline-block h-3 w-3 rounded-full bg-white/90 -mt-0.5" />
                  <span className="inline-block h-2 w-2.5 rounded-full bg-white/75" />
                </div>
              </div>
            )}
          </div>
        )}

        {/* The Moving Celestial Knob (Sun / Moon) */}
        <div
          style={{
            width: `${knobSize}px`,
            height: `${knobSize}px`,
            transform: `translateX(${isDark ? translateX : 0}px) rotate(${isDark ? 360 : 0}deg)`,
            transitionDuration: `${Math.min(duration, 500)}ms`,
          }}
          className={`relative z-10 flex items-center justify-center rounded-full shadow-md transition-all ease-[cubic-bezier(0.34,1.56,0.64,1)] ${
            isDark
              ? 'bg-gradient-to-br from-amber-100 to-amber-200 text-slate-900 shadow-indigo-950/60'
              : 'bg-gradient-to-br from-amber-400 to-orange-500 text-amber-950 shadow-amber-600/40'
          }`}
        >
          {isDark ? (
            /* Crescent Moon with craters */
            <svg
              className="h-3.5 w-3.5 text-slate-800 transition-transform duration-300 transform scale-95"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />
            </svg>
          ) : (
            /* Golden Glowing Sun */
            <svg
              className="h-4 w-4 text-white transition-transform duration-300 transform scale-100 animate-spin-slow"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="4" fill="currentColor" />
              <path d="M12 2v2" />
              <path d="M12 20v2" />
              <path d="M4.93 4.93l1.41 1.41" />
              <path d="M17.66 17.66l1.41 1.41" />
              <path d="M2 12h2" />
              <path d="M20 12h2" />
              <path d="M6.34 17.66l-1.41 1.41" />
              <path d="M19.07 4.93l-1.41 1.41" />
            </svg>
          )}
        </div>
      </button>
    );
  }
);

SunMoonThemeToggle.displayName = 'SunMoonThemeToggle';
export default SunMoonThemeToggle;
