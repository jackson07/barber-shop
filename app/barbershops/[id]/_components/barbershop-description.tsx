"use client"

import { Button } from "@/app/_components/ui/button";
import { Textarea } from "@/app/_components/ui/textarea";
import { Barbershop } from "@prisma/client";
import { Edit2, Loader2 } from "lucide-react";
import { useState } from "react";
import { UpdateBarbershop } from "../_actions/update-barbershop";
import { toast } from "sonner";
import useAuth from "@/app/_components/useAuth";

interface BarbershopDescriptionProps {
    barbershop: Barbershop
}

const BarbershopDescription = ({ barbershop }: BarbershopDescriptionProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [editDescription, setEditDescription] = useState<Boolean>(false);
    const [newDescription, setNewDescription] = useState<string>(barbershop.description);

    const { isAuthorized } = useAuth();

    const handleConfirmEdit = async () => {
        setIsLoading(true);
        const formData = new FormData();
        formData.append("id", barbershop.id);
        formData.append("description", newDescription);

        try {
            await UpdateBarbershop({ formData });
            toast("Descrição alterada com sucesso!")
            setEditDescription(false);

        } catch (error) {
            console.error("Erro ao alterar a descrição:", error);
            let errorMessage = '';

            if (error instanceof Error) {
                errorMessage = error.message;
            }

            toast("Erro ao alterar a descrição, atualize a página ou refaça o login no menu.", {
                description: errorMessage
            });
        }
        setIsLoading(false);
    };

    return (
        <div className="px-5 py-4 border-b flex flex-col gap-2 border-solid border-secondary">
            <div className="flex justify-between items-center">
                <p className="text-gray-400 uppercase text-xs font-bold">Sobre nós</p>
                {isAuthorized && !editDescription &&
                    <Button className="p-0 h-[8px]" variant="ghost" onClick={() => { setEditDescription(!editDescription) }}>
                        <Edit2 size={14} />
                    </Button>
                }
            </div>
            <div className="flex flex-col items-center text-[14px]">
                {editDescription ?
                    <>
                        <Textarea
                            className="h-32 resize-y text-wrap"
                            placeholder="Descrição"
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                        />
                        <div className="w-full h-10 flex gap-2 pt-4 mb-4">
                            <Button variant="default" className="w-full" onClick={handleConfirmEdit}>
                                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> :
                                    "Confirmar"}
                            </Button>
                            <Button variant="secondary" className="w-full" onClick={() => { setEditDescription(!editDescription) }}>
                                Cancelar
                            </Button>
                        </div>
                    </>
                    :
                    barbershop.description
                }
            </div>
        </div>
    );
}

export default BarbershopDescription;