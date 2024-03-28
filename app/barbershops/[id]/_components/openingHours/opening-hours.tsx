"use client"

import { getWeekdayName } from "@/app/_lib/utils";
import { OpeningHour } from "@prisma/client";
import Hours from "./hours";

interface OpeningHoursProps {
    openingHours: OpeningHour[]
}

const OpeningHours = ({ openingHours }: OpeningHoursProps) => {
    return (
        <div className="px-5 flex flex-col gap-4 max-w-[500px] pb-5">
            <h2 className="text-gray-400 uppercase text-xs font-bold">Horário de Funcionamento</h2>
            <ul>
                {openingHours.map(hour => (
                    <li key={hour.id} className="" >                        
                        <Hours hour={hour} />
                    </li>
                ))}
            </ul>
        </div>
    );
}

export default OpeningHours;