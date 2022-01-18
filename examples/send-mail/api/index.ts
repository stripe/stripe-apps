import express from 'express';
import sgMail from '@sendgrid/mail';
import 'dotenv/config';

const app = express();
app.use(express.json());

app.post("/api/email", async (request, response) => {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);
    const mailData = {
        from: request.body.from,
        to:  request.body.to,
        subject:  request.body.subject,
        text:  request.body.text,
    };
    const result = await sgMail.send(mailData);
    response.send({
        result
    });
});

app.listen(4242, () => console.log("Node server listening on port 4242!"));