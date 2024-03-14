"use client"

import { Button } from "@/app/_components/ui/button";
import useAuth from "@/app/_components/useAuth";
import { Service } from "@prisma/client";
import { Trash2 } from "lucide-react";
import { deleteService } from "../_actions/delete-service";

interface ServiceDeleteProps {
    service: Service
}

const ServiceDelete = ({service}:ServiceDeleteProps) => {
    const { isAuthorized } = useAuth();   
    if (!isAuthorized) {
        return null;
    }

    const handleDeleteServiceClick = async () => {
        await deleteService({serviceId: service.id});
    }

    return (
        <Button className="m-0 p-2" variant="ghost" onClick={handleDeleteServiceClick}>
            <Trash2 size={20} className="text-destructive" />
        </Button>
    );
}

export default ServiceDelete;