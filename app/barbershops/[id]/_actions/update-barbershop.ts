"use server";

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";

interface UpdateBarbershopParams {
    formData: FormData
}

export const UpdateBarbershop = async (params: UpdateBarbershopParams) => {
    const id = params.formData.get("id") as string;
    const description = params.formData.get("description") as string;
    const phone = params.formData.get("phone") as string;

    if (description !== null) {
        await db.barbershop.update({
            where: { id },
            data: { description },
        });
    }

    if (phone !== null) {
        await db.barbershop.update({
            where: { id },
            data: { phone },
        });
    }

    revalidatePath("/");
    revalidatePath("/barbershops");
};