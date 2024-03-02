import { format } from "date-fns";
import Header from "../_components/header";
import { ptBR } from "date-fns/locale";
import Search from "./_components/search";
import BookingItem from "../_components/booking-item";
import { db } from "../_lib/prisma"
import BarberShopItem from "./_components/barbsershop-item";
import { getServerSession } from "next-auth";
import { authOption } from "../_lib/auth";

export default async function Home() {
    const session = await getServerSession(authOption);

    const [barbershops, recomendedBarbershops, confirmedBookings] = await Promise.all([
        db.barbershop.findMany({}),
        db.barbershop.findMany({
            orderBy: {
                id: "asc",
            }
        }),
        session?.user
            ? await db.booking.findMany({
                where: {
                    userId: (session.user as any).id,
                    date: {
                        gte: new Date(),
                    }
                },
                include: {
                    service: true,
                    barbershop: true,
                }
            })
            : Promise.resolve([])
    ]);

    return (
        <div>
            <Header />
            <div className="px-5 pt-5">
                <h2 className="text-xl font-bold">{session?.user ? `Olá, ${session.user.name?.split(" ")[0]}` : 'Seja Bem vindo!'}</h2>
                <p className="capitalize text-sm">
                    {format(new Date(), "EEEE',' dd 'de' MMMM", {
                        locale: ptBR
                    })}
                </p>
            </div>

            <div className="px-5 mt-6">
                <Search />
            </div>

            {confirmedBookings.length > 0 && (
                <div className="mt-6">
                    <h2 className="pl-5 text-xs uppercase text-gray-400 font-bold mb-3">Agendamentos</h2>
                    <div className="px-5 flex gap-3 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                        {confirmedBookings.map((booking) => (
                            <BookingItem key={booking.id} booking={booking} />
                        ))}
                    </div>
                </div>
            )}

            <div className="pl-5 mt-6">
                <h2 className="text-xs uppercase text-gray-400 font-bold mb-3">Recomendados</h2>
                <div className="flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                    {barbershops.map((barbershop) => (
                        <div key={barbershop.id} className="min-w-[220px] max-w-[220px]">
                            <BarberShopItem barbershop={barbershop} />
                        </div>
                    ))}
                </div>
            </div>
            <div className="pl-5 mt-6 mb-[4.5rem]">
                <h2 className="text-xs uppercase text-gray-400 font-bold mb-3">Populares</h2>
                <div className="flex gap-4 overflow-x-auto [&::-webkit-scrollbar]:hidden">
                    {recomendedBarbershops.map((barbershop) => (
                        <div key={barbershop.id} className="min-w-[220px] max-w-[220px]">
                            <BarberShopItem barbershop={barbershop} />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
