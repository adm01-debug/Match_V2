import { create } from '@storybook/theming/create';

export default create({
  base: 'light',
  brandTitle: 'MATCH ATS',
  brandUrl: 'https://github.com/adm01-debug/match',
  brandTarget: '_self',
  
  // Colors
  colorPrimary: '#6366f1',
  colorSecondary: '#4f46e5',
  
  // UI
  appBg: '#f8fafc',
  appContentBg: '#ffffff',
  appBorderColor: '#e2e8f0',
  appBorderRadius: 8,
  
  // Text colors
  textColor: '#1e293b',
  textInverseColor: '#ffffff',
  
  // Toolbar default and active colors
  barTextColor: '#64748b',
  barSelectedColor: '#6366f1',
  barBg: '#ffffff',
  
  // Form colors
  inputBg: '#ffffff',
  inputBorder: '#e2e8f0',
  inputTextColor: '#1e293b',
  inputBorderRadius: 6,
});
