import * as dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';

dotenv.config();
const api_key = process.env.PREDICT_API_KEY;
const access_token = process.env.PREDICT_TOKEN;
console.log(`API Key: ${api_key}`);

const app = express();
app.use(bodyParser.json());

const findJobsUsingPredictLeads = async (
    domain: string,
    department: string[] = [],
    jobTitle: string[] = [],
    jobDescription: string[] = [],
    days: number = 0,
    callbackId: string) => {
    const url = `https://api.clay.com/v3/sources/webhook/pull-in-data-from-a-webhook-f09b5d57-efbe-4423-a863-8be7a2d79878`;
    
    try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");

        const body = {
            domain,
            department,
            jobTitle,
            jobDescription,
            days,
            testInt: callbackId
        };
        
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(body),
        };
        
        const res = await fetch(
            url,
            requestOptions
        );
        const response = await res.json();
        return response;
    } catch (error: any) {
        throw new Error(`Error fetching jobs in: ${domain}`);
    }
}

app.post('/find-jobs', async (req, res) => {
    const { domain, departments = [], jobTitles = [], jobDescriptions = [], jobPostedDays = [] } = req.body;
    console.log('Request body:', req.body);
    
    try {
        console.log(`finding jobs in: ${domain}`);
        const response = await findJobsUsingPredictLeads(domain, departments, jobTitles, jobDescriptions, jobPostedDays, 'test');

        res.json({ message: 'linkedin URL found successfully!', response });
    } catch (error) {
        console.error('Error finding jobs:', error);
        res.status(500).json({ message: 'Error finding jobs' });
    }
})

app.listen(3000, () => {
    console.log('Server running on port 3000');
});