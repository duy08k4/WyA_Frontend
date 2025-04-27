// Import interface

// Service
const searchUser = async (searchContent: string) => {
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,}$/;
    const typeSearch =  gmailRegex.test(searchContent) ? "gmail" : "username"

    const serverResponse = await fetch(`${import.meta.env.VITE_SERVER_GATE}/search-user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
            data: {
                type: typeSearch,
                searchContent: searchContent
            }
        })
    })
        .then(res => res.json())
        .then(data => {
            console.log("data", data.data.result)
            return data.data.result
        })

    return serverResponse
}

export default searchUser