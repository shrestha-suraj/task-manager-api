const sgMail=require('@sendgrid/mail')
const sendgridAPIkey=process.env.SENDGRID_API_KEY
sgMail.setApiKey(sendgridAPIkey)

const sendWelcomeEmail=(email,name)=>{
    const message={
        to:email,
        from:'shresthasuraj62@gmail.com',
        subject:`Welcome to the App ${name}`,
        text:`${name}, Thank you for joinging the team.`
    }
    sgMail.send(message)
}
const sendDeleteEmail=(email,name)=>{
    const message={
        to:email,
        from:'shresthasuraj62@gmail.com',
        subject:`We are sorry to see you go.`,
        text:`${name}, we would like to know why you are leaving us. Please provide us feedback at shresthasuraj62@gmail.com`
    }
    sgMail.send(message)
}

module.exports={
    sendWelcomeEmail,
    sendDeleteEmail
}
