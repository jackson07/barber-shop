"use client"

import { Button } from "@/app/_components/ui/button";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "@/app/_components/ui/sheet";
import { useState } from "react";
import ServiceForm from "./service-form";
import useAuth from "@/app/_components/useAuth";

interface ServiceCreateProps {
    barbershopID: string,
    barbershopUserID: string,
}

const ServiceCreate = ({ barbershopID, barbershopUserID}: ServiceCreateProps) => {
    const [sheetIsOpen, setSheetIsOpen] = useState(false);
    const { isAuthorized } = useAuth(barbershopUserID);   
    if (!isAuthorized) {
        return null;
    }

    const handleSheetClose = () => {
        setSheetIsOpen(false);
    };

    return (
        <Sheet open={sheetIsOpen} onOpenChange={setSheetIsOpen}>
            <SheetTrigger asChild>
                <Button variant="secondary">
                    Novo Serviço
                </Button>
            </SheetTrigger>

            <SheetContent className="p-0 overflow-y-auto [&::-webkit-scrollbar]:hidden">
                <SheetHeader className="text-left px-5 py-6 border-b border-solid border-secondary">
                    <SheetTitle>
                        Cadastro de Serviço
                    </SheetTitle>
                </SheetHeader>
                <SheetDescription className="px-5 my-4">
                    <ServiceForm barbershopID={barbershopID} barbershopUserID={barbershopUserID} onClose={handleSheetClose} service={null}/>
                </SheetDescription>
            </SheetContent>
            
        </Sheet>
    );
}

export default ServiceCreate;
