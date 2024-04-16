"use client"

import { Button } from "@/app/_components/ui/button";
import { Textarea } from "@/app/_components/ui/textarea";
import { Barbershop } from "@prisma/client";
import { Edit2, Loader2, MapPinIcon } from "lucide-react";
import { useState } from "react";
import { UpdateBarbershop } from "../../_actions/update-barbershop";
import { toast } from "sonner";
import useAuth from "@/app/_components/useAuth";

interface BarbershopAddressProps {
    barbershop: Barbershop
}

const BarbershopAddress = ({ barbershop }: BarbershopAddressProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [editAddress, setEditAddress] = useState<Boolean>(false);
    const [newAddress, setNewAddress] = useState<string>(barbershop.address);

    const { isAuthorized } = useAuth();

    const handleConfirmEdit = async () => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("id", barbershop.id);
        formData.append("address", newAddress);

        try {
            await UpdateBarbershop({ formData });
            toast.success("Endereço alterado com sucesso!")
            setEditAddress(false);

        } catch (error) {
            console.error("Erro ao alterar o endereço:", error);
            let errorMessage = '';

            if (error instanceof Error) {
                errorMessage = error.message;
            }

            toast.error("Erro ao alterar o endereço, atualize a página ou refaça o login no menu.", {
                description: errorMessage
            });
        }
        setIsLoading(false);
    };

    const handleCancelClick = () => {
        setEditAddress(!editAddress);
        setNewAddress(barbershop.address);
    }

    return (
        <>
            {editAddress ?
                <>
                    <Textarea
                        className="resize-y text-wrap"
                        placeholder="Descrição"
                        value={newAddress}
                        onChange={(e) => setNewAddress(e.target.value)}
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
                </>
                :
                <div className="flex items-center mt-2 justify-between">
                    <div className="flex gap-1">
                        <MapPinIcon className="text-primary" size={18} />
                        <p className="text-sm">{barbershop.address}</p>
                    </div>
                    {isAuthorized && !editAddress &&
                        <Button className="p-0 h-[8px]" variant="ghost" onClick={() => { setEditAddress(!editAddress) }}>
                            <Edit2 size={14} />
                        </Button>
                    }
                </div>
            }
        </>
    );
}

export default BarbershopAddress;