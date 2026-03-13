import { colorsList } from '~/data/colors'

export function colorToName(hexOrRGB: string) {
  const color = colorsList.find(color => color.hex === hexOrRGB || color.rgb === hexOrRGB)

  return color ? color.name : hexOrRGB
}
