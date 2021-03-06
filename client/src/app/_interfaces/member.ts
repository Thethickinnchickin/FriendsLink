import { Photo } from "./photo";

export interface Member {
    id: Number;
    userName: string;
    photoUrl: string;
    age: number;
    knownAs: string;
    created: string;
    lastActive: string;
    gender: string;
    introduction: string;
    lookingFor: string;
    interestes: string;
    city: string;
    country: string;
    photos: Photo[];
}

