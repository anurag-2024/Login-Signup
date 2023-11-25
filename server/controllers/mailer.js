import nodemailer from "nodemailer";
import Mailgen from "mailgen";

const sendMail = (req, res) => {
    const {username,email,text,subject}=req.body;
    let con={
        service:"gmail",
        auth:{
            user:process.env.EMAIL,
            pass:process.env.PASSWORD
        }
    }
    let transporter = nodemailer.createTransport(con);

    let mailGenerator = new Mailgen({
        theme: "default",
        product: {
            name: "My Website",
            link: "https://mailgen.js/",
        },
    });

    var response={
        body:{
            name:username,
            intro: text||"Welcome to our Website",
            outro:"Need help, or have questions? Just reply to this email, we'd love to help."
        }
    }
    var emailBody = mailGenerator.generate(response);
    let message={
        from:process.env.EMAIL,
        to:email,
        subject:subject||"Welcome",
        html:emailBody
    }
    transporter.sendMail(message)
    .then(()=>{
        return res.status(200).send({message:"Email sent"});
    })
    .catch((err)=>{
        return res.status(500).send(err.message);
    })
}
export default sendMail;