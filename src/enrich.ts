import * as dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';

dotenv.config();
const access_token = process.env.ENRICH_TOKEN;
console.log(`API Key: ${access_token}`);

const app = express();
app.use(bodyParser.json());

const findLinkedinUsingEmail = async (email: string) => {
    const url = `https://api.enrich.so/v1/api/person?email=${email}`;
    try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("Authorization", `Bearer ${access_token}`)
        const data = {
            "email": email
        }
        
        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            data: JSON.stringify(data),
        };
        const res = await fetch(
            url,
            requestOptions
        );
        const response = await res.json();
        return response;
    } catch (error: any) {
        throw new Error(`Error searching for linkedin URL: ${error}`);
    }
}

app.get('/find-linkedin', async (req, res) => {
    const { email } = req.body;
    try {
        console.log(`finding linkedin URL using email: ${email}`);
        const status:any = await findLinkedinUsingEmail(email);
        res.json({ message: 'linkedin URL found successfully!', linkedinURL: status.linkedInUrl });
    } catch (error) {
        console.error('Error finding linkedin URL:', error);
        res.status(500).json({ message: 'Error finding linkedin URL' });
    }
})

app.listen(3000, () => {
    console.log('Server running on port 3000');
});