import express, { Request, Response, Router } from 'express';
import { Farmaco } from '@prisma/client';
import { prisma } from '../../prisma/core';
import {
    errorRespond,
    ErrorResponse,
    ERROR_INVALID_PARAMS, ERROR_NOT_FOUND
} from '../../utils/error';
import { firebaseAdd, firebaseDelete, firebaseUpdate } from '../../firebase/firebase';
import { FIREBASE_LABEL_FARMACI } from '../../firebase/firebase.config';

/**
 *  **POST /api/farmaci/**
 * ```ts
 * type request = {
 *   nome: string,
 *   descrizione: string?,
 *   effettiCollaterali: string?
 * }
 * type response = {
 *   nome: string,
 *   descrizione: string?,
 *   effettiCollaterali: string?
 * } | {error: string}
 * ```
 *  **GET /api/farmaci/**
 * ```ts
 * type request = {
 * }
 * type response = {
 *   nome: string,
 *   descrizione: string?,
 *   effettiCollaterali: string?
 * }[] | {error: string}
 * ```

 * **GET /api/farmaci/:id**
 * ```ts
 * type request = {
 * }
 * type response = {
 *   nome: string,
 *   descrizione: string?,
 *   effettiCollaterali: string?
 * } | {error: string}
 * ```
 * **PUT /api/farmaci/:id**
 * ```ts
 * type request = {
 *   nome: string?,
 *   descrizione: string?,
 *   effettiCollaterali: string?
 * }
 * type response = {
 *   nome: string,
 *   descrizione: string?,
 *   effettiCollaterali: string?
 * } | {error: string}
 * ```
 * **DELETE /api/farmaci/:id**
 * ```ts
 * type request = {
 * }
 * type response = {
 *   nome: string,
 *   descrizione: string?,
 *   effettiCollaterali: string?
 * } | {error: string}
 * ```
 */

export default function (): Router {
    const router: Router = express.Router();

    router.get("/", (req: Request, res: Response<Farmaco[] | ErrorResponse>) => {
        prisma.farmaco.findMany()
            .then(value => value !== null
                ? res.json(value)
                : errorRespond(400, ERROR_NOT_FOUND, res))
            .catch(_ => errorRespond(500, ERROR_INVALID_PARAMS, res))
    })

    router.get("/:id", (req: Request, res: Response<Farmaco | ErrorResponse>) => {
        prisma.farmaco.findFirst({
            where: {
                id: req.params.id
            }
        })
            .then(value => value !== null
                ? res.json(value)
                : errorRespond(400, ERROR_NOT_FOUND, res))
            .catch(_ => errorRespond(500, ERROR_INVALID_PARAMS, res))
    })

    router.post("/", (req: Request, res: Response<Farmaco | ErrorResponse>) => {
        prisma.farmaco.create({
            data: {
                nome: req.body.nome,
                descrizione: req.body.descrizione ?? undefined,
                effettiCollaterali: req.body.effettiCollaterali ?? undefined
            }
        })
            .then(value => firebaseAdd(value, FIREBASE_LABEL_FARMACI, res))
            .catch(_ => errorRespond(500, ERROR_INVALID_PARAMS, res))
    })

    router.put("/:id", (req: Request, res: Response<Farmaco | ErrorResponse>) => {

        prisma.farmaco.update({
            data: {
                nome: req.body.nome ?? undefined,
                descrizione: req.body.descrizione ?? undefined,
                effettiCollaterali: req.body.effettiCollaterali ?? undefined
            },
            where: {
                id: req.params.id
            }
        })
            .then(value => firebaseUpdate(value, FIREBASE_LABEL_FARMACI, res))
            .catch(_ => errorRespond(500, ERROR_INVALID_PARAMS, res))
    })

    router.delete("/:id", (req: Request, res: Response<Farmaco | ErrorResponse>) => {
        prisma.farmaco.delete({
            where: {
                id: req.params.id
            }
        })
            .then(value => firebaseDelete(value, FIREBASE_LABEL_FARMACI, res))
            .catch(_ => errorRespond(500, ERROR_INVALID_PARAMS, res))
    })

    return router;
}