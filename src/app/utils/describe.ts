import {Lecturer, User} from '../models/user'

export type Describe<A> = (a: A) => string

export const describeLecturer: Describe<Lecturer> = l =>
  `${describeUser(l)} (${l.initials})`

export const describeUser: Describe<User> = u =>
  `${u.lastname}, ${u.firstname}`

export const describeUserWithCampusId: Describe<User> = u =>
  `${describeUser(u)} (${u.username})`
