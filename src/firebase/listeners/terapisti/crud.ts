import {onChildChanged, ref, onChildRemoved, onChildAdded, DatabaseReference, get} from "firebase/database";
import {database} from "../../firebase";
import {FIREBASE_DB_ROOT, FIREBASE_LABEL_TERAPISTI} from "../../firebase.config";
import {prisma} from "../../../prisma/core";
import { isValidParam } from "../../../utils/check";

export default function listeners(){
    const dbRef: DatabaseReference =  ref(database, `${FIREBASE_DB_ROOT}/${FIREBASE_LABEL_TERAPISTI}/`)

    onChildChanged(dbRef, snapshot => {
        if(isValidParam(snapshot.key)
        && typeof snapshot.key === 'string'){
            get(ref(database, `${FIREBASE_DB_ROOT}/${FIREBASE_LABEL_TERAPISTI}/${snapshot.key}`))
                .then(value => {
                    prisma.terapista.update({
                        data: {
                            nome: value.child('nome').val() ?? undefined,
                            cognome: value.child('cognome').val() ?? undefined,
                            codiceFiscale: value.child('codiceFiscale').val() ?? undefined,
                            specialistica: value.child('specialistica').val() ?? undefined
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
            get(ref(database, `${FIREBASE_DB_ROOT}/${FIREBASE_LABEL_TERAPISTI}/${snapshot.key}`))
                .then(value => {
                    prisma.terapista.create({
                        data: {
                            nome: value.child('nome').val() ?? undefined,
                            cognome: value.child('cognome').val() ?? undefined,
                            codiceFiscale: value.child('codiceFiscale').val() ?? undefined,
                            specialistica: value.child('specialistica').val() ?? undefined
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
            prisma.terapista.delete({
                where: {
                    id: snapshot.key
                }
            })
            .then(_ => console.log(_))
            .catch(_ => console.log(_))
        }
    })
}