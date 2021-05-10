import { People } from "./people";

export interface Module {
    label: string, 
    abbreviation: string, 
    lecturer: string[],
    ects: number,
    markdownFile: string,
    id: string
}

export interface ModuleAtom {
    label: string, 
    abbreviation: string, 
    lecturer: People[],
    ects: number,
    markdownFile: string,
    id: string
}