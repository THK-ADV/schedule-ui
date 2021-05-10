import { Faculty } from "./faculty";

export interface TeachingUnit {
    label: string, 
    abbreviation: string, 
    faculty: string,
    id: string
}

export interface TeachingUnitAtom {
    label: string, 
    abbreviation: string, 
    faculty: Faculty,
    id: string
}