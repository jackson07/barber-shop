"use server";

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";

interface DeleteServiceParams {
  serviceId: string;
}

export const deleteService = async ({serviceId}: DeleteServiceParams) => {
  await db.service.delete({
    where: {
        id: serviceId
    }
  });

  revalidatePath("/");
  revalidatePath("/bookings");
};