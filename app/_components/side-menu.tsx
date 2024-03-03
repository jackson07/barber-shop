"use cliente"

import { signIn, signOut, useSession } from "next-auth/react";
import { SheetHeader, SheetTitle } from "./ui/sheet";
import { Avatar, AvatarImage } from "@radix-ui/react-avatar";
import { Button } from "./ui/button";
import { CalendarIcon, HomeIcon, Loader2, LogInIcon, LogOutIcon, UserIcon } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import Link from "next/link";
import { useState } from "react";

const SideMenu = () => {
    const { data } = useSession();
    const [isLoading, setIsLoading] = useState(false);

    const handleLogoutClick = () => {
        setIsLoading(true);
        signOut().finally(() => {
            setIsLoading(false);
        })
    }
    const handleLoginClick = () => signIn("google")

    console.log(data?.user.role)

    return (
        <>
            <SheetHeader className="text-left border-b border-solid border-secondary p-5">
                <SheetTitle>Menu</SheetTitle>
            </SheetHeader>

            {data?.user ? (
                <div className="flex justify-between px-5 py-6 items-center">
                    <div className="flex items-center gap-3">
                        <Avatar >
                            <AvatarImage className="rounded-full w-10 h-10" src={data.user?.image ?? ""} />
                        </Avatar>

                        <h2 className="font-bold">{data.user?.name}</h2>
                    </div>

                    <AlertDialog>
                        <AlertDialogTrigger>{
                            <Button variant="secondary" size="icon">
                                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                                {!isLoading && <LogOutIcon />}
                            </Button>
                        }</AlertDialogTrigger>
                        <AlertDialogContent className="w-[90%]">
                            <AlertDialogHeader>
                                <AlertDialogTitle>Deseja mesmo sair da sua conta?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    Se você sair, poderá efetuar o login novamente!
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter className="flex-row gap-3">
                                <AlertDialogCancel className="w-full mt-0">Voltar</AlertDialogCancel>
                                <AlertDialogAction className="w-full" onClick={handleLogoutClick}>Sair</AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            ) : (
                <div className="flex flex-col px-5 py-6 gap-3">
                    <div className="flex items-center gap-2">
                        <UserIcon />
                        <h2 className="font-bold">Olá, faça seu login!</h2>
                    </div>
                    <Button variant="secondary" className="w-full justify-start" onClick={handleLoginClick}>
                        <LogInIcon className="mr-2" size={18} />
                        <p>Fazer Login</p>
                    </Button>
                </div>
            )}
            <div className="flex flex-col gap-3 px-5">
                <Button variant="outline" className="justify-start" asChild>
                    <Link href="/">
                        <HomeIcon size={18} className="mr-2 " />
                        Início
                    </Link>
                </Button>

                {data?.user && (
                    <Button variant="outline" className="justify-start" asChild>
                        <Link href="/bookings">
                            <CalendarIcon size={18} className="mr-2 " />
                            Agendamentos
                        </Link>
                    </Button>
                )}
                
                {data?.user.role === 'admin' && (
                    <Button variant="outline" className="justify-start" asChild>
                        <Link href="/users">
                            <UserIcon size={18} className="mr-2 " />
                            Usuários
                        </Link>
                    </Button>
                )}
            </div>
        </>
    );
}

export default SideMenu;