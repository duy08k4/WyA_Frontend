// Import library
import { IonPage } from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router";

// Import components

// Import css
import "./contact_page.css"
import "../../main.css"

// Import custom hook
import { useToast } from "../../hooks/toastMessage/toast";
import { useSpinner } from "../../hooks/spinner/spinner";
import { sendProblem } from "../../services/contact.serv";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

const ContactPage: React.FC = () => {
    // State
    const [showLimit__title, setShowLimit__title] = useState<string>("0")
    const [showLimit__content, setShowLimit__content] = useState<string>("0")
    const redirect = useHistory()

    // Error

    // Data
    const maxLimit__title = 50
    const maxLimit__content = 500
    const maxLimitAnnounce = "Reached limitation"

    // Redux
    const gmail = useSelector((root: RootState) => root.userInformation.gmail)

    // Custom hook
    const { addToast } = useToast()
    const { openSpinner, closeSpinner } = useSpinner()


    const [title, setTitle] = useState<string>("")
    const [content, setContent] = useState<string>("")

    // Listening
    useEffect(() => {
        setShowLimit__title(title.length == maxLimit__title ? maxLimitAnnounce : `${title.length.toString()} / ${maxLimit__title}`)
        setShowLimit__content(content.length == maxLimit__content ? maxLimitAnnounce : `${content.length.toString()} / ${maxLimit__content}`)

    }, [title, content])

    // Handlers
    const sendGmail = async () => {
        let getMailTitle = title
        let getMailContent = content

        openSpinner()

        if (getMailTitle && getMailContent) {
            await sendProblem({
                gmail: gmail,
                topic: getMailTitle,
                content: getMailContent
            }).then((data) => {
                if (data.status == 200) {
                    addToast({
                        typeToast: "s",
                        content: "Sent",
                        duration: 3
                    })

                    setTitle("")
                    setContent("")
                } else {
                    addToast({
                        typeToast: "e",
                        content: "Can't send",
                        duration: 3
                    })
                }

                closeSpinner()

            }).catch((err) => {
                console.log(err)
                addToast({
                    typeToast: "e",
                    content: "Can't process",
                    duration: 3
                })

                closeSpinner()
            })
        } else {
            addToast({
                typeToast: "e",
                content: "Please fill the form",
                duration: 3
            })
            closeSpinner()
        }
    }

    const handleDirection = () => {
        redirect.push("/")
    }

    return (
        <IonPage>
            <div className="contact__container">
                <div className="contact__header">
                    <button className="contact__button--back" onClick={handleDirection}>
                        <i className="fa-solid fa-caret-left"></i>
                    </button>

                    <h1 className="contact__header--title">Contact</h1>
                </div>

                <div className="contact__form">
                    <div className="contact__form__element">
                        <p className={`contact__form__element--limit ${showLimit__title == maxLimitAnnounce ? "maxLimitation" : ""}`}>{showLimit__title}</p>
                        <input
                            type="text"
                            className="contact__form__element--title"
                            placeholder="Topic's problem..."
                            maxLength={maxLimit__title}
                            onChange={(e) => { setTitle(e.target.value) }}
                            value={title}
                        />
                    </div>

                    <div className="contact__form__element">
                        <p className={`contact__form__element--limit ${showLimit__content == maxLimitAnnounce ? "maxLimitation" : ""}`}>{showLimit__content}</p>
                        <textarea
                            className="contact__form__element--content"
                            placeholder="Write your problem..."
                            maxLength={maxLimit__content}
                            onChange={(e) => { setContent(e.target.value) }}
                            value={content}
                        ></textarea>
                    </div>

                    <div className="contact__form__element">
                        <button className="contact__form__element__btn--send" onClick={sendGmail}>
                            <i className="fa-regular fa-envelope"></i>
                            <p>send</p>
                        </button>
                    </div>
                </div>
            </div>
        </IonPage>
    )
}

export default ContactPage