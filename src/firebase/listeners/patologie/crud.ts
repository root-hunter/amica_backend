import {onChildChanged, ref, onChildRemoved, onChildAdded, DatabaseReference, get} from "firebase/database";
import {database} from "../../firebase";
import {FIREBASE_DB_ROOT, FIREBASE_LABEL_PATOLOGIE} from "../../firebase.config";
import {prisma} from "../../../prisma/core";
import { isValidParam } from "../../../utils/check";

export default function listeners(){
    const dbRef: DatabaseReference =  ref(database, `${FIREBASE_DB_ROOT}/${FIREBASE_LABEL_PATOLOGIE}/`)

    onChildChanged(dbRef, snapshot => {
        if(isValidParam(snapshot.key) 
        && typeof snapshot.key === 'string'){
            get(ref(database, `${FIREBASE_DB_ROOT}/${FIREBASE_LABEL_PATOLOGIE}/${snapshot.key}`))
                .then(value => {
                    prisma.patologia.update({
                        data: {
                            nome: value.child('nome').val() ?? undefined,
                            descrizione: value.child('descrizione').val() ?? undefined,
                        },
                        where: {
                            id: snapshot.key as string
                        }
                    })
                    .then(_ => console.log(_))
                    .catch(_ => console.log(_))
                })
        }
    })

    onChildAdded(dbRef, snapshot => {
        if(isValidParam(snapshot.key) 
        && typeof snapshot.key === 'string'){
            get(ref(database, `${FIREBASE_DB_ROOT}/${FIREBASE_LABEL_PATOLOGIE}/${snapshot.key}`))
                .then(value => {
                    prisma.patologia.create({
                        data: {
                            id: snapshot.key as string,
                            nome: value.child('nome').val() ?? undefined,
                            descrizione: value.child('descrizione').val() ?? undefined,
                        },
                    })
                    .then(_ => console.log(_))
                    .catch(_ => console.log(_))
                })
        }
    })

    onChildRemoved(dbRef, snapshot => {
        if(isValidParam(snapshot.key) 
        && typeof snapshot.key === 'string'){
            prisma.patologia.delete({
                where: {
                    id: snapshot.key
                }
            })
            .then(_ => console.log(_))
            .catch(_ => console.log(_))
        }
    })
}