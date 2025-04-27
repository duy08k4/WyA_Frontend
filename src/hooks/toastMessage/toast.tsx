import React, { createContext, ReactElement, useContext, useState } from "react";
import "./toast.css"

// Import interface
import { 
    interface__toast,
    interface__toastContext,
    interface__toastProviderProps
 } from "../../types/interface__Toast";

const ToastContext = createContext<interface__toastContext | undefined>(undefined)

export const useToast = ():interface__toastContext => {
    const context = useContext(ToastContext)

    if(!context) {
        throw new Error("useToast must be used within a ToastProvider");
    }

    return context
}

export const ToastProvider:React.FC<interface__toastProviderProps> = ({ children }) => {
    const [toast, setToast] = useState<interface__toast | undefined>(undefined)

    // Add Toast
    const addToast = (data:interface__toast) => {
        setToast({
            typeToast: data.typeToast,
            content: data.content,
            duration: data.duration
        })

        setTimeout(() => {
            setToast(undefined)
        }, (data.duration ?? 0) * 1000)
    }

    const style = {
        '--toast-duration': `${toast?.duration ?? 0}s`,  
    } as React.CSSProperties & { '--toast-duration'?: string };

    const typeOfToast: Record<string, string> = {
        s: "fa-solid fa-check",
        e: "fa-solid fa-xmark",
        i: "fa-solid fa-info",
        w: "fa-solid fa-exclamation"
    }

    return (
        <ToastContext.Provider value={{addToast}}>
            {children}
            <div className="toastContainer">
                {toast && (
                    <div className={`toast ${toast.typeToast}`} style={style}>
                        <div className="toast__iconBox">
                            <i className={typeOfToast[toast.typeToast]}></i>
                        </div>

                        <div className="toast__messsageBox">
                            <p className="toast__messsageBox--showMessage">{toast.content}</p>
                        </div>
                    </div>
                )}
            </div>
        </ToastContext.Provider>
    )
}