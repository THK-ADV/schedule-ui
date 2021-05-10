import { CourseAtom } from "./course";
import { ReservationAtom } from "./reservation";

export interface Schedule {
    course: string,
    reservation: string,
    id: string
}

export interface ScheduleAtom {
    course: CourseAtom,
    reservation: ReservationAtom,
    id: string
}
