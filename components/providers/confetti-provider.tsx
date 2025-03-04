"use client";

import ReactConfetti from "react-confetti";

import { useConfettiStore } from "@/hooks/use-conffeti-store";

interface ConfettiProviderProps {
    children?: React.ReactNode;
}

export default function ConfettiProvider({ children }: ConfettiProviderProps) {
    const confetti = useConfettiStore();

    if (!confetti.isOpen) return <>{children}</>;
    
    return (
        <>
            {children}
            <ReactConfetti
                className="pointer-events-none h-screen w-screen"
                numberOfPieces={200}
                recycle={false}
                onConfettiComplete={() => {
                    confetti.onClose();
                }}
            />
        </>
    )
}