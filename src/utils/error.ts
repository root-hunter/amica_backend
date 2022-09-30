import {Response } from 'express';

export const ERROR_FIREBASE_UPDATE = "Non è stato possibile sincronizzare i dati"
export const ERROR_NOT_FOUND = "Dato non trovato"
export const ERROR_INVALID_PARAMS = "Parametri di input non validi"

export type ErrorResponse = {
    error: string
}

export const errorRespond = (
    status: 300 | 400 | 500, 
    error: string, res: Response) =>{
        res.status(status);
        res.json({error} as ErrorResponse);
}
