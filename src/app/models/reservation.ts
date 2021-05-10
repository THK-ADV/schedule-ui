import { Time } from "@angular/common";
import { Room } from "./room";

export interface Reservation {
    date: Date,
    start: Time,
    end: Time,
    room: string,
    id: string
}

export interface ReservationAtom {
    date: Date,
    start: Time,
    end: Time,
    room: Room,
    id: string
}
