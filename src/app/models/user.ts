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
  return l?.username !== undefined &&
    l?.firstname !== undefined &&
    l?.lastname !== undefined &&
    l?.email !== undefined &&
    l?.id !== undefined &&
    l?.title !== undefined &&
    l?.initials !== undefined
}
