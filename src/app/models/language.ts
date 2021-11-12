const LANGUAGES = ['de', 'en', 'de_en'] as const

export type Language = (typeof LANGUAGES)[number] | 'undefined'

export const allLanguages = (): Language[] => [...LANGUAGES]
