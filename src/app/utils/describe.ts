import {Lecturer, User} from '../models/user'
import {Language} from '../models/language'
import {Season} from '../models/season'
import {Module} from '../models/module'

export type Describe<A> = (a: A) => string

export const describeLecturer: Describe<Lecturer> = l =>
  `${describeUser(l)} (${l.initials})`

export const describeUser: Describe<User> = u =>
  `${u.lastname}, ${u.firstname}`

export const describeUserWithCampusId: Describe<User> = u =>
  `${describeUser(u)} (${u.username})`

export const describeLanguage: Describe<Language> = l => {
  switch (l) {
    case 'de':
      return 'deutsch'
    case 'en':
      return 'englisch'
    case 'de_en':
      return 'deutsch und englisch'
  }
}

export const describeSeason: Describe<Season> = s => {
  switch (s) {
    case 'SoSe':
    case 'WiSe':
      return s
    case 'SoSe_WiSe':
      return 'SoSe & WiSe'
    case 'unknown':
      return 'unbekannt'
  }
}

export const describeModule: Describe<Module> = m =>
  `${m.label} (${m.abbreviation})`
