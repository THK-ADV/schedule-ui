import {ExaminationRegulationAtom} from './examination-regulation'
import {Module} from './module'

export interface ModuleExaminationRegulation {
  module: string
  examinationRegulation: string
  mandatory: boolean
  id: string
}

export interface ModuleExaminationRegulationAtom {
  module: Module
  examinationRegulation: ExaminationRegulationAtom
  mandatory: boolean
  id: string
}
