import {User} from './user'

export interface Module {
  courseManager: string
  label: string
  abbreviation: string
  credits: number
  descriptionUrl: string
  id: string
}

export interface ModuleAtom {
  courseManager: User
  label: string
  abbreviation: string
  credits: number
  descriptionUrl: string
  id: string
}
