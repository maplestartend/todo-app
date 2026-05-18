import React from 'react';

export default function MWIcon({ name, size = 22, stroke = 'currentColor', fill = 'none', sw = 1.6 }) {
  const common = { fill, stroke, strokeWidth: sw, strokeLinecap: 'round', strokeLinejoin: 'round' };
  const paths = {
    home: <g {...common}>
      <path d="M3.5 11 L 12 4 L 20.5 11"/>
      <path d="M5.5 10 V 19.5 H 18.5 V 10"/>
      <path d="M10 19.5 V 14 H 14 V 19.5"/>
    </g>,
    folder: <g {...common}>
      <path d="M3 7.5 C 3 6.5 4 5.5 5 5.5 H 9.5 L 11 7.5 H 19 C 20 7.5 21 8.5 21 9.5 V 17.5 C 21 18.5 20 19.5 19 19.5 H 5 C 4 19.5 3 18.5 3 17.5 Z"/>
    </g>,
    search: <g {...common}>
      <circle cx="10.5" cy="10.5" r="6.2"/>
      <path d="M15.2 15.2 L 20 20"/>
    </g>,
    archive: <g {...common}>
      <path d="M3.5 6.5 H 20.5 V 9 H 3.5 Z"/>
      <path d="M5 9 V 19.5 H 19 V 9"/>
      <path d="M10 13 H 14"/>
    </g>,
    settings: <g {...common}>
      <circle cx="12" cy="12" r="2.6"/>
      <path d="M12 4 V 6.5 M12 17.5 V 20 M4 12 H 6.5 M17.5 12 H 20 M6.3 6.3 L 8 8 M16 16 L 17.7 17.7 M6.3 17.7 L 8 16 M16 8 L 17.7 6.3"/>
    </g>,
    plus: <g {...common}>
      <path d="M12 5 V 19 M5 12 H 19"/>
    </g>,
    back: <g {...common}>
      <path d="M14.5 5.5 L 8 12 L 14.5 18.5"/>
    </g>,
    close: <g {...common}>
      <path d="M6 6 L 18 18 M18 6 L 6 18"/>
    </g>,
    bell: <g {...common}>
      <path d="M6 17 H 18 L 16.5 14.5 V 11 C 16.5 8.2 14.5 6 12 6 C 9.5 6 7.5 8.2 7.5 11 V 14.5 Z"/>
      <path d="M10.5 19.5 C 10.5 20.3 11.2 21 12 21 C 12.8 21 13.5 20.3 13.5 19.5"/>
    </g>,
    flag: <g {...common}>
      <path d="M5.5 4 V 21"/>
      <path d="M5.5 4.5 H 17 L 14.5 8.5 L 17 12.5 H 5.5"/>
    </g>,
    note: <g {...common}>
      <path d="M5 4 H 19 V 20 H 5 Z"/>
      <path d="M8 9 H 16 M8 12 H 16 M8 15 H 13"/>
    </g>,
    calendar: <g {...common}>
      <rect x="3.5" y="5.5" width="17" height="15" rx="2"/>
      <path d="M3.5 10 H 20.5"/>
      <path d="M8 3.5 V 7 M16 3.5 V 7"/>
    </g>,
    chevR: <g {...common}><path d="M9 5 L 16 12 L 9 19"/></g>,
    chevL: <g {...common}><path d="M15 5 L 8 12 L 15 19"/></g>,
    user: <g {...common}>
      <circle cx="12" cy="9" r="3.5"/>
      <path d="M5 20 C 5.5 16 8.5 14 12 14 C 15.5 14 18.5 16 19 20"/>
    </g>,
    moon: <g {...common}>
      <path d="M19.5 14 C 18 16.5 15.5 18 12.5 18 C 8 18 4.5 14.5 4.5 10 C 4.5 7 6 4.5 8.5 3 C 8.2 4 8 5 8 6 C 8 11.5 12.5 16 18 16 C 19 16 20 15.8 20.5 15.5 Z"/>
    </g>,
    edit: <g {...common}>
      <path d="M4.5 19.5 L 5.5 15.5 L 16 5 L 19 8 L 8.5 18.5 Z"/>
      <path d="M14 7 L 17 10"/>
    </g>,
    trash: <g {...common}>
      <path d="M5 7 H 19"/>
      <path d="M9 7 V 5 H 15 V 7"/>
      <path d="M6.5 7 L 7.5 20 H 16.5 L 17.5 7"/>
      <path d="M10 11 V 17 M14 11 V 17"/>
    </g>,
  };
  return (
    <svg width={size} height={size} viewBox="0 0 24 24">
      {paths[name] || null}
    </svg>
  );
}
