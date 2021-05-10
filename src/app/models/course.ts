import { People } from "./people";
import { SemesterAtom } from "./semester";
import { SubmoduleAtom } from "./submodule";

export interface Course {
    intervall: string, 
    courseType: string,
    lecturer: string[],
    semester: string, 
    submodule: string,
    id: string
}

export interface CourseAtom {
    intervall: string, 
    courseType: string,
    lecturer: People[],
    semester: SemesterAtom,
    submodule: SubmoduleAtom,
    id: string
}
