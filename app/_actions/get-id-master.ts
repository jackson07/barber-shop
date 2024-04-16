"use server"

import { db } from "../_lib/prisma";

export const getIdMaster = async (barbershopID: string): Promise<string | null> => {
    const data = await db.barbershop.findUnique({
        where: {
            id: barbershopID
        }
    })

    return data ? data.userId : null;
}