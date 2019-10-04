import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { UserRecord } from 'firebase-functions/lib/providers/auth';
admin.initializeApp();

export const processSignUp = functions.auth.user().onCreate((user: UserRecord) => {
    if (user.email &&
        user.email.endsWith('bogdan.poslovsky@gmail.com') &&
        user.emailVerified) {
        const customClaims = {
            admin: true,
            accessLevel: 9
        };
        return admin.auth().setCustomUserClaims(user.uid, customClaims)
            .then(() => {
                console.log(`${user.email} is admin now`);
            })
            .catch(error => {
                console.log(error);
            });
    }
    return Promise.reject(`${user.email} is not admin`);

});
// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });
