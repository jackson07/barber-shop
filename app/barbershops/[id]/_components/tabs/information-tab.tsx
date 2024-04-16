"use client"

import { getWeekdayName } from "@/app/_lib/utils";
import { Prisma } from "@prisma/client";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import BarbershopDescription from "../barbershop/barbershop-description";
import PhoneInformation from "../phone/phone-information";
import OpeningHours from "../openingHours/opening-hours";

interface InformationTabProps {
    barbershop: Prisma.BarbershopGetPayload<{
        include: {
            openingHour: true,
        }
    }>
}

const InformationTab = ({ barbershop }: InformationTabProps) => {    
    return (
        <div className="flex flex-col gap-4">
            <BarbershopDescription barbershop={barbershop} />

            <PhoneInformation barbershop={barbershop} />

            <OpeningHours openingHours={barbershop.openingHour} barbershopUserID={barbershop.userId as string}/>
        </div>
    );
}

export default InformationTab;