import type { RequestHandler } from './$types';

export const POST: RequestHandler = (async ({request}) => {
    const inputsPred = await request.json();

    const response = await fetch('https://lexhack-api.denalischlesinger.com/predict/url/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }, 
        body: JSON.stringify( inputsPred ),
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
