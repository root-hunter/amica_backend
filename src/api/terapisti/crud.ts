import express, { Request, Response, Router } from 'express';
import { Terapista } from '@prisma/client';
import { prisma } from '../../prisma/core';
import {
    errorRespond,
    ErrorResponse,
    ERROR_INVALID_PARAMS, ERROR_NOT_FOUND
} from '../../utils/error';

/**
 *  **POST /api/pazienti/**
 * ```ts
 * type request = {
 *  nome: string,
 *  cognome: string,
 *  codiceFiscale: string,
 *  specialistica: string
 * }
 * type response = {
 *  nome: string,
 *  cognome: string,
 *  codiceFiscale: string,
 *  specialistica: string
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
 *  specialistica: string
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
 *  specialistica: string
 * } | {error: string}
 * ```
 * **PUT /api/pazienti/:id**
 * ```ts
 * type request = {
 *  nome: string?,
 *  cognome: string?,
 *  codiceFiscale: string?,
 *  specialistica: string? 
 * }
 * type response = {
 *  nome: string,
 *  cognome: string,
 *  codiceFiscale: string,
 *  specialistica: string
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
 *  specialistica: string
 * } | {error: string}
 * ```
 */

export default function (): Router {
    const router: Router = express.Router();

    router.post("/", (req: Request, res: Response<Terapista | ErrorResponse>) => {
        prisma.terapista.create({
            data: {
                nome: req.body.nome,
                cognome: req.body.cognome,
                codiceFiscale: req.body.codiceFiscale,
                specialistica: req.body.specialistica
            }
        })
            .then(value => res.json(value))
            .catch(_ => errorRespond(500, ERROR_INVALID_PARAMS, res))
    })

    router.get("/", (req: Request, res: Response<Terapista[] | ErrorResponse>) => {
        prisma.terapista.findMany()
            .then(value => value !== null
                ? res.json(value)
                : errorRespond(400, ERROR_NOT_FOUND, res))
            .catch(_ => errorRespond(500, ERROR_INVALID_PARAMS, res))
    })

    router.get("/:id", (req: Request, res: Response<Terapista | ErrorResponse>) => {
        prisma.terapista.findFirst({
            where: {
                id: req.params.id
            }
        })
            .then(value => value !== null
                ? res.json(value)
                : errorRespond(400, ERROR_NOT_FOUND, res))
            .catch(_ => errorRespond(500, ERROR_INVALID_PARAMS, res))
    })

    router.put("/:id", (req: Request, res: Response<Terapista | ErrorResponse>) => {
        prisma.terapista.update({
            data: {
                nome: req.body.nome ?? undefined,
                cognome: req.body.cognome ?? undefined,
                codiceFiscale: req.body.codiceFiscale ?? undefined,
                specialistica: req.body.specialistica ?? undefined
            },
            where: {
                id: req.params.id
            }
        })
            .then(value => res.json(value))
            .catch(_ => errorRespond(500, ERROR_INVALID_PARAMS, res))
    })

    router.delete("/:id", (req: Request, res: Response<Terapista | ErrorResponse>) => {
        prisma.terapista.delete({
            where: {
                id: req.params.id
            }
        })
            .then(value => res.json(value))
            .catch(_ => errorRespond(500, ERROR_INVALID_PARAMS, res))
    })

    return router;
}