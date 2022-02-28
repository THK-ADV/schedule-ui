export interface LinkItem {
  label: string
  icon: string,
  routerLink: string
}

export namespace LinkItem {
  export const adminLinks = (): LinkItem[] => [
    {label: 'Studiengänge', icon: 'school', routerLink: 'studyPaths'},
    {label: 'Prüfungsordnungen', icon: 'approval', routerLink: 'examinationRegulations'},
    {label: 'Module in PO', icon: 'approval', routerLink: 'moduleExaminationRegulations'},
    {label: 'Module', icon: 'class', routerLink: 'modules'},
    {label: 'Submodule', icon: 'class', routerLink: 'submodules'},
    {label: 'Semester', icon: 'date_range', routerLink: 'semesters'},
    {label: 'Benutzer', icon: 'people', routerLink: 'users'},
  ]
  export const lecturerLinks = (): LinkItem[] => [
    {label: 'Module', icon: 'class', routerLink: 'modules'},
    {label: 'Stundenplanung prüfen', icon: 'schedule', routerLink: 'scheduleVerification'},
  ]
}



