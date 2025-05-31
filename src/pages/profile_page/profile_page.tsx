// Import library
import { IonPage } from "@ionic/react";
import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router";

// Import components

// Import custom hooks
import { useCache } from "../../hooks/cache/cache";
import { useSocket } from "../../hooks/socket/socket";
import { useToast } from "../../hooks/toastMessage/toast";
import { useSpinner } from "../../hooks/spinner/spinner";

// Import services
import logoutAccount from "../../services/logout_account";
import { changeData, deleteAccount, deleteAccount__sendVerifyCode } from "../../services/changeData.serv";

// Import redux
import { useSelector } from "react-redux";
import { RootState } from "../../redux/store";

// Import css
import "./profile_page.css"
import "../../main.css"

const ProfilePage: React.FC = () => {
    // States
    const [activeModal, setActiveModal] = useState<'name' | 'password' | 'delete' | 'signout' | null>(null);
    const redirect = useHistory()
    const modalRef = useRef<HTMLDivElement>(null);

    // Custom hooks
    const { disableListener_userInformation } = useCache()
    const { setStatusWhenLogout } = useSocket()
    const { addToast } = useToast()
    const { openSpinner, closeSpinner } = useSpinner()

    // Redux
    const gmail = useSelector((state: RootState) => state.userInformation.gmail)
    const clientName = useSelector((state: RootState) => state.userInformation.username)

    // Data
    const [newName, setNewName] = useState<string>("");
    const [newPassword, setNewPassword] = useState<string>("");
    const [inputPassword, setInputPassword] = useState<string>("")
    const [deleteAccountVerifyCode, setDeleteAccountVerifyCode] = useState<string>("")

    // Handlers
    const sendVerifyCodeDeleteAccount = async () => {
        openSpinner()
        await deleteAccount__sendVerifyCode({
            client_mail: gmail,
        }).then((data) => {
            if (data.status == 200) {
                addToast({
                    typeToast: "s",
                    content: data.data.mess,
                    duration: 5
                })
            } else {
                addToast({
                    typeToast: "e",
                    content: data.data.mess,
                    duration: 5
                })
            }

            closeSpinner()
        }).catch((err) => {
            console.log(err)
            addToast({
                typeToast: "e",
                content: "Can't send",
                duration: 5
            })
            closeSpinner()
        })
    }

    const handleDirection = () => {
        redirect.push("/")
    }

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent | TouchEvent) => {
            if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
                closeModal();
            }
        };

        if (activeModal) {
            document.addEventListener('mousedown', handleClickOutside);
            document.addEventListener('touchstart', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            document.removeEventListener('touchstart', handleClickOutside);
        };
    }, [activeModal]);

    const closeModal = () => {
        setActiveModal(null);
        setNewName("");
        setNewPassword("");
        setInputPassword("")
        setDeleteAccountVerifyCode("")
    };

    const handleSubmit = async () => {
        openSpinner()
        switch (activeModal) {
            case 'name':
                if (gmail && inputPassword && newName) {
                    if (newName == clientName) {
                        addToast({
                            typeToast: "w",
                            content: "Please enter another name",
                            duration: 5
                        })
                    } else {
                        await changeData({
                            typeChange: "changeName",
                            client_mail: gmail,
                            client_password: inputPassword,
                            client_newName: newName
                        }).then((data) => {
                            if (data.status == 200) {
                                addToast({
                                    typeToast: "s",
                                    content: "Changed name",
                                    duration: 5
                                })
                            } else {
                                addToast({
                                    typeToast: "e",
                                    content: "Can't change",
                                    duration: 5
                                })
                            }
                        }).catch((err) => {
                            console.error(err)
                            addToast({
                                typeToast: "e",
                                content: "Can't change",
                                duration: 5
                            })
                        })
                    }
                } else {
                    addToast({
                        typeToast: "e",
                        content: "Can't change",
                        duration: 5
                    })
                }

                closeSpinner()

                break;

            case 'password':
                if (gmail && inputPassword && newPassword) {
                    await changeData({
                        typeChange: "changePasword",
                        client_mail: gmail,
                        client_password: inputPassword,
                        client_newPassword: newPassword
                    }).then((data) => {
                        if (data.status == 200) {
                            addToast({
                                typeToast: "s",
                                content: data.data.mess,
                                duration: 5
                            })
                        } else {
                            addToast({
                                typeToast: "e",
                                content: data.data.mess,
                                duration: 5
                            })
                        }
                    }).catch((err) => {
                        console.error(err)
                        addToast({
                            typeToast: "e",
                            content: "Can't change",
                            duration: 5
                        })
                    })

                } else {
                    addToast({
                        typeToast: "e",
                        content: "Can't change",
                        duration: 5
                    })
                }

                closeSpinner()
                break;

            case 'signout':
                await logoutAccount().then((data) => {
                    if (data.status == 200) {
                        disableListener_userInformation()
                        setStatusWhenLogout(gmail)
                        setTimeout(() => {
                            redirect.push("/login")
                        }, 500)
                    }
                }).catch((err) => {
                    addToast({
                        typeToast: "e",
                        content: err,
                        duration: 5
                    })
                })

                closeSpinner()
                break;

            case 'delete':
                await deleteAccount({
                    client_mail: gmail,
                    verifyCode: deleteAccountVerifyCode
                }).then((data) => {
                    if (data.status == 200) {
                        redirect.push("/login")
                    } else {
                        addToast({
                            typeToast: "e",
                            content: "Can't delete account",
                            duration: 5
                        })
                    }
                }).catch((err) => {
                    console.log(err)
                    addToast({
                        typeToast: "e",
                        content: "Can't delete account",
                        duration: 5
                    })
                })
                
                closeSpinner()
                break;
        }
        closeModal();
    };

    const renderModalContent = () => {
        switch (activeModal) {
            case 'name':
                return (
                    <>
                        <div className="modal__input--group">
                            <i className="fa-solid fa-user-pen modal__icon"></i>
                            <input
                                type="text"
                                placeholder="New name..."
                                value={newName}
                                onChange={(e) => { setNewName(e.target.value); }}
                                className="modal__input"
                            />
                        </div>

                        <div className="modal__input--group">
                            <i className="fa-solid fa-fingerprint modal__icon"></i>
                            <input
                                type="password"
                                placeholder="Verify password..."
                                value={inputPassword}
                                onChange={(e) => { setInputPassword(e.target.value) }}
                                className="modal__input"
                            />
                        </div>
                    </>
                );

            case 'password':
                return (
                    <>
                        <div className="modal__input--group">
                            <i className="fa-solid fa-lock modal__icon"></i>
                            <input
                                type="password"
                                placeholder="Password..."
                                value={inputPassword}
                                onChange={(e) => { setInputPassword(e.target.value) }}
                                className="modal__input"
                            />
                        </div>

                        <div className="modal__input--group">
                            <i className="fa-solid fa-fingerprint modal__icon"></i>
                            <input
                                type="password"
                                placeholder="New password..."
                                className="modal__input"
                                value={newPassword}
                                onChange={(e) => { setNewPassword(e.target.value) }}
                            />
                        </div>
                    </>
                );

            case 'delete':
                return (
                    <div className="modal__delete">
                        <h2 className="modal__title">YOUR DECISION</h2>
                        <div className="modal__verify-code">
                            <input type="number" placeholder="Verify code"
                                className="modal__input modal__input--verify"
                                value={deleteAccountVerifyCode}
                                onChange={(e) => { setDeleteAccountVerifyCode(e.target.value) }}
                            />
                        </div>

                        <div className="modal__actions">
                            <button className="modal__button modal__button--sendCode" onClick={sendVerifyCodeDeleteAccount}>Send code</button>

                            <button className="modal__button modal__button--delete" onClick={handleSubmit}>Delete</button>
                        </div>
                    </div>
                );

            case 'signout':
                return (
                    <div className="modal__signout">
                        <h1>This is good bye</h1>
                    </div>
                );

            default:
                return null;
        }
    };

    return (
        <IonPage>
            <div className="settings">
                <div className="settings__header">
                    <button className="settings__back--button" onClick={handleDirection}>
                        <i className="fa-solid fa-caret-left settings__back--icon"></i>
                    </button>

                    <h1 className="setting__header--title">Profile</h1>
                </div>

                <div className="settings__funcs">
                    <button className="settings__item" onClick={() => setActiveModal("name")}>
                        <i className="fa-solid fa-user-pen settings__item--icon"></i>
                        <p className="settings__item--text">Change your name</p>
                    </button>

                    <button className="settings__item" onClick={() => setActiveModal("password")}>
                        <i className="fa-solid fa-lock settings__item--icon"></i>
                        <p className="settings__item--text">Change your password</p>
                    </button>

                    <button className="settings__item" onClick={() => setActiveModal("signout")}>
                        <i className="fas fa-sign-out-alt settings__item--icon"></i>
                        <p className="settings__item--text">Sign out</p>
                    </button>

                    <button className="settings__item settings__item--delete" onClick={() => setActiveModal('delete')}>
                        <i className="fa-solid fa-trash settings__item--icon"></i>
                        <p className="settings__item--text settings__item--textdelete">Delete the account</p>
                    </button>
                </div>

                {/* Modal */}
                {activeModal && (
                    <div className="modal">
                        <div className="modal__content" ref={modalRef}>
                            {renderModalContent()}

                            {activeModal !== 'delete' && (
                                <button className={`modal__button ${activeModal == 'signout' ? "signout" : ""}`} onClick={handleSubmit}>
                                    {activeModal != 'signout' ? "Apply" : "Sign out"}
                                </button>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </IonPage>
    );
};

export default ProfilePage;