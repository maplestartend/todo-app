import { createContext, useContext } from 'react';

export const MW_LIGHT = {
  paper: '#faf3e3',
  paperRaised: '#fffaeb',
  paperSunk: '#f0e6cf',
  ink: '#2d231a',
  inkSoft: '#5a4736',
  muted: '#9c8b73',
  hairline: '#cdb997',
  accent: '#c46a4a',
  accentSoft: '#f0bca0',
  green: '#7a8c5e',
  amber: '#b88a3e',
  workCat: '#c46a4a',
  lifeCat: '#7a8c5e',
  studyCat: '#b88a3e',
  scrim: 'rgba(40,28,18,0.35)',
  shadow: '0 6px 18px rgba(60,40,20,0.16)',
  isDark: false,
};

export const MW_DARK = {
  paper: '#1f1813',
  paperRaised: '#2a2018',
  paperSunk: '#15100c',
  ink: '#f5e9d2',
  inkSoft: '#c2b094',
  muted: '#8a7a64',
  hairline: '#3d3024',
  accent: '#e88a65',
  accentSoft: '#5a3122',
  green: '#9bb07a',
  amber: '#d7a85a',
  workCat: '#e88a65',
  lifeCat: '#9bb07a',
  studyCat: '#d7a85a',
  scrim: 'rgba(0,0,0,0.55)',
  shadow: '0 6px 18px rgba(0,0,0,0.5)',
  isDark: true,
};

export const MWThemeCtx = createContext(MW_LIGHT);
export const useMW = () => useContext(MWThemeCtx);
