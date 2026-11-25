import React from 'react';
import type { OrigamiShapeId } from '../types/foldwise';

interface OrigamiSVGProps {
  shape: OrigamiShapeId;
  className?: string;
  accent?: string;
  locked?: boolean;
  partial?: boolean;
  broken?: boolean;
}

export const OrigamiSVG: React.FC<OrigamiSVGProps> = ({
  shape,
  className = 'w-16 h-16',
  accent = '#D9534F',
  locked = false,
  partial = false,
  broken = false,
}) => {
  const fillPrimary = locked ? '#E8DFD0' : '#FAF7F0';
  const fillSecondary = locked ? '#DCD2C1' : accent;
  const stroke = locked ? '#9E9689' : '#252525';
  const strokeDash = partial ? '4 3' : undefined;

  return (
    <svg
      viewBox="0 0 120 120"
      className={`${className} transition-transform duration-500 ${broken ? 'rotate-[-6deg]' : ''}`}
      fill="none"
      aria-label={`Origami ${shape}`}
    >
      {shape === 'crane' && (
        <g stroke={stroke} strokeWidth="2" strokeLinejoin="round" strokeDasharray={strokeDash}>
          <polygon points="15,52 55,44 45,76" fill={fillPrimary} />
          <polygon points="55,44 88,20 70,58" fill={fillSecondary} fillOpacity="0.88" />
          <polygon points="45,76 70,58 98,64 62,88" fill="#E8DFD0" />
          <polygon points="88,20 105,28 92,34" fill={fillPrimary} />
          <polygon points="15,52 38,34 55,44" fill="#C5A46D" fillOpacity="0.65" />
          <line x1="55" y1="44" x2="62" y2="88" strokeOpacity="0.35" />
        </g>
      )}

      {shape === 'fox' && (
        <g stroke={stroke} strokeWidth="2" strokeLinejoin="round" strokeDasharray={strokeDash}>
          <polygon points="24,24 44,50 20,60" fill={fillSecondary} fillOpacity="0.9" />
          <polygon points="96,24 76,50 100,60" fill={fillSecondary} fillOpacity="0.9" />
          <polygon points="20,60 60,42 100,60 60,100" fill={fillPrimary} />
          <polygon points="44,50 60,42 76,50 60,72" fill="#E8DFD0" />
          <polygon points="54,92 66,92 60,102" fill="#252525" />
        </g>
      )}

      {shape === 'star' && (
        <g stroke={stroke} strokeWidth="2" strokeLinejoin="round" strokeDasharray={strokeDash}>
          <polygon points="60,12 72,44 106,44 78,64 88,98 60,78 32,98 42,64 14,44 48,44" fill={fillPrimary} />
          <polygon points="60,12 72,44 60,58" fill={fillSecondary} fillOpacity="0.75" />
          <polygon points="106,44 78,64 60,58" fill="#E8DFD0" />
          <polygon points="32,98 42,64 60,58" fill={fillSecondary} fillOpacity="0.55" />
          <line x1="60" y1="12" x2="60" y2="78" strokeOpacity="0.3" />
        </g>
      )}

      {shape === 'robot' && (
        <g stroke={stroke} strokeWidth="2" strokeLinejoin="round" strokeDasharray={strokeDash}>
          <polygon points="36,20 84,20 78,48 42,48" fill={fillPrimary} />
          <polygon points="32,52 88,52 82,92 38,92" fill={fillSecondary} fillOpacity="0.82" />
          <polygon points="18,56 32,52 32,78 20,82" fill="#E8DFD0" />
          <polygon points="88,52 102,56 100,82 88,78" fill="#E8DFD0" />
          <polygon points="42,92 56,92 52,108 40,108" fill={fillPrimary} />
          <polygon points="64,92 78,92 80,108 68,108" fill={fillPrimary} />
          <line x1="60" y1="10" x2="60" y2="20" />
        </g>
      )}

      {shape === 'aeroplane' && (
        <g stroke={stroke} strokeWidth="2" strokeLinejoin="round" strokeDasharray={strokeDash}>
          <polygon points="14,56 106,24 58,68" fill={fillPrimary} />
          <polygon points="106,24 72,96 58,68" fill={fillSecondary} fillOpacity="0.85" />
          <polygon points="58,68 48,88 72,72" fill="#E8DFD0" />
        </g>
      )}

      {shape === 'molecule' && (
        <g stroke={stroke} strokeWidth="2" strokeLinejoin="round" strokeDasharray={strokeDash}>
          <polygon points="60,18 92,38 92,78 60,98 28,78 28,38" fill={fillPrimary} />
          <polygon points="60,18 92,38 60,58 28,38" fill={fillSecondary} fillOpacity="0.65" />
          <polygon points="60,58 92,78 60,98" fill="#E8DFD0" />
          <line x1="60" y1="18" x2="60" y2="98" strokeOpacity="0.35" />
        </g>
      )}

      {shape === 'butterfly' && (
        <g stroke={stroke} strokeWidth="2" strokeLinejoin="round" strokeDasharray={strokeDash}>
          <polygon points="60,54 18,22 24,62 56,64" fill={fillSecondary} fillOpacity="0.82" />
          <polygon points="60,54 102,22 96,62 64,64" fill={fillSecondary} fillOpacity="0.82" />
          <polygon points="56,64 26,72 38,98 60,76" fill={fillPrimary} />
          <polygon points="64,64 94,72 82,98 60,76" fill={fillPrimary} />
          <line x1="60" y1="34" x2="60" y2="86" strokeWidth="2.5" />
        </g>
      )}

      {shape === 'pagoda' && (
        <g stroke={stroke} strokeWidth="2" strokeLinejoin="round" strokeDasharray={strokeDash}>
          <polygon points="60,14 42,32 78,32" fill={fillSecondary} fillOpacity="0.88" />
          <polygon points="34,54 60,34 86,54" fill={fillPrimary} />
          <polygon points="24,78 60,54 96,78" fill="#E8DFD0" />
          <rect x="42" y="78" width="36" height="22" fill={fillPrimary} />
          <line x1="60" y1="6" x2="60" y2="14" />
        </g>
      )}

      {shape === 'cube' && (
        <g stroke={stroke} strokeWidth="2" strokeLinejoin="round" strokeDasharray={strokeDash}>
          <polygon points="60,18 96,38 60,58 24,38" fill={fillPrimary} />
          <polygon points="24,38 60,58 60,100 24,80" fill={fillSecondary} fillOpacity="0.72" />
          <polygon points="96,38 60,58 60,100 96,80" fill="#E8DFD0" />
        </g>
      )}

      {shape === 'dragon' && (
        <g stroke={stroke} strokeWidth="2" strokeLinejoin="round" strokeDasharray={strokeDash}>
          <polygon points="16,74 44,44 60,64 34,92" fill={fillSecondary} fillOpacity="0.85" />
          <polygon points="44,44 74,20 96,34 60,64" fill={fillPrimary} />
          <polygon points="74,20 106,16 96,34" fill="#C5A46D" fillOpacity="0.9" />
          <polygon points="60,64 88,68 104,96 66,86" fill="#E8DFD0" />
          <polygon points="44,44 30,24 54,34" fill="#D9534F" fillOpacity="0.75" />
        </g>
      )}

      {shape === 'hummingbird' && (
        <g stroke={stroke} strokeWidth="2" strokeLinejoin="round" strokeDasharray={strokeDash}>
          <polygon points="24,70 62,48 54,82" fill={fillPrimary} />
          <polygon points="62,48 40,18 74,34" fill={fillSecondary} fillOpacity="0.88" />
          <polygon points="62,48 92,38 110,34 74,56" fill="#E8DFD0" />
        </g>
      )}

      {shape === 'mask' && (
        <g stroke={stroke} strokeWidth="2" strokeLinejoin="round" strokeDasharray={strokeDash}>
          <polygon points="28,26 60,18 92,26 86,86 60,102 34,86" fill={fillPrimary} />
          <polygon points="60,18 92,26 86,86 60,102" fill={fillSecondary} fillOpacity="0.65" />
          <polygon points="38,48 52,52 42,60" fill="#252525" />
          <polygon points="82,48 68,52 78,60" fill="#252525" />
        </g>
      )}

      {shape === 'magnifier' && (
        <g stroke={stroke} strokeWidth="2" strokeLinejoin="round" strokeDasharray={strokeDash}>
          <polygon points="52,20 78,34 78,64 52,78 26,64 26,34" fill={fillPrimary} />
          <polygon points="52,30 68,40 68,58 52,68 36,58 36,40" fill={fillSecondary} fillOpacity="0.45" />
          <polygon points="72,68 98,94 90,102 64,76" fill="#C5A46D" />
        </g>
      )}

      {broken && (
        <path
          d="M28 24 L58 56 L46 72 L90 98"
          stroke="#D9534F"
          strokeWidth="2.5"
          strokeDasharray="4 3"
        />
      )}
    </svg>
  );
};
