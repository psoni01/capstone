// import axiosRequest from "../../config/axiosRequest";

// here to parameter is the expotoken of the user to which you want to send the notification.
// to get user expo token by email , simply call axiosRequest.get(`${ip}/getExpoTokenByEmail/psoni01@mylangara.ca`).
// to get user expo token by email , simply call axiosRequest.get(`${ip}/getExpoTokenByID/63519786034b5793ccaff24f`).
const sendPushNotification = async (to, title = 'Original Title', body =  'And here is the body!') => {
    const message = {
        to: to,
        sound: 'default',
        title: title,
        body: body,
        data: { someData: 'goes here' },
      };
    

      await fetch('https://exp.host/--/api/v2/push/send', {
    method: 'POST',
    headers: {
      Accept: 'application/json',
      'Accept-encoding': 'gzip, deflate',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(message),
  });


} 

export default sendPushNotification;