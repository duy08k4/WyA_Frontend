const logoutAccount = async () => {
    const serverResponse = await fetch(`${import.meta.env.VITE_SERVER_GATE}/logout-account`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
    })
        .then(res => res.json())
        .then(data => {
            return data
        })

    return serverResponse
}

export default logoutAccount