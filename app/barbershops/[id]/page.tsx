import { db } from "@/app/_lib/prisma";
import BarberShopInfo from "./_components/barbershop-info";
import ServiceItem from "./_components/service-item";
import { getServerSession } from "next-auth";
import { authOption } from "@/app/_lib/auth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/_components/ui/tabs";
import { Button } from "@/app/_components/ui/button";
import PhoneInfo from "@/app/_components/phone-info";

interface BarbershopDetailsPageProps {
    params: {
        id?: string,
    }
}

const BarbershopDetailsPage = async ({ params }: BarbershopDetailsPageProps) => {
    const session = await getServerSession(authOption)
    if (!params.id) {
        // TODO retornar a homepage
        return null;
    }

    const barbershop = await db.barbershop.findUnique({
        where: {
            id: params.id,
        },
        include: {
            services: true
        }
    });

    if (!barbershop) {
        // TODO retornar a homepage
        return null;
    }
    const phones = barbershop.phone?.split('/*/');

    return (
        <div>
            <BarberShopInfo barbershop={barbershop} />

            <Tabs defaultValue="services" className="py-4">
                <TabsList className="flex justify-start bg-default text-white px-5">
                    <TabsTrigger value="services">Serviços</TabsTrigger>
                    <TabsTrigger value="information">Informações</TabsTrigger>
                </TabsList>
                <TabsContent value="services">
                    <div className="px-5 flex flex-col gap-4 py-6">
                        {barbershop.services.map(service => (
                            <ServiceItem key={service.id} barbershop={barbershop} service={service} isAuthenticated={!!session?.user} />
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="information">
                    <div className="flex flex-col gap-4">
                        <div className="px-5 py-4 border-b flex flex-col gap-2 border-solid border-secondary">
                            <p className="text-gray-400 uppercase text-xs font-bold">Sobre nós</p>
                            <div className="text-[14px]">
                                {barbershop.description}
                            </div>
                        </div>

                        <div className="px-5 pb-4 border-b border-solid border-secondary">
                            {phones && phones.map((phone, index) => (
                            <div key={index}>
                                <PhoneInfo phone={phone}/>
                            </div>))}
                        </div>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    )

}

export default BarbershopDetailsPage;