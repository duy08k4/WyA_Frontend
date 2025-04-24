
const getUserData = async () => {
    const serverResponse = await fetch(`${import.meta.env.VITE_SERVER_GATE}/getInfo`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    })
    .then(res => res.json())
    .then(data => {
        if (data.status == 498) {
            getUserData()
        } else {
            
        }
        return data
    })

    return serverResponse
}

export default { getUserData }