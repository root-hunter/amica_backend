import { FirebaseOptions } from "firebase/app";
import dotenv from 'dotenv';
dotenv.config();

export const FIREBASE_DB_ROOT: string = 'a_ricciardi2'

export const FIREBASE_LABEL_ESERCIZI: string = "esercizi"
export const FIREBASE_LABEL_PAZIENTI: string = "pazienti"
export const FIREBASE_LABEL_FARMACI: string = "farmaci"
export const FIREBASE_LABEL_TERAPISTI: string = "terapisti"
export const FIREBASE_LABEL_PATOLOGIE: string = "patologie"

export const firebaseConfig: FirebaseOptions = {
    apiKey: process.env.FIREBASE_API_KEY,
    authDomain: process.env.FIREBASE_AUTH_DOMAIN,
    databaseURL: process.env.FIREBASE_DATABASE_URL,
    projectId: process.env.FIREBASE_PROJECT_ID,
    storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.FIREBASE_APP_ID
}

