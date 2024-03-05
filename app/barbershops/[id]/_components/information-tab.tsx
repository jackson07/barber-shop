"use client"

import PhoneInfo from "@/app/_components/phone-info";
import { getWeekdayName } from "@/app/_lib/utils";
import { Barbershop, OpeningHour } from "@prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useEffect, useState } from "react";
import { getOpeningHours } from "../_actions/get-opening-hours";
import { Loader2 } from "lucide-react";

interface InformationTabProps {
    barbershop: Barbershop
}

const InformationTab = ({ barbershop }: InformationTabProps) => {
    const [openingHours, setOpeningHours] = useState<OpeningHour[]>([]);
    const [loadingHours, setLoadingHours] = useState<boolean>(true)

    const phones = barbershop.phone?.split('/*/');

    useEffect(() => {    
        setLoadingHours(true);   
        const refreshOpeningsHours = async () => {
            const _openingHour = await getOpeningHours(barbershop.id);

            setOpeningHours(_openingHour);
        }

        refreshOpeningsHours();
        setLoadingHours(false);
    }, [barbershop.id])

    return (
        <div className="flex flex-col gap-4">
            <div className="px-5 py-4 border-b flex flex-col gap-2 border-solid border-secondary">
                <p className="text-gray-400 uppercase text-xs font-bold">Sobre nós</p>
                <div className="text-[14px]">
                    {barbershop.description}
                </div>
            </div>

            <div className="px-5 pb-4 border-b border-solid border-secondary">
                {phones && phones.map((phone, index) => (
                    <div key={index}>
                        <PhoneInfo phone={phone} />
                    </div>))}
            </div>

            <div className="px-5 flex flex-col gap-4 max-w-[500px] pb-5">
                <h2 className="text-gray-400 uppercase text-xs font-bold">Horário de Funcionamento</h2>
                <ul>
                    {loadingHours && (
                    <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        <p className="text-gray-400 uppercase text-xs font-bold">Carregando Horários</p>
                    </>
                    )
                    }
                    {openingHours.map(hour => (
                        <li key={hour.id} className="flex justify-between py-2" >
                            <span className="font-semibold text-gray-400 uppercase text-xs">{getWeekdayName(hour.day)}</span>
                            <span>
                                {format(hour.dateStart.toISOString(), "HH:mm", {
                                    locale: ptBR,
                                })} - {format(hour.dateEnd.toISOString(), "HH:mm", {
                                    locale: ptBR,
                                })}
                            </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default InformationTab;