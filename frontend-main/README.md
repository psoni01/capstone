# frontend

To install project properly, first delete node_modules folder and then type following command.
yarn install --frozen-lockfile



//////////////////////////////////////////////////////////////////////////////////////////////////////////////////

UPDATE!!!

Add ip.js file to path config/ in your local repository.

ip.js should be something like this 


const ip= `http://192.168.1.77:3000`;
export default ip;


change your local ip address.


use import ip from "config/ip";

example call
axiosRequest.get(`${ip}/getUser')

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////



following are legit user profiles:

email: psoni01@mylangara.ca
password: 123456

email: athulya01@mylangara.ca
password: 123456

email: John@gmail.com
password: 123456




    "react-native-gifted-chat": "^1.0.4",