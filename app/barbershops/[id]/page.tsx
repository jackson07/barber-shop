import { db } from "@/app/_lib/prisma";
import BarberShopInfo from "./_components/barbershop/barbershop-info";
import { redirect } from "next/navigation";
import BarbershopTabs from "./_components/barbershop/barbershop-tabs";

interface BarbershopDetailsPageProps {
    params: {
        id?: string,
    }
}

const BarbershopDetailsPage = async ({ params }: BarbershopDetailsPageProps) => {
    if (!params.id) {
        return redirect('/')
    }

    const barbershop = await db.barbershop.findUnique({
        where: {
            id: params.id,
        },
        include: {
            services: true,
            openingHour: true
        }
    });
 
    if (!barbershop) {
        return redirect('/')
    }

    if (barbershop.openingHour) {
        barbershop.openingHour.sort((a, b) => a.day - b.day);
    }

    return (
        <div>
            <BarberShopInfo barbershop={barbershop} />
            <BarbershopTabs barbershop={barbershop} />        
        </div >
    )

}

export default BarbershopDetailsPage;