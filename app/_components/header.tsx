"use client"
import Image from "next/image";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { MenuIcon } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "./ui/sheet";
import SideMenu from "./side-menu";
import Link from "next/link";

const Header = () => {    
    return ( 
        <header>
            <Card>
                <CardContent className="p-5 justify-between flex flex-row items-center">
                    <Link href="/">
                        <Image src="/logo.png" alt="barber-shop" width={120} height={18}/>
                    </Link>
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button variant="outline" size="icon" className="h-8 w-8">
                                <MenuIcon size={16}/>
                            </Button>
                        </SheetTrigger>

                        <SheetContent className="p-0">
                            <SideMenu />
                        </SheetContent>
                    </Sheet>                    
                </CardContent>
            </Card> 
        </header>
     );
}
 
export default Header;
