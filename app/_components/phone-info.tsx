"use client"

import { Smartphone } from "lucide-react";
import { Button } from "./ui/button";
import { useRef, useState } from "react";

interface PhoneInfoProps {
    phone: string | null
}

const PhoneInfo = ({phone}:PhoneInfoProps) => {
    const [copied, setCopied] = useState(false);
    const textRef = useRef<HTMLDivElement>(null);

    const handleCopyClick = () => {
        if (textRef.current) {
            navigator.clipboard.writeText(textRef.current.innerText);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    if(!phone) return;    

    return (        
        <div className="flex items-center justify-between my-3 max-w-[460px]">
            <div className="flex items-center gap-1 text-sm" ref={textRef}>
                <Smartphone className="w-6 h-6" />
                <p>{phone}</p>
            </div>
            <Button variant="outline" className={copied ? "text-xs p-3" : ""} onClick={handleCopyClick}>{copied ? 'Copiado!' : 'Copiar'}</Button>
        </div>
    );
}

export default PhoneInfo;