import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { UserRecord } from 'firebase-functions/lib/providers/auth';
admin.initializeApp();

export const processSignUp = functions.auth.user().onCreate((user: UserRecord) => {
    if (user.email &&
        user.email.endsWith('bogdan.poslovsky@gmail.com')) {
        const customClaims = {
            admin: true,
            accessLevel: 9
        };
        return admin.auth().setCustomUserClaims(user.uid, customClaims)
            .then(() => {
                const metadataRef = admin.database().ref("metadata/" + user.uid);
                return metadataRef.set({refreshTime: new Date().getTime()});
            })
            .catch((error: Error) => {
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
