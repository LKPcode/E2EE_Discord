const DOMAIN = 'http://localhost'
const PORT = '3000'


export default function () {
 // General Fetch GET request
 const fetchGET = async (url:string, options:any) => {
    const res = await fetch( DOMAIN + ":" + PORT + url, {
        method: 'GET',
        headers: {
            'Content-type': 'application/json',
        }
    })
    const data = await res.json()

    if (!res.ok) {
        throw data
    }

    console.log( options?.about ,data)
    return data
}


// General Fetch POST request
const fetchPOST = async (url:string, post_data:any, options:any) => {
    console.log("Sending data to server: ", post_data)
    const res = await fetch(DOMAIN + ":" + PORT + url, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json'
        },
        body: JSON.stringify(post_data)
    })

    const data = await res.json()

    if (!res.ok) {
        throw data
    }
    console.log( options?.about ,data)

    return data
}

return {
    fetchGET,
    fetchPOST
}
}

