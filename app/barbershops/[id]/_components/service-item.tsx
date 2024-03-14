"use client"

import { Button } from "@/app/_components/ui/button";
import { Calendar } from "@/app/_components/ui/calendar";
import { Card, CardContent } from "@/app/_components/ui/card";
import { Sheet, SheetContent, SheetFooter, SheetHeader, SheetTitle, SheetTrigger } from "@/app/_components/ui/sheet";
import { Barbershop, Booking, Service } from "@prisma/client";
import { ptBR } from "date-fns/locale";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";
import { generateDayTimeList } from "../_helper/hours";
import { addDays, format, setHours, setMinutes } from "date-fns";
import { saveBooking } from "../_actions/save-booking";
import { Loader2, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner"
import { getDayBookings } from "../_actions/get-day-bookings";
import BookingInfo from "@/app/_components/booking-info";
import ServiceDelete from "./service-delete";

interface ServiceItemProps {
    barbershop: Barbershop;
    service: Service;
    isAuthenticated: boolean;
}

const ServiceItem = ({ service, barbershop, isAuthenticated }: ServiceItemProps) => {
    const router = useRouter();
    const { data } = useSession();
    const [isLoginLoading, setIsLoginLoading] = useState(false);
    const [date, setDate] = useState<Date | undefined>(undefined)
    const [hour, setHour] = useState<string | undefined>()
    const [submitIsLoading, setSubmitIsLoading] = useState(false);
    const [sheetIsOpen, setSheetIsOpen] = useState(false);
    const [dayBookings, setDayBookings] = useState<Booking[]>([]);
    const [isLoading, setIsLoading] = useState<Boolean>(false);

    useEffect(() => {
        if (!date) {
            return
        }

        const refreshAvailableHours = async () => {
            setIsLoading(true);
            try {
                const _dayBookings = await getDayBookings(barbershop.id, date)
                setDayBookings(_dayBookings);
            } finally {
                setIsLoading(false);
            }
        }

        refreshAvailableHours();
    }, [date, barbershop.id])

    const handleDateClick = (date: Date | undefined) => {
        setDate(date);
        setHour(undefined);
    }

    const handleHourClick = (time: string) => {
        setHour(time)
    }

    const handleBookingClick = async () => {
        setIsLoginLoading(!isAuthenticated);
        if (!isAuthenticated) await signIn("google").then(() => {
            toast("Necessário efetuar o login!");
            setIsLoginLoading(false);
        })
            .catch((e) => {
                console.error(e.message)
            })

        setSheetIsOpen(true);

        <SheetTrigger asChild>
            Agendar
        </SheetTrigger>
    }

    const handleBookingSubmit = async () => {
        setSubmitIsLoading(true);
        try {
            if (!hour || !date || !data?.user) {
                return;
            }
            const dateHour = Number(hour.split(":")[0]);
            const dateMinutes = Number(hour.split(":")[1]);

            const newDate = setMinutes(setHours(date, dateHour), dateMinutes);

            await saveBooking({
                serviceId: service.id,
                barbershopId: barbershop.id,
                date: newDate,
                userId: data.user.id,
            });

            setSheetIsOpen(false);
            setHour(undefined);
            setDate(undefined);
            toast("Agendamento realizado com sucesso!", {
                description: format(newDate, "'Para' dd 'de' MMMM 'às' HH':'mm'.'", {
                    locale: ptBR,
                }),
                action: {
                    label: "Visualizar",
                    onClick: () => router.push("/bookings"),
                },
            });
        } catch (error) {
            console.error(error);
            let errorMessage = '';

            if (error instanceof Error) {
                errorMessage = error.message;
            }

            toast("Erro ao confirmar o agendamento, atualize a página ou refaça o login no menu.", {
                description: errorMessage
            });
        } finally {
            setSubmitIsLoading(false);
        }
    };

    const timeList = useMemo(() => {
        if (!date) {
            return []
        }

        const days = generateDayTimeList(date).filter(time => {
            const timeHour = Number(time.split(":")[0])
            const timeMinutes = Number(time.split(":")[1])

            const booking = dayBookings.find(booking => {
                const bookingHour = booking.date.getHours();
                const bookingMinutes = booking.date.getMinutes();

                return bookingHour === timeHour && bookingMinutes === timeMinutes;
            })
            if (!booking) {
                return true
            }
            return false
        })

        return days;
    }, [date, dayBookings])

    return (
        <Card>
            <CardContent className="p-3 w-full">
                <div className="flex gap-4 items-center w-full">
                    <div className="relative min-h-[110px] max-h-[110px] min-w-[110px] max-w-[110px]">
                        <Image
                            className="rounded-lg"
                            src={service.imageUrl}
                            fill
                            alt={service.name}
                            style={{ objectFit: "contain" }}
                        />
                    </div>
                    <div className="flex flex-col w-full">
                        <h2 className="font-bold">{service.name}</h2>
                        <p className="text-sm text-gray-400">{service.description}</p>

                        <div className="flex items-center justify-between mt-3 ">
                            <p className="text-primary text-sm font-bold">{Intl.NumberFormat(
                                "pt-BR", {
                                style: "currency", currency: "BRL",
                            }).format(Number(service.price))}</p>

                            <Sheet open={sheetIsOpen && isAuthenticated} onOpenChange={setSheetIsOpen}>
                                <Button variant="secondary" onClick={handleBookingClick}>
                                    {isLoginLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                    Agendar
                                </Button>

                                <ServiceDelete service={service}/>


                                <SheetContent className="p-0  overflow-y-auto [&::-webkit-scrollbar]:hidden">
                                    <SheetHeader className="text-left px-5 py-6 border-b border-solid border-secondary">
                                        <SheetTitle>
                                            Fazer Reverva
                                        </SheetTitle>
                                    </SheetHeader>

                                    <div className="py-6">
                                        <Calendar
                                            mode="single"
                                            selected={date}
                                            onSelect={handleDateClick}
                                            locale={ptBR}
                                            fromDate={addDays(new Date(), 1)}
                                            styles={{
                                                head_cell: {
                                                    width: "100%",
                                                    textTransform: "capitalize",
                                                },
                                                cell: {
                                                    width: "100%",
                                                },
                                                button: {
                                                    width: "100%",
                                                },
                                                nav_button_previous: {
                                                    width: "32px",
                                                    height: "32px",
                                                },
                                                nav_button_next: {
                                                    width: "32px",
                                                    height: "32px",
                                                },
                                                caption: {
                                                    textTransform: "capitalize",
                                                }
                                            }}
                                        />
                                    </div>

                                    {date && (
                                        isLoading ?
                                            <div className="flex items-center justify-center border-t border-solid border-secondary">
                                                <Loader2 className="h-8 w-8 animate-spin m-4" />
                                            </div>
                                            : <div className="flex overflow-x-auto py-6 px-5 border-t 
                                                            border-solid border-secondary 
                                                            [&::-webkit-scrollbar]:hidden gap-3">
                                                {timeList.map((time) => (
                                                    <Button variant={
                                                        hour === time ? 'default' : 'outline'
                                                    } className="rounded-full" key={time} onClick={() => handleHourClick(time)}>
                                                        {time}
                                                    </Button>
                                                ))}
                                            </div>

                                    )}

                                    <div className="py-6 px-5 border-t border-solid-border-secondary gap-3 flex flex-col">
                                        <BookingInfo booking={{
                                            barbershop: barbershop,
                                            date:
                                                date &&
                                                    hour ?
                                                    setMinutes(setHours(date, Number(hour.split(":")[0])), Number(hour.split(":")[1])) : undefined,
                                            service: service
                                        }} />

                                        <SheetFooter>
                                            <Button onClick={handleBookingSubmit} disabled={!hour || !date || submitIsLoading}>
                                                {submitIsLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                                Confirmar Agendamento
                                            </Button>
                                        </SheetFooter>
                                    </div>
                                </SheetContent>
                            </Sheet>
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default ServiceItem;