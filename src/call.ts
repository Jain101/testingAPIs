import * as dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';

dotenv.config();
const access_token = process.env.ENRICH_TOKEN;
console.log(`API Key: ${access_token}`);

const app = express();
app.use(bodyParser.json());


const httpApiCall = async (
    method: string,
    endpoint: string,
    queryParams: any[] = [],
    body: any = null,
    headers: any[] = []
): Promise<any> => {
    try {
        // Construct URL
        const queryString = new URLSearchParams();
        queryParams.forEach(param => {
            for (const key in param) {
                queryString.append(key, param[key]);
            }
        });
        const uri = `${endpoint}?${queryString}`;
        const url = decodeURIComponent(uri);
        
        // Construct headers
        const myHeaders = new Headers();
        headers.forEach(header => {
            for (const key in header) {
                myHeaders.append(key, header[key]);
            }
        });
        
        const requestOptions = {
            method: method,
            headers: myHeaders,
            body: body ? JSON.stringify(body) : null,
        };
        console.log('Request Options:', requestOptions);
        const res = await fetch(
            url,
            requestOptions
        );
        const response = await res.json();
        return response;
    } catch (error: any) {
        throw new Error(`Error searching for linkedin URL: ${error}`);
    }
};


app.get('/http-call/', async (req, res) => {
    const { method, endpoint, queryParams, body, headers } = req.body;
    try {
        console.log(`Validating call: ${method}`);
        // const status = await validateEmail(email);
        // res.json({ message: 'Email validated successfully!', status });
        const response: any = await httpApiCall(method, endpoint, queryParams, body, headers);
        res.json({ message: 'Email validated successfully!', linkedinUrl: response.linkedInUrl });
    } catch (error) {
        console.error('Error validating email:', error);
        res.status(500).json({ message: 'Error validating email' });
    }
})

app.listen(3000, () => {
    console.log('Server running on port 3000');
});