const wakeUpServer = async () => {
    const serverResponse = await fetch(`${import.meta.env.VITE_SERVER_GATE}/wake`,{
        method: "GET",
        headers: {"Content-Type": "application/json"},
        credentials: "include", 
    })
    .then(res => res.json())
    .then(data => {
        return data
    })

    return serverResponse
}

export default wakeUpServer