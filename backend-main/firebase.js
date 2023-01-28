// import * as firebaseAdmin from 'firebase-admin';
const firebaseAdmin = require('firebase-admin');
// initialize firebase admin
const admin = firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert('./service.json'),
});
// idToken comes from the client app
// getAuth()
//   .verifyIdToken(idToken)
//   .then((decodedToken) => {
//     const uid = decodedToken.uid;
// ...
// })
// .catch((error) => {
// Handle error
//});
// export { admin };

module.exports=admin;