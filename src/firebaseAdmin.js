import * as firebaseAdmin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import { cert, getApps, getApp } from 'firebase-admin/app';

// get this JSON from the Firebase board
// you can also store the values in environment variables
import serviceAccount from './firebase_secret.json';

let app
if (!getApps().length) {
    app = firebaseAdmin.initializeApp({
        credential: cert(serviceAccount),
    }, 'adminDB')
} else {
    app = getApp('adminDB')
}


export const adminDB = getFirestore(app)