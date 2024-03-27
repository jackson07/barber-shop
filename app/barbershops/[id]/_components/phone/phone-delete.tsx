"use client"

import useAuth from "@/app/_components/useAuth";
import { useState } from "react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/app/_components/ui/alert-dialog";
import { Button } from "@/app/_components/ui/button";
import { Loader2, Trash2 } from "lucide-react";
import { UpdateBarbershop } from "../../_actions/update-barbershop";
import { toast } from "sonner";
import { Barbershop } from "@prisma/client";

const removePhoneNumber = (barbershopPhone: string, phoneToRemove: string) => {
    return barbershopPhone.replace(phoneToRemove+'/','').trim();
};

interface PhoneDeleteProps {
    barbershop: Barbershop
    phone: string
}

const PhoneDelete = ({barbershop, phone}:PhoneDeleteProps) => {
    const [isLoading, setIsLoading] = useState(false);

    const { isAuthorized } = useAuth();
    if (!isAuthorized) {
        return null;
    }  

    const handleDeletePhoneClick = async () => {
        setIsLoading(true);
        const updatedPhoneList = removePhoneNumber(barbershop.phone, phone);
        const formData = new FormData();
        formData.append("id", barbershop.id);
        formData.append("phone", updatedPhoneList);
        try {
            await UpdateBarbershop({formData});
            toast.success("Telefone excluído com sucesso!");   
        } catch (error) {
            console.error("Erro ao excluir o telefone:", error);
            let errorMessage = '';

            if (error instanceof Error) {
                errorMessage = error.message;
            }

            toast.error("Erro ao excluir o telefone, atualize a página ou refaça o login no menu.", {
                description: errorMessage
            });
        }
        setIsLoading(false);
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <Button className="m-0 p-2" variant="ghost">
                    {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                    {!isLoading && <Trash2 size={20} className="text-destructive" />}
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="w-[90%]">
                <AlertDialogHeader>
                    <AlertDialogTitle>Deseja mesmo excluir o número {phone}?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Uma vez excluído, não será possível reverter essa ação.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-row gap-3">
                    <AlertDialogCancel className="w-full gap-3 mt-0">Voltar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeletePhoneClick} className="w-full gap-3">
                        Excluir
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default PhoneDelete;