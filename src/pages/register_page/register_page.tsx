// Import libraries
import { IonPage } from "@ionic/react";
import React, { use, useEffect, useState } from "react";

// Import components
import Register__verifyAccount from "../../components/register__verifyAccount/register__verifyAccount";

// Import custom hooks
import { useToast } from "../../hooks/toastMessage/toast";
import { useSpinner } from "../../hooks/spinner/spinner";

// Import services
import sendOTP from "../../services/send_OTP.serv";

// Import images
import avartarApp from "../../assets/logo.png"

// Import css
import "./register_page.css"
import "../../main.css"

const RegisterPage: React.FC = () => {
    // State
    const [checkData, setCheckData] = useState<boolean>(true) // Check data (username, gmail, password) is valid or not
    const [isVerification, setIsVerification] = useState<boolean>(false)

    // Custom hooks
    const { addToast } = useToast()
    const { openSpinner, closeSpinner } = useSpinner()

    // Error message
    const [errorUsername, setErrorUsername] = useState<string>("")
    const [errorGmail, setErrorGmail] = useState<string>("")
    const [errorPassword, setErrorPassword] = useState<string>("")
    const [errorConfirmPassword, setErrorConfirmPassword] = useState<string>("")

    // Data
    const [username, setUsername] = useState<string>("")
    const [gmail, setGmail] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")

    // Handler
    const checkUsername = (username: string) => {
        let returnError = ""
        if (username == "") {
            returnError = "Please enter your username"
            setCheckData(false)
        } else {
            if (username.length >= 20) {
                returnError = "Username must be less than 10 characters"
                setCheckData(false)
            }
        }

        if (returnError == "") setCheckData(true)

        setErrorUsername(returnError)

    }

    useEffect(() => {
        checkUsername(username)
    }, [username])


    // 
    const checkGmail = (gmail: string) => {
        let returnError = ""

        if (gmail === "") {
            returnError = "Please enter your gmail"
            setCheckData(false)
        } else {
            const gmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{3,}$/;
            if (!gmailRegex.test(gmail)) {
                returnError = "Invalid email format"
                setCheckData(false)
            }
        }

        if (returnError == "") setCheckData(true)

        setErrorGmail(returnError)
    }

    useEffect(() => {
        checkGmail(gmail)
    }, [gmail])


    // 
    const checkPassword = (password: string) => {
        let returnError = ""
        if (password == "") {
            returnError = "Please enter your password"
            setCheckData(false)
        } else {
            if (password.length < 8 || password.length > 20) {
                returnError = "Password must be between 8 and 20 characters"
                setCheckData(false)
            }

            if (password.toLowerCase() === password) {
                returnError = "Password must contain at least one uppercase letter"
                setCheckData(false)
            }

            const findNumber = /\d/;
            if (!findNumber.test(password)) {
                returnError = "Password must contain at least one number"
                setCheckData(false)
            }
        }

        if (returnError == "") setCheckData(true)

        setErrorPassword(returnError)
    }

    useEffect(() => {
        checkPassword(password)
    }, [password])


    // 
    const checkConfirmPassword = (confirmPassword: string) => {
        let returnError = ""

        if (confirmPassword == "") {
            returnError = "Please enter your confirm password"
            setCheckData(false)
        } else {
            if (confirmPassword != password) {
                returnError = "Confirm password is incorrect"
                setCheckData(false)
            }
        }
        if (returnError == "") setCheckData(true)

        setErrorConfirmPassword(returnError)
    }

    useEffect(() => {
        checkConfirmPassword(confirmPassword)
    }, [confirmPassword])

    const handleInfo = async () => {
        if (checkData) {
            // Gọi service để gửi mã OTP (Backend cần tạo 1 API để gửi mã)
            openSpinner()
            // const sendOTP_response = await sendOTP({ gmail })
            await sendOTP({ method: "send", gmail }).then((res) => {
                closeSpinner()
                setIsVerification(true)
                if (res.status == 200) {
                    addToast({
                        typeToast: "i",
                        content: res.data.mess,
                        duration: 5
                    })
                } else {
                    addToast({
                        typeToast: "w",
                        content: res.data.mess,
                        duration: 5
                    })
                }
            })

        } else {
            addToast({
                typeToast: "e",
                content: "Please fill the form",
                duration: 5
            })
        }
    }

    const handleCloseVerification = (state: boolean, clearForm: boolean) => {
        setIsVerification(state)

        if(clearForm) {
            setUsername("")
            setGmail("")
            setPassword("")
            setConfirmPassword("")
        }
    }


    return (
        <IonPage>
            <div className="registerPage">
                <div className="registerPage__registerForm">
                    <div className="registerPage__element registerPage__element--headerBox">
                        <img className="registerPage__header--icon" src={avartarApp} alt="Logo" />
                        <h1 className="registerPage__header--content">Come join us</h1>
                    </div>

                    <div className="registerPage__element registerPage__element--inputForm">
                        <div className="registerPage__inputContainer registerPage__inputContainer--username">
                            <div className="registerPage__inputBox">
                                <i className="fa-regular fa-user inputUsernameIcon"></i>
                                <input className="registerPage__input" type="text" onChange={(e) => { setUsername(e.target.value) }} value={username} placeholder="Username..." />
                            </div>

                            <p className="registerPage__announce">{errorUsername}</p>
                        </div>

                        <div className="registerPage__inputContainer registerPage__inputContainer--gmail">
                            <div className="registerPage__inputBox">
                                <i className="fa-regular fa-envelope inputGmailIcon"></i>
                                <input className="registerPage__input" type="text" onChange={(e) => { setGmail(e.target.value) }} value={gmail} placeholder="Gmail..." />
                            </div>

                            <p className="registerPage__announce">{errorGmail}</p>
                        </div>

                        <div className="registerPage__inputContainer registerPage__inputContainer--password">
                            <div className="registerPage__inputBox">
                                <i className="fa-solid fa-fingerprint inputPasswordIcon"></i>
                                <input className="registerPage__input" type="text" onChange={(e) => { setPassword(e.target.value) }} value={password} placeholder="Password..." />
                            </div>

                            <p className="registerPage__announce">{errorPassword}</p>
                        </div>

                        <div className="registerPage__inputContainer registerPage__inputContainer--confirmPassword">
                            <div className="registerPage__inputBox">
                                <i className="fa-solid fa-fingerprint inputConfirmPasswordIcon"></i>
                                <input className="registerPage__input" type="text" onChange={(e) => { setConfirmPassword(e.target.value) }} value={confirmPassword} placeholder="Confirm password..." />
                            </div>

                            <p className="registerPage__announce">{errorConfirmPassword}</p>
                        </div>
                    </div>

                    <div className="registerPage__element registerPage__element--btnForm">
                        <button className="btnForm--btn" onClick={handleInfo}>Sign up</button>
                    </div>

                    <div className="registerPage__element registerPage__element--signinAccount">
                        <a className="registerPage__element--signinDirection" href="/login">Already have account?</a>
                    </div>
                </div>

                {isVerification && (
                    <Register__verifyAccount data={{ username, gmail, password }} closeVerification={handleCloseVerification} />
                )}
            </div>
        </IonPage>
    )
}

export default RegisterPage