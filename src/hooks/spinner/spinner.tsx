import React, { createContext, useContext, useState } from "react";
import SyncLoader from "react-spinners/ClipLoader"
import { motion } from "motion/react"

// Import interface
import {
    interface__spinnerContext,
    interface__spinnerProviderProps
} from "../../types/interface__Spinner";

// import Css
import "./spinner.css"

// Custom hook
const SpinnerContext = createContext<interface__spinnerContext | undefined>(undefined)

export const useSpinner = ():interface__spinnerContext => {
    const context = useContext(SpinnerContext)

    if(!context) {
        throw new Error("useToast must be used within a SpinnerProvider");
    }

    return context
}

export const SpinnerProvider: React.FC<interface__spinnerProviderProps> = ({ children }) => {
    const [spinner, setSpinner] = useState<boolean>(false)
    const openSpinner = () => {
        setSpinner(true)
    }
    
    const closeSpinner = () => {
        setSpinner(false)
    }

    return (
        <SpinnerContext.Provider value= {{ openSpinner, closeSpinner }}>
            {children}
            {spinner && (
                <motion.div 
                    className="spinnerContainer"
                    initial= {{ opacity: 0 }}
                    animate= {{ opacity: 1 }}
                    transition={{duration: 0.2}}
                >
                    <SyncLoader color="white" size={50} />
                </motion.div>
            )}
        </SpinnerContext.Provider>
    )
}