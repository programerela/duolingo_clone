export type AppColors = {
  mode: 'dark' | 'light';
  background: string; backgroundDeep: string; surface: string; surfaceRaised: string; surfaceSoft: string; border: string; borderLight: string;
  textPrimary: string; textSecondary: string; textMuted: string; textDark: string;
  green: string; greenPressed: string; greenSoft: string; blue: string; bluePressed: string; blueSoft: string; yellow: string; yellowPressed: string; red: string; redPressed: string; redSoft: string; purple: string; purpleSoft: string; orange: string;
  white: string; black: string; transparent: string; shadow: string; nav: string; cardHighlight: string;
};

export const darkColors: AppColors = {
  mode: 'dark',
  background: '#131F24', backgroundDeep: '#0F1A1E', surface: '#202F36', surfaceRaised: '#2B3B43', surfaceSoft: '#1A2A30', border: '#37464F', borderLight: '#4B5F69',
  textPrimary: '#F7FBFD', textSecondary: '#A8B4BA', textMuted: '#73858E', textDark: '#131F24',
  green: '#58CC02', greenPressed: '#46A302', greenSoft: '#203B23', blue: '#1CB0F6', bluePressed: '#168CC4', blueSoft: '#17384A', yellow: '#FFC800', yellowPressed: '#D9A900', red: '#FF4B4B', redPressed: '#D83C3C', redSoft: '#4A2326', purple: '#CE82FF', purpleSoft: '#392746', orange: '#FF9600',
  white: '#FFFFFF', black: '#000000', transparent: 'transparent', shadow: '#071014', nav: '#131F24', cardHighlight: '#263A43',
};

export const lightColors: AppColors = {
  ...darkColors,
  mode: 'light',
  background: '#FFFFFF', backgroundDeep: '#F7F7F7', surface: '#FFFFFF', surfaceRaised: '#F1F4F5', surfaceSoft: '#F7F9FA', border: '#E5E5E5', borderLight: '#D6D6D6',
  textPrimary: '#3C3C3C', textSecondary: '#777777', textMuted: '#AFAFAF', textDark: '#131F24',
  greenSoft: '#EAF8DA', blueSoft: '#E5F5FD', redSoft: '#FFE7E7', purpleSoft: '#F4E8FB',
  shadow: '#D7D7D7', nav: '#FFFFFF', cardHighlight: '#F3F6F7',
};
