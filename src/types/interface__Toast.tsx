import { ReactNode } from "react";

interface interface__toast {
    typeToast: "s" | "e" | "i" | "w",
    content: string,
    duration?: number,
    
}

interface interface__toastContext {
    addToast: ({}: interface__toast) => void
}

interface interface__toastProviderProps {
    children: ReactNode;
}

export type {interface__toast, interface__toastContext, interface__toastProviderProps}