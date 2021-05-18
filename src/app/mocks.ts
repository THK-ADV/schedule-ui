export interface TeachingUnit {
  id: string,
  label: string,
  abbreviation: string
}

export interface Graduation {
  id: string,
  label: string,
  abbreviation: string
}

export interface StudyProgram {
  id: string,
  label: string,
  abbreviation: string,
  teachingUnit: string,
  graduation: string
}

export const fakeGraduation: Graduation[] = [
  {id: '1', label: 'Bachelor', abbreviation: 'BSc'},
  {id: '2', label: 'Master', abbreviation: 'MSc'}
]

export const fakeTeachingUnit: TeachingUnit[] = [
  {id: '19', label: 'Ingenieurwissenschaften', abbreviation: 'ING'},
  {id: '20', label: 'Informatik', abbreviation: 'INF'}
]

export const fakeStudyProgram: StudyProgram[] = [
  {id: '10', label: 'Medieninformatik (BA)', abbreviation: 'MI', graduation: '1', teachingUnit: '20'},
  {id: '11', label: 'Wirtschaftsinformatik', abbreviation: 'WI', graduation: '1', teachingUnit: '20'},
  {id: '12', label: 'Wirtschaftsingenieurwesen - Maschinenbau', abbreviation: 'WM', graduation: '1', teachingUnit: '19'},
  {id: '13', label: 'Wirtschaftsingenieurwesen - Elektrotechnik', abbreviation: 'WE', graduation: '1', teachingUnit: '19'},
  {id: '14', label: 'Automation & IT', abbreviation: 'AIT', graduation: '2', teachingUnit: '19'},
  {id: '15', label: 'Medieninformatik (MA)', abbreviation: 'MMI', graduation: '2', teachingUnit: '20'}
]
