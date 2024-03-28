"use server";

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";

interface UpdateHourParams {
    id: string;
    barbershopId: string;
    day: number;
    dateStart: Date;
    dateEnd: Date;
}

export const UpdateHours = async (params: UpdateHourParams) => {
    try {
        await db.openingHour.update({
            where: {
                id: params.id,
                day: params.day,                
                barbershopId: params.barbershopId
            },
            data: {                
                dateStart: new Date(params.dateStart),
                dateEnd: new Date(params.dateEnd)
            },
        });

        revalidatePath("/");
        revalidatePath("/barbershops");
    } catch (error) {
        console.error("Erro ao atualizar o horário:", error);
        throw new Error("Erro ao atualizar o horário");
    }
};