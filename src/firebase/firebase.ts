import {firebaseConfig, FIREBASE_DB_ROOT, FIREBASE_LABEL_FARMACI} from "./firebase.config";

import {set, update} from "firebase/database"
import type {FirebaseApp} from "firebase/app"

import { initializeApp } from "firebase/app";
import { getDatabase, ref } from "firebase/database";
import { errorRespond, ERROR_FIREBASE_UPDATE } from "../utils/error";
import { Response } from "express";

export const app: FirebaseApp = initializeApp(firebaseConfig);
export const database = getDatabase(app);

export const firebaseUpdate = (value: any, label: string, res: Response) => {
    update(ref(
        database,
        `${FIREBASE_DB_ROOT}/${label}/${value.id}`), formatObject({ ...value }))
        .then(_ => res.json(value))
        .catch(_ => errorRespond(300, ERROR_FIREBASE_UPDATE, res))
}

export const firebaseAdd = (value: any, label: string, res: Response) => {
    set(ref(
        database,
        `${FIREBASE_DB_ROOT}/${label}/${value.id}`), formatObject({ ...value }))
        .then(_ => res.json(value))
        .catch(_ => errorRespond(300, ERROR_FIREBASE_UPDATE, res))
}

export const firebaseDelete = (value: any, label: string, res: Response) => {
    set(ref(
        database,
        `${FIREBASE_DB_ROOT}/${label}/${value.id}`), null)
        .then(_ => res.json(value))
        .catch(_ => errorRespond(300, ERROR_FIREBASE_UPDATE, res))
}

export const formatObject = (value: any): any => {
    const keys = Object.keys(value);

    for(let i = 0; i < keys.length; ++i){
        if(keys[i] === 'id'){
            value[keys[i]] = null;
        }else if(value[keys[i]] instanceof Date){
            value[keys[i]] = value[keys[i]].toISOString();
        }
    }
        
    return value;
}