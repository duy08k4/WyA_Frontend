import { interface__LoginAccount__data } from "../types/interface__LoginAccount";

const loginAccount = async (data: interface__LoginAccount__data) => {
    const serverResponse = await fetch(`${import.meta.env.VITE_SERVER_GATE}/login-account`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
            data
        })
    })
        .then(res => res.json())
        .then(data => {
            return data
        })

    return serverResponse
}

export default loginAccount