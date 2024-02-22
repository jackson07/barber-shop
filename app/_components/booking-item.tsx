"use client"

import { Prisma } from "@prisma/client";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";
import { format, isFuture } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Sheet, SheetClose, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet";
import Image from "next/image";
import { Button } from "./ui/button";
import { cancelBooking } from "../_actions/cancel-booking";
import { toast } from "sonner";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";
import BookingInfo from "./booking-info";
import PhoneInfo from "./phone-info";

interface BookingItemProps {
    booking: Prisma.BookingGetPayload<{
        include: {
            service: true,
            barbershop: true
        }
    }>;
}

const BookingItem = ({ booking }: BookingItemProps) => {
    const [isDeleteLoading, setIsDeleteLoading] = useState(false);
    const isBookingConfirm = isFuture(booking.date);

    const handleCancelClick = async () => {
        if (!isBookingConfirm) return;
        setIsDeleteLoading(true);
        try {
            await cancelBooking(booking.id);

            toast.success("Reserva cancelada com sucesso!");
        } catch (error) {
            console.error(error);
        } finally {
            setIsDeleteLoading(false);
        }
    };

    const phones = booking.barbershop.phone?.split('/*/');

    return (
        <Sheet>
            <SheetTrigger asChild>
                <Card className="min-w-full">
                    <CardContent className="p-0 flex">
                        <div className="flex flex-col gap-2 py-5 flex-[3] pl-5">
                            <Badge className="w-fit" variant={
                                isBookingConfirm ? "default" : "secondary"
                            }>
                                {isBookingConfirm ? "Confirmado" : "Finalizado"}
                            </Badge>

                            <h2 className="font-bold">{booking.service.name}</h2>

                            <div className="flex items-center gap-2">
                                <Avatar className="h-6 w-6">
                                    <AvatarImage src={booking.barbershop.imageUrl} />
                                    <AvatarFallback>A</AvatarFallback>
                                </Avatar>

                                <h3 className="text-sm">{booking.barbershop.name}</h3>
                            </div>
                        </div>

                        <div className="flex flex-col items-center justify-center flex-1 border-l border-solid border-secondary">
                            <p className="text-sm capitalize">
                                {format(booking.date, "MMMM", {
                                    locale: ptBR,
                                })}
                            </p>
                            <p className="text-2xl">{format(booking.date, "dd")}</p>
                            <p className="text-sm">{format(booking.date, "hh:mm")}</p>
                        </div>
                    </CardContent>
                </Card>
            </SheetTrigger>

            <SheetContent className="px-0 overflow-y-auto [&::-webkit-scrollbar]:hidden">
                <SheetHeader className="px-5 text-left pb-6 border-b border-solid border-secondary">
                    <SheetTitle>Informações da Reserva</SheetTitle>
                </SheetHeader>

                <div className="px-5">
                    <div className="relative h-[180px] mt-6">
                        <Image
                            src="/barbershop-map.png"
                            fill
                            alt={booking.service.name}
                        />

                        <div className="w-full absolute bottom-4 left-0 px-5">
                            <Card>
                                <CardContent className="p-3 flex gap-2">
                                    <Avatar>
                                        <AvatarImage src={booking.barbershop.imageUrl} />
                                    </Avatar>

                                    <div className="overflow-hidden text-ellipsis text-nowrap text-xs flex flex-col justify-between">
                                        <h2>{booking.barbershop.name}</h2>
                                        <h3 className="text-xs overflow-hidden text-wrap text-ellipsis">{booking.barbershop.address}</h3>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <Badge className="w-fit my-3" variant={
                        isBookingConfirm ? "default" : "secondary"
                    }>
                        {isBookingConfirm ? "Confirmado" : "Finalizado"}
                    </Badge>

                    <BookingInfo booking={booking} />

                    {phones && phones.map((phone, index) => (
                    <div key={index}>
                        <PhoneInfo phone={phone}/>
                    </div>))}

                    <SheetFooter className="flex-row gap-3 mt-6">
                        <SheetClose className="w-full">
                            <Button className="w-full" variant="secondary">Voltar</Button>
                        </SheetClose>

                        <AlertDialog>
                            <AlertDialogTrigger className="w-full">
                                <Button disabled={!isBookingConfirm || isDeleteLoading} className="w-full" variant="destructive">
                                    {isDeleteLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Cancelar Reserva
                                </Button>
                            </AlertDialogTrigger>
                            {isBookingConfirm &&
                                <AlertDialogContent className="w-[90%]">
                                    <AlertDialogHeader>
                                        <AlertDialogTitle>Deseja mesmo cancelar a reserva?</AlertDialogTitle>
                                        <AlertDialogDescription>
                                            Uma vez cancelada, não será possível reverter essa ação.
                                        </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter className="flex-row gap-3">
                                        <AlertDialogCancel className="w-full gap-3 mt-0">Voltar</AlertDialogCancel>
                                        <AlertDialogAction onClick={handleCancelClick} className="w-full gap-3">
                                            {isDeleteLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                            Confirmar
                                        </AlertDialogAction>
                                    </AlertDialogFooter>
                                </AlertDialogContent>
                            }
                        </AlertDialog>

                    </SheetFooter>
                </div>
            </SheetContent>
        </Sheet>
    );
}

export default BookingItem;