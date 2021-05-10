import { Module, ModuleAtom } from "./module";

export interface Submodule {
    label: string, 
    abbreviation: string, 
    markdownFile: string, 
    mandatory: boolean, 
    recommendedSemester: number, 
    module: string,
    id: string
}

export interface SubmoduleAtom {
    label: string, 
    abbreviation: string, 
    markdownFile: string, 
    ects: number,
    mandatory: boolean, 
    recommendedSemester: number, 
    module: ModuleAtom,
    id: string
}