"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/app/_components/ui/tabs";
import ServiceItem from "../service/service-item";
import { Prisma } from "@prisma/client";
import InformationTab from "../tabs/information-tab";
import ServiceCreate from "../service/service-create";
import ServicesTab from "../tabs/services-tab";

interface BarbershopTabsProps {
    barbershop: Prisma.BarbershopGetPayload<{
        include: {
            openingHour: true,
            services: true,
        },
    }>
}

const BarbershopTabs = ({ barbershop }: BarbershopTabsProps) => {
    const services = barbershop.services
        .filter(service => service.active === true)
        .sort((a, b) => a.name.localeCompare(b.name));

    return (
        <Tabs defaultValue="services" className="py-4">
            <TabsList className="flex justify-start bg-default text-white px-5">
                <TabsTrigger value="services">Serviços</TabsTrigger>
                <TabsTrigger value="information">Informações</TabsTrigger>
            </TabsList>
            <TabsContent value="services" className="p-5">
                <ServicesTab barbershop={barbershop} service={services}/>
            </TabsContent>
            <TabsContent value="information">
                <InformationTab barbershop={barbershop} />
            </TabsContent>
        </Tabs>
    );
}

export default BarbershopTabs;