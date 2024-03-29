"use client"

import { useEffect, useState } from "react";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../../_components/ui/table";
import { getUsers } from "../_actions/get-users";
import { User } from "@prisma/client";
import RoleItem from "./role-item";
import { Loader2 } from "lucide-react";

const UsersList = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [userLoading, setUserLoading] = useState<Boolean>(true);

    useEffect(() => {
        const refreshOpeningsHours = async () => {
            setUserLoading(true);
            try {
                const _users = await getUsers();
                setUsers(_users);
            } finally {
                setUserLoading(false);
            }
        }

        refreshOpeningsHours();
    }, [])

    return (
        <>
            {userLoading ?
                <div className="flex items-center justify-center mt-6">
                    <Loader2 className="mr-6 h-8 w-4 animate-spin" />
                    <p className="text-gray-400 uppercase text-xs font-bold">Carregando Usuários</p>
                </div>
                :
                <Table>
                    <TableCaption className="text-gray-400 uppercase text-xs font-bold">Listagem de usuários.</TableCaption>
                    <TableHeader>
                        <TableRow className="text-gray-400 uppercase text-xs font-bold">
                            <TableHead>Nome</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Nível</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody className="text-xs">
                        {users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="max-w-10">{user.name}</TableCell>
                                <TableCell className="max-w-28 overflow-auto">{user.email}</TableCell>
                                <TableCell className="p-1">
                                    <RoleItem user={user} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            }
        </>
    );
}

export default UsersList;