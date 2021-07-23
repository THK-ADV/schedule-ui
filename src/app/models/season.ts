export type Season =
  'SoSe' |
  'WiSe' |
  'SoSe_WiSe' |
  'unknown'

export const allSeasons = (): Season[] => [
  'SoSe',
  'WiSe',
  'SoSe_WiSe',
]
