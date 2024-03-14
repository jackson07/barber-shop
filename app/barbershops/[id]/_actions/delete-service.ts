"use server";

import { db } from "@/app/_lib/prisma";
import { revalidatePath } from "next/cache";

interface DeleteServiceParams {
  serviceId: string;
}

export const deleteService = async ({serviceId}: DeleteServiceParams) => {  
  const bookingsCount = await db.booking.count({
    where: {
      serviceId: serviceId
    }
  });

  bookingsCount > 0 ?
    await db.service.update({
      where: {
        id: serviceId
    },
      data: {
        active: false,
      },      
    })
  :
  await db.service.delete({
    where: {
        id: serviceId
    }
  });

  revalidatePath("/");
  revalidatePath("/bookings");
};