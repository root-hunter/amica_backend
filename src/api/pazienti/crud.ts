import express, { Request, Response, Router } from 'express';
import { Paziente } from '@prisma/client';
import { prisma } from '../../prisma/core';
import {
    errorRespond as errorResponse,
    ErrorResponse,
    ERROR_INVALID_PARAMS, ERROR_NOT_FOUND
} from '../../utils/error';

import { isValidParam } from '../../utils/check';
import { FIREBASE_LABEL_PAZIENTI } from '../../firebase/firebase.config';
import { firebaseAdd, firebaseDelete, firebaseUpdate } from '../../firebase/firebase';

/**
 *  **POST /api/pazienti/**
 * ```ts
 * type request = {
 *  nome: string,
 *  cognome: string,
 *  codiceFiscale: string,
 *  ms: number,
 *  lavoro: string,
 *  dataNascita: DateTime,
 *  gradoIstruzione: string  
 * }
 * type response = {
 *  nome: string,
 *  cognome: string,
 *  codiceFiscale: string,
 *  ms: number,
 *  lavoro: string,
 *  dataNascita: DateTime,
 *  gradoIstruzione: string  
 * } | {error: string}
 * ```
 *  **GET /api/pazienti/**
 * ```ts
 * type request = {
 * }
 * type response = {
 *  nome: string,
 *  cognome: string,
 *  codiceFiscale: string,
 *  ms: number,
 *  lavoro: string,
 *  dataNascita: DateTime,
 *  gradoIstruzione: string  
 * }[] | {error: string}
 * ```

 * **GET /api/pazienti/:id**
 * ```ts
 * type request = {
 * }
 * type response = {
 *  nome: string,
 *  cognome: string,
 *  codiceFiscale: string,
 *  ms: number,
 *  lavoro: string,
 *  dataNascita: DateTime,
 *  gradoIstruzione: string  
 * } | {error: string}
 * ```
 * **PUT /api/pazienti/:id**
 * ```ts
 * type request = {
 *  nome: string?,
 *  cognome: string?,
 *  codiceFiscale: string?,
 *  ms: number?,
 *  lavoro: string?,
 *  dataNascita: DateTime?,
 *  gradoIstruzione: string?  
 * }
 * type response = {
 *  nome: string,
 *  cognome: string,
 *  codiceFiscale: string,
 *  ms: number,
 *  lavoro: string,
 *  dataNascita: DateTime,
 *  gradoIstruzione: string 
 * } | {error: string}
 * ```
 * **DELETE /api/pazienti/:id**
 * ```ts
 * type request = {
 * }
 * type response = {
 *  nome: string,
 *  cognome: string,
 *  codiceFiscale: string,
 *  ms: number,
 *  lavoro: string,
 *  dataNascita: DateTime,
 *  gradoIstruzione: string 
 * } | {error: string}
 * ```
 */

export default function (): Router {
    const router: Router = express.Router();

    router.get("/", (req: Request, res: Response<Paziente[] | ErrorResponse>) => {
        prisma.paziente.findMany()
            .then(value => value !== null
                ? res.json(value)
                : errorResponse(400, ERROR_NOT_FOUND, res))
            .catch(_ => errorResponse(500, ERROR_INVALID_PARAMS, res))
    })

    router.get("/:id", (req: Request, res: Response<Paziente | ErrorResponse>) => {
        prisma.paziente.findFirst({
            where: {
                id: req.params.id
            }
        })
            .then(value => value !== null
                ? res.json(value)
                : errorResponse(400, ERROR_NOT_FOUND, res))
            .catch(_ => errorResponse(500, ERROR_INVALID_PARAMS, res))
    })

    router.post("/", (req: Request, res: Response<Paziente | ErrorResponse>) => {
        console.log(req.body)
        prisma.paziente.create({
            data: {
                nome: req.body.nome,
                cognome: req.body.cognome,
                codiceFiscale: req.body.codiceFiscale,
                ms: Number(req.body.ms),
                lavoro: req.body.lavoro,
                dataNascita: new Date(Date.parse(req.body.dataNascita)),
                gradoIstruzione: req.body.gradoIstruzione
            }
        })
            .then(value => firebaseAdd(value, FIREBASE_LABEL_PAZIENTI, res))
            .catch(_ => errorResponse(500, ERROR_INVALID_PARAMS, res))
    })

    router.put("/:id", (req: Request, res: Response<Paziente | ErrorResponse>) => {
        prisma.paziente.update({
            data: {
                nome: req.body.nome ?? undefined,
                cognome: req.body.cognome ?? undefined,
                codiceFiscale: req.body.codiceFiscale ?? undefined,
                ms: isValidParam(req.body.ms) ? Number(req.body.ms) : undefined,
                lavoro: req.body.lavoro ?? undefined,
                dataNascita: isValidParam(req.body.dataNascita)
                    ? new Date(Date.parse(req.body.dataNascita))
                    : undefined,
                gradoIstruzione: req.body.gradoIstruzione ?? undefined
            },
            where: {
                id: req.params.id
            }
        })
            .then(value => firebaseUpdate(value, FIREBASE_LABEL_PAZIENTI, res))
            .catch(_ => errorResponse(500, ERROR_INVALID_PARAMS, res))
    })

    router.delete("/:id", (req: Request, res: Response<Paziente | ErrorResponse>) => {
        prisma.paziente.delete({
            where: {
                id: req.params.id
            }
        })
            .then(value => firebaseDelete(value, FIREBASE_LABEL_PAZIENTI, res))
            .catch(_ => errorResponse(500, ERROR_INVALID_PARAMS, res))
    })

    return router;
}