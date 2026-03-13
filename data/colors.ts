export interface ColorInfo {
  hex: string
  name: string
  rgb: string
}

/** A list of colors to use in the app with their hex, rgb, and name */
export const colorsList = [
  { hex: '#FF6E6E', rgb: 'rgb(255, 110, 110)', name: 'red' },
  { hex: '#6E9EFF', rgb: 'rgb(110, 158, 255)', name: 'blue' },
  { hex: '#6EFF98', rgb: 'rgb(110, 255, 152)', name: 'green' },
  { hex: '#FFFA6E', rgb: 'rgb(255, 250, 110)', name: 'yellow' },
  { hex: '#FF6EFF', rgb: 'rgb(255, 110, 255)', name: 'pink' },
  { hex: '#FFA64D', rgb: 'rgb(255, 166, 77)', name: 'orange' },
  { hex: '#6EFFFF', rgb: 'rgb(110, 255, 255)', name: 'cyan' },
  { hex: '#FFFFFF', rgb: 'rgb(255, 255, 255)', name: 'white' },
] as const

type ColorName = typeof colorsList[number]['name'] | 'BLANK' | 'SELECTED' | 'HIGHLIGHTED'

export const colorNameHex: Record<ColorName, string> = {
  ...(Object.fromEntries(colorsList.map(({ name, hex }) => [name, hex])) as Record<ColorName, string>),
  BLANK: '#FFFFFF',
  SELECTED: '#B3FFEC',
  HIGHLIGHTED: '#E6FFF9',
} as Record<ColorName, string>
