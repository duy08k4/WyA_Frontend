// Import library
import { IonPage } from "@ionic/react";
import React, { useState, useRef, useEffect } from "react";
import { useHistory } from "react-router";

// Import components

// Import custom hooks
import { useCache } from "../../hooks/cache/cache";

// Import css
import "./profile_page.css"
import "../../main.css"
import logoutAccount from "../../services/logout_account";

const ProfilePage: React.FC = () => {
    // States
    const [activeModal, setActiveModal] = useState<'name' | 'email' | 'password' | 'delete' | 'avatar' | 'signout' | null>(null);
    const [newName, setNewName] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newEmail, setNewEmail] = useState("");
    const redirect = useHistory()
    const modalRef = useRef<HTMLDivElement>(null);

    // Custom hooks
    const { disableListener_userInformation } = useCache()

    // Handlers
    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewName(e.target.value);
    };

    const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewPassword(e.target.value);
    };

    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewEmail(e.target.value);
    };

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
        setNewEmail("");
    };

    const handleSubmit = async () => {
        switch (activeModal) {
            case 'name':
                console.log("New name:", newName);
                console.log("Verification password:", newPassword);
                break;

            case 'email':
                console.log("New email:", newEmail);
                console.log("Verification password:", newPassword);
                break;

            case 'password':
                console.log("New password:", newPassword);
                break;

            case 'avatar':
                console.log("Changed avatar");
                break;

            case 'signout':
                await logoutAccount().then((data) => {
                    if (data.status == 200) {
                        disableListener_userInformation()
                        redirect.push("/login")
                    }
                })

            case 'delete':
                console.log("Account deletion confirmed");
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
                                onChange={handleNameChange}
                                className="modal__input"
                            />
                        </div>

                        <div className="modal__input--group">
                            <i className="fa-solid fa-fingerprint modal__icon"></i>
                            <input
                                type="password"
                                placeholder="Verify password..."
                                value={newPassword}
                                onChange={handlePasswordChange}
                                className="modal__input"
                            />
                        </div>
                    </>
                );
            case 'email':
                return (
                    <>
                        <div className="modal__input--group">
                            <i className="fa-solid fa-envelope modal__icon"></i>
                            <input
                                type="email"
                                placeholder="New email..."
                                value={newEmail}
                                onChange={handleEmailChange}
                                className="modal__input"
                            />
                        </div>

                        <div className="modal__input--group">
                            <i className="fa-solid fa-fingerprint modal__icon"></i>
                            <input
                                type="password"
                                placeholder="Verify password..."
                                value={newPassword}
                                onChange={handlePasswordChange}
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
                                value={newPassword}
                                onChange={handlePasswordChange}
                                className="modal__input"
                            />
                        </div>

                        <div className="modal__input--group">
                            <i className="fa-solid fa-fingerprint modal__icon"></i>
                            <input
                                type="password"
                                placeholder="Confirm password..."
                                className="modal__input"
                            />
                        </div>

                        <div className="modal__input--group">
                            <i className="fa-solid fa-fingerprint modal__icon"></i>
                            <input
                                type="password"
                                placeholder="Verify password..."
                                className="modal__input"
                            />
                        </div>
                    </>
                );
            case 'delete':
                return (
                    <div className="modal__delete">
                        <h2 className="modal__title">YOUR DECISION</h2>
                        <div className="modal__verify-code">
                            <input type="text" placeholder="Verify code" className="modal__input modal__input--verify" />
                        </div>

                        <div className="modal__actions">
                            <button className="modal__button modal__button--sendCode">Send code</button>

                            <button className="modal__button modal__button--delete" onClick={handleSubmit}>Delete</button>
                        </div>
                    </div>
                );

            case 'avatar':
                return (
                    <div className="modal__avatar">
                        hahai
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
                        <i className="fa-solid fa-caret-left settings__back-icon"></i>
                    </button>

                    <h1 className="setting__header--title">Profile</h1>
                </div>

                <div className="settings__funcs">
                    <button className="settings__item" onClick={() => setActiveModal("name")}>
                        <i className="fa-solid fa-user-pen settings__item--icon"></i>
                        <p className="settings__item--text">Change your name</p>
                    </button>

                    <button className="settings__item" onClick={() => setActiveModal("email")}>
                        <i className="fa-solid fa-envelope settings__item--icon"></i>
                        <p className="settings__item--text">Change your gmail</p>
                    </button>

                    <button className="settings__item" onClick={() => setActiveModal("password")}>
                        <i className="fa-solid fa-lock settings__item--icon"></i>
                        <p className="settings__item--text">Change your password</p>
                    </button>

                    <button className="settings__item" onClick={() => setActiveModal("avatar")}>
                        <i className="fas fa-image settings__item--icon"></i>
                        <p className="settings__item--text">Change your avartar</p>
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