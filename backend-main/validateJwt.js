// var jwt = require('jsonwebtoken');
// var jwkToPem = require('jwk-to-pem');
// var fetch = require('node-fetch');

const admin  = require('./firebase');
const checkAuth = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1]; // split the token from the header
  if (!token) {
    return res.status(401).send('Unauthorized');
  }
  try {
    const decodedValue = await admin.auth().verifyIdToken(token); // verify the token
    if (decodedValue) {
      next();
    }
  } catch (error) {
    // console.log(error);
    return res.status(401).send('Unauthorized');
  }
};
// export default checkAuth;

module.exports=checkAuth;



// The function to validate a JWT.  
//
// For teaching purposes, the function is completely async
// and throws no exceptions.  
//
// In a production system, you'll want manage it differently
// 
// module.exports = async function validateJwt(req,res,next) {
// const authHeader = req.get('Authorization');
// let token;
// if (authHeader.startsWith("Bearer ")){
//      token = authHeader.substring(7, authHeader.length);
// } else {
//    //Error
// 	console.log("error");
// }




    // // First need to find out which key id is being used, we can get this from the header
    // let d = jwt.decode(token,{complete:true});
    // let kid = d.header['kid'];

    // // Retreive the public keys from google
    // data = await fetch('https://www.googleapis.com/oauth2/v3/certs');
    // certs = await data.json();

    // // Find the correct key
    // let key = certs.keys.filter( c => c.kid == kid );

    // // we now need to convert the certificate to pem format
    // let pem = jwkToPem(key[0]);

    // // We use the PEM cert to verify the token is signed by google
//     try {
// 	let result = await jwt.verify(token, pem);
// 	next();
//     } catch (e) {
// 	return JSON.parse(`{ "${e.name}": "${e.message}"}`);
//     }
// }
