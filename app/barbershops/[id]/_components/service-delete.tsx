"use client"

import { Button } from "@/app/_components/ui/button";
import useAuth from "@/app/_components/useAuth";
import { Service } from "@prisma/client";
import { Trash2 } from "lucide-react";
import { deleteService } from "../_actions/delete-service";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/app/_components/ui/alert-dialog";

interface ServiceDeleteProps {
    service: Service
}

const ServiceDelete = ({ service }: ServiceDeleteProps) => {
    const { isAuthorized } = useAuth();
    if (!isAuthorized) {
        return null;
    }

    const handleDeleteServiceClick = async () => {
        await deleteService({ serviceId: service.id });
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <Button className="m-0 p-2" variant="ghost">
                    <Trash2 size={20} className="text-destructive" />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent className="w-[90%]">
                <AlertDialogHeader>
                    <AlertDialogTitle>Deseja mesmo excluir o serviço?</AlertDialogTitle>
                    <AlertDialogDescription>
                        Uma vez excluído, não será possível reverter essa ação. Porém seus agendamentos ficarão gravados.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-row gap-3">
                    <AlertDialogCancel className="w-full gap-3 mt-0">Voltar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteServiceClick} className="w-full gap-3">
                        Excluir
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}

export default ServiceDelete;