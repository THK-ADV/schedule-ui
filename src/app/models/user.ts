export interface User {
  username: string
  firstname: string
  lastname: string
  status: string
  email: string
  id: string
}

export interface Lecturer extends User {
  title: string
  initials: string
}
