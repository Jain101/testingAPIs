import * as dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

dotenv.config();
const apiKey = process.env.LGM_API_KEY;
console.log(`API Key: ${apiKey}`);

const app = express();
app.use(bodyParser.json());

async function createLeadForAudience(audience: string, linkedinUrl: string, firstname: string, lastname: string) {
    const url = `https://apiv2.lagrowthmachine.com/flow/leads?apikey=${apiKey}`;
    try {
        const response = await axios.post(url, {
            audience,
            linkedinUrl,
            firstname,
            lastname,
        });
        return response.data;
    } catch (error) {
        throw new Error(`Error creating lead: ${error}`);
    }
}
async function createAudience(audience: string, linkedinUrl: string, identityId: string) {
    const url = `https://apiv2.lagrowthmachine.com/flow/audiences?apikey=${apiKey}`;
    try {
        const response = await axios.post(url, {
            audience: audience,
            linkedinUrl: linkedinUrl,
            identityId: identityId,
        });
        return response.data;
    } catch (error) {
        throw new Error(`Error creating audience`);
    }
};

app.post('/create-lead', async (req, res) => {
    const { audience, linkedinUrl, firstname, lastname } = req.body;
    try {
        console.log(`Creating lead for audience: ${audience}`);
        const lead = await createLeadForAudience(audience, linkedinUrl, firstname, lastname);
        res.json({ message: 'Lead created successfully!', lead });
    } catch (error) {
        console.error('Error creating lead:', error);
        res.status(500).json({ message: 'Error creating lead' });
    }
});

app.post('/create-audience', async (req, res) => {
    const { audience, linkedinUrl, identityId } = req.body;
    if (!audience || !linkedinUrl || !identityId) {
        return res.status(400).json({ message: 'Field is required' });
    }
    try {
        const createdAudience = await createAudience(audience, linkedinUrl, identityId);
        res.status(201).json(createdAudience);
    } catch (error) {
        res.status(500).json({ message: 'Failed to create audience'});
    }
})
app.get('/campaigns', async (req, res) => {
    const url = `https://apiv2.lagrowthmachine.com/flow/campaigns?apikey=${apiKey}&skip=0&limit=10`;
    try {
        const response = await axios.get(url);
        res.json(response.data);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch campaigns' });
    }
})

app.listen(3000, () => {
    console.log('Server running on port 3000');
});