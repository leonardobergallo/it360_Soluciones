import React from 'react';

interface ModernLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export default function ModernLogo({ size = 'md', className = '' }: ModernLogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-20 h-20'
  };

  const textSizes = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  // Usar un ID fijo para evitar problemas de hidratación
  const gradientId = "logo-gradient-fixed";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {/* Logo SVG moderno */}
      <div className={`${sizeClasses[size]} relative`}>
        <svg
          viewBox="0 0 100 100"
          className="w-full h-full"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#06b6d4" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </linearGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge> 
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>
          
          {/* Fondo circular con gradiente */}
          <circle
            cx="50"
            cy="50"
            r="45"
            fill={`url(#${gradientId})`}
            className="drop-shadow-lg"
          />
          
          {/* Elementos del logo */}
          <g filter="url(#glow)">
            {/* Círculo central */}
            <circle
              cx="50"
              cy="50"
              r="15"
              fill="white"
              opacity="0.9"
            />
            
            {/* Líneas tecnológicas */}
            <path
              d="M25 30 L75 30 M25 70 L75 70 M30 25 L30 75 M70 25 L70 75"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.8"
            />
            
            {/* Puntos de conexión */}
            <circle cx="30" cy="30" r="2" fill="white" />
            <circle cx="70" cy="30" r="2" fill="white" />
            <circle cx="30" cy="70" r="2" fill="white" />
            <circle cx="70" cy="70" r="2" fill="white" />
            
            {/* Elemento central tecnológico */}
            <path
              d="M45 45 L55 45 L55 55 L45 55 Z"
              fill="white"
              opacity="0.7"
            />
            <circle
              cx="50"
              cy="50"
              r="3"
              fill={`url(#${gradientId})`}
            />
          </g>
        </svg>
        
        {/* Efecto de brillo */}
        <div className="absolute inset-0 bg-white/20 rounded-full blur-sm animate-pulse"></div>
      </div>

      {/* Texto del logo */}
      <div className="flex flex-col">
        <span className={`font-display font-bold tracking-tight ${textSizes[size]} bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 bg-clip-text text-transparent`}>
          IT360
        </span>
        <span className={`font-sans font-medium tracking-wide ${size === 'sm' ? 'text-xs' : 'text-sm'} text-slate-400`}>
          SOLUCIONES
        </span>
      </div>
    </div>
  );
}

// Variante minimalista
export function MinimalLogo({ size = 'md', className = '' }: { size?: 'sm' | 'md' | 'lg' | 'xl'; className?: string }) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
    xl: 'w-16 h-16'
  };

  return (
    <div className={`${sizeClasses[size]} relative ${className}`}>
      <svg
        viewBox="0 0 100 100"
        className="w-full h-full"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="minimal-gradient-fixed" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#06b6d4" />
            <stop offset="100%" stopColor="#8b5cf6" />
          </linearGradient>
        </defs>
        
        {/* Círculo con gradiente */}
        <circle
          cx="50"
          cy="50"
          r="40"
          fill="url(#minimal-gradient-fixed)"
          className="drop-shadow-lg"
        />
        
        {/* Elemento central minimalista */}
        <circle
          cx="50"
          cy="50"
          r="12"
          fill="white"
          opacity="0.9"
        />
        
        {/* Punto central */}
        <circle
          cx="50"
          cy="50"
          r="4"
          fill="url(#minimal-gradient-fixed)"
        />
      </svg>
    </div>
  );
} 
