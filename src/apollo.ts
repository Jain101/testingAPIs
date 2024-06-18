import * as dotenv from 'dotenv';
import express from 'express';
import bodyParser from 'body-parser';
import axios from 'axios';

dotenv.config();
const apiKey = process.env.APOLLO_API_KEY;
console.log(`API Key: ${apiKey}`);

const app = express();
app.use(bodyParser.json());

/* 
It is behaving in a weird way - 
it is returning all sequences, 
then what's the need of passing parameter? 
I think we can take all the sequences and search for the sequence name in the response.

I see now, 
seq_name = null - return all sequences
seq_name = "name" - return all sequences with name
seq_name = "x" - return all sequences starting with x
*/

/**
 * 
 * @param seq_name 
 * @returns all sequences
 */
async function searchSequences(seq_name: string) {
    const url = `https://api.apollo.io/v1/emailer_campaigns/search`;
    try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Api-Key", `${apiKey}`);
        const data = {
            q_name: seq_name,
        }
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(data),
        };
        const response = await fetch(
            url,
            requestOptions
        );
        const sequence = await response.json();
        // if(!response.ok) {
        //     throw new Error(`Error searching for sequence: ${sequence.error}`);
        // }
        return sequence;
    } catch (error: any) {
        throw new Error(`Error searching for sequence: ${error}`);
    }
}

async function addContactsToSequence(seq_id: string, contact_ids: string[], campaign_id: string) {
    const url = `https://api.apollo.io/v1/emailer_campaigns/${seq_id}/add_contact_ids`;
    try {
        const myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/json");
        myHeaders.append("X-Api-Key", `${apiKey}`);
        const data = {
            contact_ids,
            emailer_campaign_id: campaign_id,
            send_email_from_email_account_id: process.env.EMAIL_ACCOUNT_ID,
        }
        const requestOptions = {
            method: "POST",
            headers: myHeaders,
            body: JSON.stringify(data),
        };
        const response = await fetch(
            url,
            requestOptions
        );
        const addedContacts: any = await response.json();
        console.log('hey');

        // if (!response.ok) {
        //     throw new Error(`Error adding contacts to sequence: ${addedContacts.error}`);
        // }
        return addedContacts;
    } catch (error: any) {
        throw new Error(`Error adding contacts to sequence: ${error}`);
    }
}

app.post('/search-sequences', async (req, res) => {
    const { seq_name } = req.body;
    try {
        console.log(`Searching for sequence: ${seq_name}`);
        const sequence = await searchSequences(seq_name);
        res.json({ message: 'Sequence found!', sequence });
    } catch (error) {
        console.error('Error searching for sequence:', error);
        res.status(500).json({ message: 'Error searching for sequence' });
    }
});

app.post('/add-contacts-to-sequence', async (req, res) => {
    const { seq_id, contact_ids, campaign_id } = req.body;
    if (!seq_id || !contact_ids || !campaign_id) {
        return res.status(400).json({ message: 'Field is required' });
    }
    try {
        const addedContacts = await addContactsToSequence(seq_id, contact_ids, campaign_id);
        res.status(201).json(addedContacts);
    } catch (error) {
        console.error('Error adding contacts to sequence:', error);
        res.status(500).json({ message: 'Error adding contacts to sequence' });
    }
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});