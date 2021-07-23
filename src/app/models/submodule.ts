import {Module} from './module'
import {Language} from './language'
import {Season} from './season'

export interface Submodule {
  label: string
  abbreviation: string
  module: string
  recommendedSemester: number
  credits: number
  language: Language
  season: Season
  descriptionUrl: string
  id: string
}

export interface SubmoduleAtom {
  label: string
  abbreviation: string
  module: Module
  recommendedSemester: number
  credits: number
  language: Language
  season: Season
  descriptionUrl: string
  id: string
}
