
import React from 'react';
import type { AvatarStyle } from '../types';

interface AIAvatarProps {
  isSpeaking: boolean;
  style: AvatarStyle;
  color: string;
  hasGlasses: boolean;
  imageUrl?: string;
  className?: string;
}

const RobotAvatar: React.FC<Pick<AIAvatarProps, 'isSpeaking' | 'color' | 'hasGlasses'>> = ({ isSpeaking, color, hasGlasses }) => {
    return (
      <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
        <defs>
           <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                <feGaussianBlur stdDeviation="3.5" result="coloredBlur"/>
                <feMerge>
                    <feMergeNode in="coloredBlur"/>
                    <feMergeNode in="SourceGraphic"/>
                </feMerge>
            </filter>
        </defs>
        <rect x="15" y="20" width="70" height="60" rx="15" fill={color} className={isSpeaking ? 'speaking-body' : undefined} />
        <line x1="50" y1="20" x2="50" y2="10" stroke="#9ca3af" strokeWidth="2" />
        <circle cx="50" cy="8" r="4" fill={color} filter={isSpeaking ? "url(#glow)" : "none"} />
        <g>
            <circle cx="35" cy="45" r="8" fill="white" />
            <circle cx="35" cy="45" r="4" fill="#1e293b" />
        </g>
        <g>
            <circle cx="65" cy="45" r="8" fill="white" />
            <circle cx="65" cy="45" r="4" fill="#1e293b" />
        </g>
        {hasGlasses && (
             <g stroke="#1e293b" strokeWidth="2.5" fill="none">
                <circle cx="35" cy="45" r="10" />
                <circle cx="65" cy="45" r="10" />
                <line x1="45" y1="45" x2="55" y2="45" />
            </g>
        )}
        <rect 
            x="40" 
            y="65" 
            width="20" 
            height="5" 
            rx="2.5" 
            fill="#1e293b" 
            className={isSpeaking ? 'talking-mouth' : undefined}
        />
      </svg>
    );
}

const BlobAvatar: React.FC<Pick<AIAvatarProps, 'isSpeaking' | 'color' | 'hasGlasses'>> = ({ isSpeaking, color, hasGlasses }) => {
    return (
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <path d="M 92.6,65.6 C 92.6,83.2 75.9,93.5 56.4,93.5 37,93.5 21.9,82.2 21.9,65.6 21.9,48.9 33.1,20.8 52.6,20.8 72,20.8 92.6,48.9 92.6,65.6 Z" fill={color} transform="rotate(-15, 50, 50)" className={isSpeaking ? 'speaking-body' : undefined} />
            <g>
                <circle cx="45" cy="50" r="6" fill="white" />
                <circle cx="45" cy="50" r="3" fill="#1e293b" />
            </g>
             <g>
                <circle cx="65" cy="50" r="6" fill="white" />
                <circle cx="65" cy="50" r="3" fill="#1e293b" />
            </g>
             {hasGlasses && (
                <g stroke="#1e293b" strokeWidth="2" fill="none">
                    <circle cx="45" cy="50" r="8" />
                    <circle cx="65" cy="50" r="8" />
                    <line x1="53" y1="50" x2="57" y2="50" />
                </g>
            )}
            <ellipse cx="55" cy="68" rx="8" ry="2" fill="#1e293b" className={isSpeaking ? 'talking-mouth' : undefined} />
        </svg>
    );
}

const AlienAvatar: React.FC<Pick<AIAvatarProps, 'isSpeaking' | 'color' | 'hasGlasses'>> = ({ isSpeaking, color, hasGlasses }) => {
    return (
        <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
             <defs>
                <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
                    <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
                    <feMerge>
                        <feMergeNode in="coloredBlur"/>
                        <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                </filter>
            </defs>
            <path d="M 50,10 C 25,10 10,40 10,60 C 10,80 25,95 50,95 C 75,95 90,80 90,60 C 90,40 75,10 50,10 Z" fill={color} className={isSpeaking ? 'speaking-body' : undefined} />
            <path d="M 30,55 Q 50,70 70,55 Q 50,40 30,55 Z" fill="white" />
            <circle cx="50" cy="57" r="8" fill="#1e293b" />
            {hasGlasses && (
                <path d="M 25,55 Q 50,75 75,55" stroke="#1e293b" strokeWidth="2.5" fill="none" />
            )}
            <rect x="45" y="75" width="10" height="3" rx="1.5" fill="#1e293b" className={isSpeaking ? 'talking-mouth' : undefined} />
        </svg>
    );
}

export const AIAvatar: React.FC<AIAvatarProps> = ({ isSpeaking, style, color, hasGlasses, imageUrl, className = '' }) => {

  const renderContent = () => {
    if (style === 'photo' && imageUrl) {
      return (
        <div 
          className={`w-full h-full rounded-full overflow-hidden border-4 box-border shadow-lg transition-all duration-200 ${isSpeaking ? 'animate-pulse' : ''}`}
          style={{ borderColor: isSpeaking ? color : 'transparent' }}
        >
          <img src={imageUrl} alt="Teacher's avatar" className="w-full h-full object-cover" />
        </div>
      );
    }

    const props = { isSpeaking, color, hasGlasses };
    switch (style) {
      case 'blob': return <BlobAvatar {...props} />;
      case 'alien': return <AlienAvatar {...props} />;
      case 'robot':
      default:
        return <RobotAvatar {...props} />;
    }
  };

  return (
    <div 
        className={className}
        aria-label="AI Avatar"
        role="figure"
    >
      {renderContent()}
    </div>
  );
};