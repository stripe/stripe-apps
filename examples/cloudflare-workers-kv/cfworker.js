/**
 * This is a copy of the code running in a Cloudflare Worker
 */
const responseHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET,HEAD,POST,OPTIONS",
    "Access-Control-Max-Age": "86400"
}

addEventListener("fetch", (event) => {
    const request = event.request

    if (request.method === "OPTIONS") {
        // Handle CORS preflight requests
        event.respondWith(handleOptions(request))
    } else {
        event.respondWith(
        handleRequest(event.request).catch(
            (err) => new Response(err.stack, { status: 500 })
        )
        );
    }
});

/**
 * Handle Options
 * Handle pre-flight request for CORS
 */
async function handleOptions(request) {
    return new Response(null, {
        headers: {
        ...responseHeaders,
        "Access-Control-Allow-Headers": request.headers.get("Access-Control-Request-Headers")
        }
    })
}

/**
 * Handle Requests
 * Get & Set Greetings from the linked WorkersKV
 * @param {Request} request
 * @returns {Promise<Response>}
 */
async function handleRequest(request) {
    const { pathname } = new URL(request.url);
    const apiPath = '/greeting/'

    if (pathname.startsWith(apiPath)) {
        if (request.method === "GET") {
        // fetch from the key-value store
        const greetingId = pathname.substring(apiPath.length)
        const greeting = await GREETINGS.get(greetingId)
        if (greeting === null) {
            return new Response("Value not found", {status: 404})
        }
        return new Response(greeting, { headers: responseHeaders })
        }

        if (request.method === "POST") {
        // update the workers key-value store
        try {
            const body = await request.json()
            if (body.key && body.greeting) {
            await GREETINGS.put(body.key, body.greeting)
            return new Response('success!', { headers: responseHeaders })
            }
        }
        catch (error) {
            throw new Error('Could not save.')
        }
        }
    }

    throw new Error('Invalid Request');
}
