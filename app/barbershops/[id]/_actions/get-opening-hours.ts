"use server"

import { db } from "@/app/_lib/prisma"

export const getOpeningHours = async (barbershopId: string) => {
    const openingHour = await db.openingHour.findMany({
        where: {
            barbershopId: barbershopId,
        },
    });

    return openingHour;
}