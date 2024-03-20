"use client"

import { getWeekdayName } from "@/app/_lib/utils";
import { Prisma } from "@prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import BarbershopDescription from "./barbershop-description";
import PhoneInformation from "./phone-information";

interface InformationTabProps {
    barbershop: Prisma.BarbershopGetPayload<{
        include: {
            openingHour: true,
        }
    }>
}

const InformationTab = ({ barbershop }: InformationTabProps) => {    
    const openingHours = barbershop.openingHour;

    return (
        <div className="flex flex-col gap-4">
            <BarbershopDescription barbershop={barbershop} />

            <PhoneInformation barbershop={barbershop} />

            <div className="px-5 flex flex-col gap-4 max-w-[500px] pb-5">
                <h2 className="text-gray-400 uppercase text-xs font-bold">Horário de Funcionamento</h2>
                <ul>
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