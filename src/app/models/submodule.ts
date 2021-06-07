import {Module} from './module'

export enum Language {
  de,
  en,
  de_en
}

export enum Season {
  SoSe,
  WiSe,
  SoSe_WiSe,
  unknown
}

export interface Submodule {
  moduleId: string
  label: string
  abbreviation: string
  recommendedSemester: number
  credits: number
  descriptionUrl: string
  language: Language
  season: Season
  id: string
}

export interface SubmoduleAtom {
  moduleId: Module
  label: string
  abbreviation: string
  recommendedSemester: number
  credits: number
  descriptionUrl: string
  language: Language
  season: Season
  id: string
}
