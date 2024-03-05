"use client"

import { SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/app/_components/ui/select";
import { User } from "@prisma/client";
import { Select } from "@radix-ui/react-select";
import { updateUser } from "../_actions/update-user";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";

interface RoleItemProps {
    user: User
}

const RoleItem = ({ user }: RoleItemProps) => {
    const [updateIsLoading, setUpdateIsLoading] = useState(false);
    const userRole = user.role ? user.role.toLowerCase() : "user";

    const onRoleChange = async (role: string) => {
        setUpdateIsLoading(true);
        try {
            await updateUser({userId: user.id, role: role})         
            toast("Usuário atualizado com sucesso!");    
        } catch (error) {
            console.error(error);
            toast("Erro ao atualizar usário!");    
        } finally {
            setUpdateIsLoading(false);
        }
    }

    return (
        <>
            <Select onValueChange={(value) => {onRoleChange(value)}} defaultValue={userRole}>
                <SelectTrigger className="flex items-center justify-center max-w-28">
                    {updateIsLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {!updateIsLoading &&  <SelectValue placeholder="Role do usuário"/>}
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="user">Usuario</SelectItem>
                    <SelectItem value="master">Master</SelectItem>
                    <SelectItem value="admin">Adm.</SelectItem>
                </SelectContent>
            </Select>
        </>
    );
}

export default RoleItem;