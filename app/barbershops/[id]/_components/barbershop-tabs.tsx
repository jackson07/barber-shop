"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/_components/ui/tabs";
import ServiceItem from "./service-item";
import { Barbershop, Prisma } from "@prisma/client";
import InformationTab from "./information-tab";

interface BarbershopTabsProps {
    barbershop: Prisma.BarbershopGetPayload<{
        include: {
            services: true,
        }
    }>
    barbershopTable : Barbershop
    IsAuthenticated : boolean
}

const BarbershopTabs = ({barbershop,barbershopTable,IsAuthenticated}:BarbershopTabsProps) => {
    return (
        <Tabs defaultValue="services" className="py-4">
            <TabsList className="flex justify-start bg-default text-white px-5">
                <TabsTrigger value="services">Serviços</TabsTrigger>
                <TabsTrigger value="information">Informações</TabsTrigger>
            </TabsList>
            <TabsContent value="services">
                <div className="px-5 flex flex-col gap-4 py-6">
                    {barbershop.services.map(service => (
                        <ServiceItem key={service.id} barbershop={barbershop} service={service} isAuthenticated={IsAuthenticated} />
                    ))}
                </div>
            </TabsContent>
            <TabsContent value="information">
                <InformationTab barbershop={barbershopTable}/>
            </TabsContent>
        </Tabs>
    );
}

export default BarbershopTabs;