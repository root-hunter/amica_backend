import express, { Request, Response, Router } from 'express';
import { Patologia } from '@prisma/client';
import { prisma } from '../../prisma/core';
import {
    errorRespond,
    ErrorResponse,
    ERROR_INVALID_PARAMS, ERROR_NOT_FOUND
} from '../../utils/error';
import { firebaseAdd, firebaseDelete, firebaseUpdate } from '../../firebase/firebase';
import { FIREBASE_LABEL_PATOLOGIE } from '../../firebase/firebase.config';

/**
 *  **POST /api/patologie/**
 * ```ts
 * type request = {
 *   nome: string,
 *   descrizione: string?,
 * }
 * type response = {
 *   nome: string,
 *   descrizione: string?,
 * } | {error: string}
 * ```
 *  **GET /api/patologie/**
 * ```ts
 * type request = {
 * }
 * type response = {
 *   nome: string,
 *   descrizione: string?,
 * }[] | {error: string}
 * ```

 * **GET /api/patologie/:id**
 * ```ts
 * type request = {
 * }
 * type response = {
 *   nome: string,
 *   descrizione: string?,
 * } | {error: string}
 * ```
 * **PUT /api/patologie/:id**
 * ```ts
 * type request = {
 *   nome: string?,
 *   descrizione: string?,
 * }
 * type response = {
 *   nome: string,
 *   descrizione: string?,
 * } | {error: string}
 * ```
 * **DELETE /api/patologie/:id**
 * ```ts
 * type request = {
 * }
 * type response = {
 *   nome: string,
 *   descrizione: string?,
 * } | {error: string}
 * ```
 */

export default function (): Router {
    const router: Router = express.Router();

    router.get("/", (req: Request, res: Response<Patologia[] | ErrorResponse>) => {
        prisma.patologia.findMany()
            .then(value => value !== null
                ? res.json(value)
                : errorRespond(400, ERROR_NOT_FOUND, res))
            .catch(_ => errorRespond(500, ERROR_INVALID_PARAMS, res))
    })

    router.get("/:id", (req: Request, res: Response<Patologia | ErrorResponse>) => {
        prisma.patologia.findFirst({
            where: {
                id: req.params.id
            }
        })
            .then(value => value !== null
                ? res.json(value)
                : errorRespond(400, ERROR_NOT_FOUND, res))
            .catch(_ => errorRespond(500, ERROR_INVALID_PARAMS, res))
    })

    router.post("/", (req: Request, res: Response<Patologia | ErrorResponse>) => {
        prisma.patologia.create({
            data: {
                nome: req.body.nome,
                descrizione: req.body.descrizione ?? undefined,
            }
        })
            .then(value => firebaseAdd(value, FIREBASE_LABEL_PATOLOGIE, res))
            .catch(_ => errorRespond(500, ERROR_INVALID_PARAMS, res))
    })

    router.put("/:id", (req: Request, res: Response<Patologia | ErrorResponse>) => {
        prisma.patologia.update({
            data: {
                nome: req.body.nome ?? undefined,
                descrizione: req.body.descrizione ?? undefined,
            },
            where: {
                id: req.params.id
            }
        })
            .then(value => firebaseUpdate(value, FIREBASE_LABEL_PATOLOGIE, res))
            .catch(_ => errorRespond(500, ERROR_INVALID_PARAMS, res))
    })

    router.delete("/:id", (req: Request, res: Response<Patologia | ErrorResponse>) => {
        prisma.patologia.delete({
            where: {
                id: req.params.id
            }
        })
            .then(value => firebaseDelete(value, FIREBASE_LABEL_PATOLOGIE, res))
            .catch(_ => errorRespond(500, ERROR_INVALID_PARAMS, res))
    })

    return router;
}