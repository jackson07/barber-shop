import Header from "../_components/header";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "../_components/ui/table";
import { db } from "../_lib/prisma";
import RoleItem from "./_components/role-item";

const Users = async () => {
    const users = await db.user.findMany({
    });

    return (
        <>
            <Header />
            <div className="px-5">
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
            </div>
        </>
    );
}

export default Users;
