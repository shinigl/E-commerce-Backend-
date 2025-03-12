const nodemailer = require("nodemailer") ;
const dotenv=require("dotenv");
dotenv.config();
/**
 * 1. Initialize nodemailer( a transport layer)
 * 2. Setup the email configuration (from , to , subject , body ect)
 * 3. Send the mail
 */

const transporter = nodemailer.createTransport({
    host:process.env.SMTP_HOST,//Hostname of SMTP Server
    port:process.env.SMTP_PORT,// Post of SMTP Server
    secure:false
    
})

// gmail to send email 
// const transporter = nodemailer.createTransport({
//     host:"smtp.gmail.com",//Hostname of SMTP Server
//     port:"587",// Post of SMTP Server
//     secure:false,
//     tls:{
//     }
// })


// we send html also in html key 


const  sendEmail=({
    toEmail,
    subject,
    orderDetails
})=>{
    const mailOption ={
        from:"do-not-reply@myecommstore.com",
        to:toEmail,
        subject:subject,
        text:"Test email body"
    }
    transporter.sendMail(mailOption,(err,info)=>{
        if(err){
            console.log("Error Sending Email ", err);
            return
            
        }
        console.log("Email Sent SuccessFully",info)
    })
}


module.exports = sendEmail;
