import axios from "axios";
import {Buffer} from 'buffer'


export const deliverSMS = async () => {
//   const accessToken = 'XYd6LedvdAMXjNUmzOQ2fZ9ssKWn';
//   const data = {
//     to: ["+27832008963", "+27832008981", "+27832090015"],  // list of phone numbers
//     body: "Welcome to the Bozza network",                   // SMS message content
//     from: "34001",                                          // Sender identity
//     notificationURL: "http://yourdomain.com/callbackurl",    // (Optional) URL for status updates
//     clientId: "Vabs7GBVI0mMYdEcNe72btv6SFTIqjKi"                                  // (Optional) App identifier
//   };

//   try {
//     const response = await axios.post(
//       'https://api.mtn.com/v1/messages/sms',  // MTN SMS API endpoint
//       data,                                 // Pass the data as the request body
//       {
//         headers: {
//           'Authorization': `Bearer ${accessToken}`,  // Authorization header with Bearer token
//           'Content-Type': 'application/json',         // JSON content type
//         },
//       }
//     );
//     console.log('Response:', response.data);  // Log the response from the API
//   } catch (error) {
//     if (error.response) {
//       console.error('Error Response:', error.response.data);
//       console.error('Status:', error.response.status);
//     } else {
//       console.error('Error:', error.message);
//     }
//   }
const url = 'https://api.mtn.com/v3/sms/messages/sms/outbound'
const options = {
    method: 'POST',
    headers: {'Content-Type': 'application/json', 'Authorization': "rX3s94JR2srGVuV0lxrmeYv7jDhH",},
    data: {
    senderAddress: 'MTN',
    receiverAddress: '+2347061608636',
    message: 'string',
    clientCorrelatorId: 'string',
    keyword: 'string',
    serviceCode: '11221 or 131',
    requestDeliveryReceipt: false
    }
  };
  
axios.post(url,options).then(res => console.log(res)).catch(err => console.error(err))
};



export const sendSMS = async ()=> {

    try {
        fetch("https://api.mtn.com/v1/messages/sms", {
            "method": "POST",
            "headers": {
              "Content-Type": "application/json",
                'Authorization': "Bearer XYd6LedvdAMXjNUmzOQ2fZ9ssKWn",
            },
            "body": "{\"to\":[\"+2347061608636\",\"+27832008981\",\"+27832090015\"],\"body\":\"Welcome to the Bozza network\",\"from\":\"+2347061608636\",\"notificationURL\":\"http://domian.co.za/callbackurl\",\"clientId\":\"sendingSMS\"}"
          })
          .then(response => {
            console.log(response);
          })
          .catch(err => {
            console.error(err);
          });
    } catch (err) {
        console.log(err)
    }
}


export const sendingSMS = async () => {
    const token = 'XYd6LedvdAMXjNUmzOQ2fZ9ssKWn'; // Retrieved from the token endpoint
  
    const response = await axios.post(
      'https://api.mtn.com/v1/messages/sms',
      {
        to: ["+2348012345678"],
        body: "Hello from MTN API",
        from: "34001"
      },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      }
    );
    
    console.log(response.data);
  };

export const getAccessToken = async () => {
  const client_id = '3qPaB2L3GRBD88Agacg3nbEgGFaXGRrF'; // Consumer Key
  const client_secret = 'SwE91S3CTiwSGCDS'; // Client Secret
  
  // Base64 encode the client_id and client_secret
  const base64Auth = Buffer.from(`${client_id}:${client_secret}`).toString('base64');
  
  try {
    const response = await axios.post(
      'https://api.mtn.com/v1/oauth/access_token/accesstoken?grant_type=client_credentials',
      null,  // No body parameters needed for Basic Auth
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${base64Auth}`
        },
        params: {
          grant_type: 'client_credentials'  // Ensure this is included
        }
      }
    );
    console.log('Access Token:', response.data.access_token);
    return response.data.access_token;
  } catch (error) {
    console.error('Error fetching access token:', error.response ? error.response.data : error.message);
  }
};


const sendSMSS = async () => {
    const accessToken = 'rU7UnvdypneLuy3204Mj4IwUOADG'
     //
const options = {
    method: 'POST',
    url: 'https://api.mtn.com/v3/sms/',
        params: {
          grant_type: 'client_credentials',
          client_id: '3qPaB2L3GRBD88Agacg3nbEgGFaXGRrF',
          client_secret: 'SwE91S3CTiwSGCDS',
        },
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${accessToken}`, // Add the Bearer token for authorization
    },
    data: {
      senderAddress: 'MTN',  // Sender address (can be a shortcode or name)
      receiverAddress: ['+23423456789', '23423456790'],  // List of recipient phone numbers
      message: 'Hello, this is a test message from MTN!',  // The SMS message to send
      clientCorrelatorId: 'unique-id-12345',  // Unique correlator ID to track the request
      keyword: 'your-keyword',  // Optional, can be used for certain services
      serviceCode: '312',  // Service code for MTN services (e.g., for certain types of SMS)
      requestDeliveryReceipt: false,  // Whether to request a delivery receipt
    },
  };

  try {
    const response = await axios.request(options);
    console.log('SMS Sent:', response.data);
  } catch (error) {
    console.error('Error Sending SMS:', error.response?.data || error.message);
  }
};

// sendSMSS();

// rU7UnvdypneLuy3204Mj4IwUOADG

// XYd6LedvdAMXjNUmzOQ2fZ9ssKWn
// the second one
// VEL0x44b8Zz7PfEDhblxKgpNNO3H
// rX3s94JR2srGVuV0lxrmeYv7jDhH

// 743caac5-4cc1-4d5d-8968-e7225dfe7207

