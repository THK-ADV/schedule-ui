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

export const isModule = (a: any): a is Module => {
  const m = (a as Module)
  return m?.courseManager !== undefined &&
    m?.label !== undefined &&
    m?.abbreviation !== undefined &&
    m?.credits !== undefined &&
    m?.descriptionUrl !== undefined &&
    m?.id !== undefined
}
