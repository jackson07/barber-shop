"use client"

import PhoneInfo from "@/app/_components/phone-info";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Barbershop } from "@prisma/client";
import { Loader2, PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { UpdateBarbershop } from "../_actions/update-barbershop";

interface PhoneInformationProps {
    barbershop: Barbershop
}


const PhoneInformation = ({ barbershop }: PhoneInformationProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [editPhone, setEditPhone] = useState<Boolean>(false);
    const [newPhone, setNewPhone] = useState<string>("");
    const phones = barbershop.phone?.split(',');

    const handleConfirmEdit = async () => {
        setIsLoading(true);
        const valuePhone = newPhone;
        // const maskPhone = valuePhone.replace(/\D/g, '');
        const maskedPhoneNumber = valuePhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');

        const formData = new FormData();
        formData.append("id", barbershop.id);
        formData.append("phone", maskedPhoneNumber +" , "+ barbershop.phone);

        try {
            await UpdateBarbershop({ formData });
            toast("Telefone cadastrar com sucesso!")
            setEditPhone(false);
            setNewPhone("");
        } catch (error) {
            console.error("Erro ao cadastrar o telefone:", error);
            let errorMessage = '';

            if (error instanceof Error) {
                errorMessage = error.message;
            }

            toast("Erro ao cadastrar o telefone, atualize a página ou refaça o login no menu.", {
                description: errorMessage
            });
        }
        setIsLoading(false);
    };

    return (
        <div className="px-5 pb-4 border-b border-solid border-secondary">
            {phones && phones.map((phone, index) => (
                <div key={index}>
                    <PhoneInfo phone={phone} />
                </div>))}
            {!editPhone &&
                <div className="flex justify-end">
                    <Button variant="ghost" className="p-0 h-[8px]" onClick={() => { setEditPhone(!editPhone) }}>
                        <PlusCircleIcon size={16} />
                    </Button>
                </div>
            }
            {editPhone &&
                <div>
                    <Input
                        type="text"
                        placeholder="DDD+Número (somente números)"
                        maxLength={11}
                        value={newPhone}
                        onChange={(e) => {
                            const phone = e.target.value.replace(/\D/g, '');;
                            setNewPhone(phone);
                        }}
                    />
                    <div className="w-full h-10 flex gap-2 pt-4 mb-4">
                        <Button variant="default" className="w-full" onClick={handleConfirmEdit}>
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> :
                                "Confirmar"}
                        </Button>
                        <Button variant="secondary" className="w-full" onClick={() => { setEditPhone(!editPhone) }}>
                            Cancelar
                        </Button>
                    </div>

                </div>
            }
        </div>
    );
}

export default PhoneInformation;