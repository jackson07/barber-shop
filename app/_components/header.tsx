import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { MenuIcon } from "lucide-react";

const Header = () => {
    return ( 
        <Card>
            <CardContent className="p-5 justify-between flex flex-row items-center">
                <Image src="/logo.png" alt="barber-shop" width={120} height={18}/>
                    <Button variant="outline" size="icon" className="h-8 w-8">
                        <MenuIcon />
                    </Button>
            </CardContent>
        </Card>
     );
}
 
export default Header;
