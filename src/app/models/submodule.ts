import {Module} from './module'
import {Language} from './language'
import {Season} from './season'
import {SemesterIndex} from './semester-index'

export interface Submodule {
  label: string
  abbreviation: string
  module: string
  recommendedSemester: SemesterIndex
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
