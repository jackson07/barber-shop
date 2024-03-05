import { db } from "@/app/_lib/prisma";
import BarberShopInfo from "./_components/barbershop-info";
import { redirect } from "next/navigation";
import BarbershopTabs from "./_components/barbershop-tabs";
import { authOption } from "@/app/_lib/auth";
import { getServerSession } from "next-auth";

interface BarbershopDetailsPageProps {
    params: {
        id?: string,
    }
}

const BarbershopDetailsPage = async ({ params }: BarbershopDetailsPageProps) => {
    const session = await getServerSession(authOption) 
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
            <BarbershopTabs barbershop={barbershop} barbershopTable={barbershop} IsAuthenticated={!!session?.user} />        
        </div >
    )

}

export default BarbershopDetailsPage;