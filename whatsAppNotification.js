import twilio from  'twilio';
const accountSid = process.env.ACCOUNNT_SID;
const authToken = process.env.AUTH_TOKEN;

const client = twilio(accountSid,authToken)



export const sendWhatsAppNotification = async (body)=> {
        client.messages.create({
            body: body,
            to: 'whatsapp:+2349017153812', // Text your number
            from: 'whatsapp:+14155238886',
        })
        .then((message) => console.log(message.sid))
        .catch(err => console.log(err))
    }

