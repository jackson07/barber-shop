import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Badge } from "./ui/badge";
import { Card, CardContent } from "./ui/card";

const BookingItem = () => {
    return ( 
       <Card>
            <CardContent className="p-5">
                <div className="flex flex-col gap-2">
                    <Badge className="bg-[#221C3D] text-primary hover:bg-[#221C3D] w-fit">
                        Confirmado
                    </Badge>
                    <h2 className="font-bold">Corte de Cabelo</h2>
                    <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                            <AvatarImage src="https://utfs.io/f/c4919193-a675-4c47-9f21-ebd86d1c8e6a-4oen2a.png" />
                            <AvatarFallback>A</AvatarFallback>
                        </Avatar>

                        <h3 className="text-sm">Vintage Barber</h3>
                    </div>
                </div>
            </CardContent>
       </Card> 
    );
}
 
export default BookingItem;