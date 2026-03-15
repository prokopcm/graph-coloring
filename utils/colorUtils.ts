import { colorsList } from '~/data/colors'

/**
 * Converts a hex or rgb color to a human-readable name.
 * @param hexOrRGB The hex or rgb color to convert to a readable name
 * @returns The readable name of the color
 */
export function colorToDisplayName(hexOrRGB: string) {
  const color = colorsList.find(color => color.hex === hexOrRGB || color.rgb === hexOrRGB)

  return color ? color.name : hexOrRGB
}
