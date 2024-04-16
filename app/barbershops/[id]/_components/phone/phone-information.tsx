"use client"

import PhoneInfo from "@/app/_components/phone-info";
import { Button } from "@/app/_components/ui/button";
import { Input } from "@/app/_components/ui/input";
import { Barbershop } from "@prisma/client";
import { Loader2, PlusCircleIcon } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { UpdateBarbershop } from "../../_actions/update-barbershop";
import PhoneDelete from "./phone-delete";
import useAuth from "@/app/_components/useAuth";

interface PhoneInformationProps {
    barbershop: Barbershop
}

const PhoneInformation = ({ barbershop }: PhoneInformationProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [editPhone, setEditPhone] = useState<Boolean>(false);
    const [newPhone, setNewPhone] = useState<string>("");

    const { isAuthorized } = useAuth(barbershop.userId);

    const phones = barbershop.phone?.split('/').filter(phone => phone.trim().length > 0);

    const handleCancelClick = () => {
        setEditPhone(!editPhone);
        setNewPhone("");
    }

    const handleConfirmEdit = async () => {
        if (newPhone.length != 11) {
            toast.error("O número informado é inválido!", {
                description: "Necessário informar um numero com 11 caracteres."
            })
            return;
        }

        setIsLoading(true);
        const valuePhone = newPhone;
        const maskedPhoneNumber = valuePhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');

        const formData = new FormData();
        formData.append("id", barbershop.id);
        formData.append("phone", maskedPhoneNumber + "/" + barbershop.phone);

        try {
            await UpdateBarbershop({ formData });
            toast.success("Telefone cadastrado com sucesso!")
            setEditPhone(false);
            setNewPhone("");
        } catch (error) {
            console.error("Erro ao cadastrar o telefone:", error);
            let errorMessage = '';

            if (error instanceof Error) {
                errorMessage = error.message;
            }

            toast.error("Erro ao cadastrar o telefone, atualize a página ou refaça o login no menu.", {
                description: errorMessage
            });
        }
        setIsLoading(false);
    };

    return (
        <div className="px-5 pb-4 border-b border-solid border-secondary">
            <div className="flex justify-between items-center">
                <p className="text-gray-400 uppercase text-xs font-bold">Telefones para Contato</p>
                {isAuthorized && !editPhone &&
                    <Button variant="ghost" className="h-[8px] p-0" onClick={() => { setEditPhone(!editPhone) }}>
                        <PlusCircleIcon size={14} />
                    </Button>
                }
            </div>
            {!(phones.length > 0) && !editPhone &&
                <p className="text-gray-300 text-xs font-bold pt-4">Não possui telefone cadastrado.</p>
            }
            {phones &&
                phones.map((phone, index) => (
                    <div key={index} className="flex flex-row items-center justify-center gap-2 w-full h-full">
                        <PhoneInfo phone={phone} />
                        <PhoneDelete barbershop={barbershop} phone={phone} />
                    </div>))
            }

            {editPhone &&
                <div className="pt-4">
                    <Input
                        type="tel"
                        pattern="[0-9]*"
                        placeholder="DDD+Número (somente números)"
                        maxLength={11}
                        value={newPhone}
                        onChange={(e) => {
                            const phone = e.target.value.replace(/\D/g, '');
                            setNewPhone(phone.slice(0, 11));
                        }}
                    />
                    <div className="w-full h-10 flex gap-2 pt-4 mb-4">
                        <Button variant="default" className="w-full" onClick={handleConfirmEdit}>
                            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> :
                                "Confirmar"}
                        </Button>
                        <Button variant="secondary" className="w-full" onClick={handleCancelClick}>
                            Cancelar
                        </Button>
                    </div>

                </div>
            }
        </div>
    );
}

export default PhoneInformation;