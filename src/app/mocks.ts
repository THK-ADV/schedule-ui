export interface TeachingUnit {
  id: string,
  label: string,
  abbreviation: string
}

export interface StudyProgram {
  id: string,
  label: string,
  abbreviation: string,
  teachingUnit: string,
}

export interface Course {
  lecturer: string,
  semester: number,
  subModule: string,
  courseType: CourseType,
  studyProgram: string
  id: string
}

export interface Lecturer {
  id: string
  lastname: string
}

export type CourseType = 'labwork' | 'lecture' | 'seminar' | 'exercise'

export const fakeTeachingUnit: TeachingUnit[] = [
  {id: '19', label: 'Ingenieurwissenschaften', abbreviation: 'ING'},
  {id: '20', label: 'Informatik', abbreviation: 'INF'}
]

export const fakeStudyProgram: StudyProgram[] = [
  {id: '10', label: 'Medieninformatik (BA)', abbreviation: 'MI', teachingUnit: '20'},
  {id: '11', label: 'Wirtschaftsinformatik (BA)', abbreviation: 'WI', teachingUnit: '20'},
  {id: '12', label: 'Wirtschaftsingenieurwesen - Maschinenbau', abbreviation: 'WM', teachingUnit: '19'},
  {id: '13', label: 'Wirtschaftsingenieurwesen - Elektrotechnik', abbreviation: 'WE', teachingUnit: '19'},
  {id: '14', label: 'Automation & IT', abbreviation: 'AIT', teachingUnit: '19'},
  {id: '15', label: 'Medieninformatik (MA)', abbreviation: 'MMI', teachingUnit: '20'}
]

export const fakeLecturer: Lecturer[] = [
  {id: '1', lastname: 'Noss'},
  {id: '2', lastname: 'Westenberger'},
  {id: '3', lastname: 'Hartmann'},
  {id: '4', lastname: 'Anders'},
]

export const fakeCourse: Course[] = [
  {id: '1', courseType: 'lecture', lecturer: '1', semester: 1, subModule: 'SD', studyProgram: '10'},
  {id: '2', courseType: 'lecture', lecturer: '1', semester: 2, subModule: 'GDW', studyProgram: '10'},
  {id: '3', courseType: 'lecture', lecturer: '1', semester: 1, subModule: 'EMI', studyProgram: '10'},
  {id: '4', courseType: 'lecture', lecturer: '2', semester: 1, subModule: 'EWI', studyProgram: '11'},
  {id: '5', courseType: 'lecture', lecturer: '2', semester: 2, subModule: 'BA1', studyProgram: '11'},
  {id: '6', courseType: 'lecture', lecturer: '4', semester: 1, subModule: 'PHY1', studyProgram: '12'},
  {id: '7', courseType: 'lecture', lecturer: '4', semester: 2, subModule: 'PHY2', studyProgram: '12'},
  {id: '8', courseType: 'lecture', lecturer: '3', semester: 1, subModule: 'VI', studyProgram: '15'},
]
