// Import library
import { IonPage } from "@ionic/react";
import React from "react";

import { useState } from "react";
import { useHistory } from "react-router";

// Import components

// Import services
import { forgotPassword, forgotPassword_sendOTP } from "../../services/forgotPassword.serv";

// Import custom hook
import { useSpinner } from "../../hooks/spinner/spinner";
import { useToast } from "../../hooks/toastMessage/toast";

// Import css
import "./forgotpassword_page.css"
import "../../main.css"

const ForgotPassword: React.FC = () => {
    // State
    const [verifystate, setVerifystate] = useState<boolean>(false);
    const redirect = useHistory()


    // Data
    const [gmail, setGmail] = useState<string>("");
    const [verifyCode, setVerifyCode] = useState<string>("")
    const [password, setPassword] = useState<string>("")
    const [confirmPassword, setConfirmPassword] = useState<string>("")

    // Custom hook
    const { openSpinner, closeSpinner } = useSpinner()
    const { addToast } = useToast()

    // Error
    const [errorGmail, setErrorGmail] = useState<string>("");
    const [errorVerify, setErrorVerify] = useState<string>("");
    const [errorPassword, setErrorPassword] = useState<string>("");
    const [errorConfirmPassword, setErrorConfirmPassword] = useState<string>("");

    // Handler
    const handleSendVefifyCode = async () => {
        const gmailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!gmailRegex.test(gmail)) {
            setErrorGmail("Invalid email format");
        }
        else {
            setErrorGmail("");
            openSpinner()
            await forgotPassword_sendOTP({
                gmail: gmail
            }).then((data) => {
                if (data.status == 200) {
                    setVerifystate(true);
                } else {
                    addToast({
                        typeToast: "e",
                        content: data.data.mess,
                        duration: 5
                    })
                }
                closeSpinner()

            }).catch((error) => {
                console.log(error)
                addToast({
                    typeToast: "e",
                    content: "Can't process",
                    duration: 5
                })

                closeSpinner()
            })
        }
    }

    const handleUpdatePassword = async () => {
        openSpinner()
        if (verifyCode && password && confirmPassword) {
            const verifycodeRegex = /^[0-9]{4}$/;
            if (!verifycodeRegex.test(verifyCode)) {
                setErrorVerify("Invalid verify code format");
                closeSpinner()
            }
            else {
                await forgotPassword({
                    gmail: gmail,
                    newPassword: btoa(password),
                    verifyCode: verifyCode
                }).then((data) => {
                    if (data.status == 200) {
                        closeSpinner()
                        addToast({
                            typeToast: "s",
                            content: "Password changed",
                            duration: 5
                        })
                        redirect.push("/login")
                    } else {
                        addToast({
                            typeToast: "e",
                            content: "Can't change password",
                            duration: 5
                        })
                        closeSpinner()
                    }
                }).catch((error) => {
                    console.log(error)
                    addToast({
                        typeToast: "e",
                        content: "Can't process",
                        duration: 5
                    })

                    closeSpinner()
                })
            }

        } else {
            if (!verifyCode) {
                setErrorVerify("Please enter verify code")
            }

            if (!password) {
                setErrorPassword("Please enter password")
            } else {
                if (password.length < 8 || password.length > 20) {
                    setErrorPassword("Password must be between 8 and 20 characters")
                }

                if (password.toLowerCase() === password) {
                    setErrorPassword("Password must contain at least one uppercase letter")
                }

                const findNumber = /\d/;
                if (!findNumber.test(password)) {
                    setErrorPassword("Password must contain at least one number")
                }
            }

            if (!confirmPassword) {
                setErrorConfirmPassword("Please confirm password")
            }
        }
    }

    return (
        <IonPage>
            <div className="forgotPasswordPage">
                <div className="forgotPasswordPage__form">
                    <div className="forgotPasswordPage__element forgotPasswordPage__element--headerBox">
                        <img className="forgotPasswordPage__header--icon" src="src/assets/logo.png" alt="Logo" />
                        <h1 className="forgotPasswordPage__header--content">Forgot password</h1>
                    </div>

                    <div className="forgotPasswordPage__emailBox">
                        {!verifystate && (
                            <div className="forgotPasswordPage__inputContainer forgotPasswordPage__inputContainer--username">
                                <div className="forgotPasswordPage__inputBox">
                                    <i className="fa-regular fa-envelope inputUsernameIcon"></i>
                                    <input className="forgotPasswordPage__input" type="text" onChange={(e) => setGmail(e.target.value)} value={gmail} disabled={verifystate} placeholder="Enter your gmail..." />
                                </div>

                                <p className="forgotPasswordPage__announce">{errorGmail}</p>
                            </div>
                        )}

                        {!verifystate && (
                            <button className="forgotPasswordPage__btn forgotPasswordPage__btn--sendVerify" onClick={handleSendVefifyCode}>Send verify</button>
                        )}
                    </div>

                    {verifystate && (
                        <div className="forgotPasswordPage__verifyBox">
                            <div className="forgotPasswordPage__inputContainer forgotPasswordPage__inputContainer--username">
                                <div className="forgotPasswordPage__inputBox">
                                    <i className="fa-solid fa-fingerprint inputUsernameIcon"></i>
                                    <input className="forgotPasswordPage__input" type="text" placeholder="Enter verify code..." value={verifyCode} onChange={(e) => { setVerifyCode(e.target.value) }} />
                                </div>

                                <p className="forgotPasswordPage__announce">{errorVerify}</p>
                            </div>

                            <div className="forgotPasswordPage__inputContainer forgotPasswordPage__inputContainer--username">
                                <div className="forgotPasswordPage__inputBox">
                                    <i className="fas fa-unlock inputUsernameIcon"></i>
                                    <input className="forgotPasswordPage__input" type="password" placeholder="Enter new password..." value={password} onChange={(e) => { setPassword(e.target.value) }} />
                                </div>

                                <p className="forgotPasswordPage__announce">{errorPassword}</p>
                            </div>

                            <div className="forgotPasswordPage__inputContainer forgotPasswordPage__inputContainer--username">
                                <div className="forgotPasswordPage__inputBox">
                                    <i className="fas fa-lock inputUsernameIcon"></i>
                                    <input className="forgotPasswordPage__input" type="password" placeholder="Confirm your password..." value={confirmPassword} onChange={(e) => { setConfirmPassword(e.target.value) }} />
                                </div>

                                <p className="forgotPasswordPage__announce">{errorConfirmPassword}</p>
                            </div>

                            <button className="forgotPasswordPage__btn forgotPasswordPage__btn--getPassword" onClick={handleUpdatePassword}>Update password</button>
                        </div>
                    )}

                    <div className="forgotPasswordPage__backToSignIn">
                        <a href="/login" className="forgotPasswordPage__backToSignIn__link">Back to Sign In</a>
                    </div>
                </div>
            </div>
        </IonPage>
    )
}

export default ForgotPassword