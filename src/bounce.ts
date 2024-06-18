import * as dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';

dotenv.config();
const apiKey = process.env.BOUNCE_API_KEY;
console.log(`API Key: ${apiKey}`);

const app = express();
app.use(bodyParser.json());

/**
 * 2 ways of doing this:
 * 1. using an interface
 * 2. using any
 */

interface EmailValidationResponse {
    address: string;
    status: string;
}

/**
 * single email validation function using ZeroBounce API 
 * @param email 
 * @returns 
 */
const validateEmail = async (email: string) => {
    const url = `https://api.zerobounce.net/v2/validate?api_key=${apiKey}&email=${email}`;
    try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        const data = {
            "email": email
        }
        const requestOptions = {
            method: "GET",
            headers: myHeaders,
            data: JSON.stringify(data),
        };
        const response = await fetch(
            url,
            requestOptions
        );
        //const validation = await response.json() as EmailValidationResponse;
        // return validation.status;
        const validation = await response.json();
        return validation;
    } catch (error: any) {
        throw new Error(`Error searching for sequence: ${error}`);
    }
}

app.get('/validate-email/', async (req, res) => {
    const { email } = req.body;
    try {
        console.log(`Validating email: ${email}`);
        // const status = await validateEmail(email);
        // res.json({ message: 'Email validated successfully!', status });
        const status = await validateEmail(email);
        res.json({ message: 'Email validated successfully!', status });
    } catch (error) {
        console.error('Error validating email:', error);
        res.status(500).json({ message: 'Error validating email' });
    }
})

app.listen(3000, () => {
    console.log('Server running on port 3000');
});