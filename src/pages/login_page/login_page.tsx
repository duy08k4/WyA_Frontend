// Import library
import { IonPage } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";

// Import custom hooks
import { useToast } from "../../hooks/toastMessage/toast";
import { useSpinner } from "../../hooks/spinner/spinner";
import { useCache } from "../../hooks/cache/cache";

import { cacheSetGmail } from "../../redux/reducers/user.reducer";

// Import services
import loginAccount from "../../services/login_account.serv";

// Import images
import avartarApp from "../../assets/logo.png"

// Import css
import "./login_page.css"
import "../../main.css"

export default function LoginPage() {
    // State
    const [hidepassword, setHidepassword] = useState(true);
    const [checkData, setCheckData] = useState<boolean>(false)
    const redirect = useHistory()

    // Custom hooks
    const { addToast } = useToast()
    const { openSpinner, closeSpinner } = useSpinner()
    const { cacheSetData } = useCache()

    // Data
    const [gmail, setGmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")

    // Error
    const [errorGmail, setErrorGmail] = useState<string>("")
    const [errorPassword, setErrorPassword] = useState<string>("")

    // Handler
    // Check gmail
    const checkGmail = (gmail: string) => {
        let returnError = ""
        if (gmail === "") {
            returnError = "Please enter your gmail"
            setCheckData(false)
        } else {
            const gmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,}$/;
            if (!gmailRegex.test(gmail)) {
                returnError = "Invalid email format"
            }
        }

        if (returnError == "") setCheckData(true)

        setErrorGmail(returnError)
    }

    useEffect(() => {
        checkGmail(gmail)
    }, [gmail])

    // Check password
    const checkPassword = (password: string) => {
        let returnError = ""
        if (password == "") {
            returnError = "Please enter your gmail"
        }

        if (returnError == "") setCheckData(true)

        setErrorPassword(returnError)
    }

    useEffect(() => {
        checkPassword(password)
    }, [password])

    const toggleTypePassword = () => setHidepassword(!hidepassword);

    // Handle login
    const handleLogin = async () => {
        if (checkData) {
            openSpinner()
            await loginAccount({
                gmail,
                passwordInput: password
            }).then((res) => {
                closeSpinner()
                if (res.status == 200) {
                    cacheSetData(cacheSetGmail(res.data.user.gmail))
                    setGmail("")
                    setPassword("")
                    redirect.push("/")
                } else {
                    addToast({
                        typeToast: "e",
                        content: res.data.mess,
                        duration: 5
                    })
                }
            }).catch((err) => {
                closeSpinner()
                addToast({
                    typeToast: "e",
                    content: err,
                    duration: 5
                })
            })
        } else {
            addToast({
                typeToast: "e",
                content: "Please fill the form",
                duration: 5
            })
        }
    }

    return (
        <IonPage>
            <div className="loginPage">
                <div className="loginPage__loginForm">
                    <div className="loginPage__element loginPage__element--headerBox">
                        <img className="loginPage__header--icon" src={avartarApp} alt="Logo" />
                        <h1 className="loginPage__header--content">Welcome to WyA</h1>
                    </div>

                    <div className="loginPage__element loginPage__element--inputForm">
                        <div className="loginPage__inputContainer loginPage__inputContainer--username">
                            <div className="loginPage__inputBox">
                                <i className="fa-regular fa-envelope inputUsernameIcon"></i>
                                <input className="loginPage__input" type="text" onChange={(e) => { setGmail(e.target.value) }} value={gmail} placeholder="Gmail..." />
                            </div>

                            <p className="loginPage__announce">{errorGmail}</p>
                        </div>

                        <div className="loginPage__inputContainer loginPage__inputContainer--password">
                            <div className="loginPage__inputBox">
                                <i className="fa-solid fa-fingerprint inputPasswordIcon"></i>
                                <input className="loginPage__input" type={hidepassword ? "password" : "text"} onChange={(e) => { setPassword(e.target.value) }} value={password} placeholder="Password..." />
                                <i className="fa-solid fa-eye" onClick={toggleTypePassword}></i>
                            </div>

                            <p className="loginPage__announce">{errorPassword}</p>
                        </div>

                        <div className="loginPage__forgotPasswordBox">
                            <a className="loginPage__forgotPasswordBox--forgotPasswordDirection" href="#">Forgot password?</a>
                        </div>
                    </div>

                    <div className="loginPage__element loginPage__element--btnForm">
                        <button className="btnForm--btn" onClick={handleLogin}>Sign in</button>
                    </div>

                    <div className="loginPage__element loginPage__element--signupAccount">
                        <a className="loginPage__element--signupDirection" href="/register">Create an new account</a>
                    </div>
                </div>
            </div>
        </IonPage>
    )
}