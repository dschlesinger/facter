import type { RequestHandler } from './$types';

import type { Config } from '@sveltejs/adapter-vercel';
export const config: Config = {	runtime: 'edge',};

export const POST: RequestHandler = (async ({request}) => {
    const theInputs = await request.json();

    const response = await fetch('https://lexhack-api.denalischlesinger.com/analyze/url/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify( theInputs ),
    });

    if (!response.ok) {
        throw new Error(`Error: ${await response.text()}`)
    }

    const responseJSON = await response.json();
    
    const body = JSON.stringify(responseJSON);
    const headers = {
        'Content-Type': 'application/json',
    };
    return new Response(body, { headers });
    
}) satisfies RequestHandler;
