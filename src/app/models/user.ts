export interface User {
  username: string
  firstname: string
  lastname: string
  email: string
  id: string
}

export interface Lecturer extends User {
  title: string
  initials: string
}

export const isLecturer = (a: any): a is Lecturer => {
  const l = a as Lecturer
  return isUser(l) &&
    l?.title !== undefined &&
    l?.initials !== undefined
}

export const isUser = (a: any): a is User => {
  const u = a as User
  return u?.username !== undefined &&
    u?.firstname !== undefined &&
    u?.lastname !== undefined &&
    u?.email !== undefined &&
    u?.id !== undefined
}
