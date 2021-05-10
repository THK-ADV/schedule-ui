//maybe not needed
export interface Semester {
    label: string, 
    abbreviation: string,
    start: string,
    end: string,
    lectureStart: string,
    lectureEnd: string, 
    id: string
}

export interface SemesterAtom {
    label: string, 
    abbreviation: string,
    start: Date,
    end: Date,
    lectureStart: Date,
    lectureEnd: Date, 
    id: string
}