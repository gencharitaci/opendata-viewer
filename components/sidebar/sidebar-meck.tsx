import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/sidebar/sidebar";
import Link from "next/link";
import { MecklenburgGISLogo, MecklenburgLogo } from "./meck-social-media";

const MecklenburgLinks = [
    {
        title: "Mecklenburg County",
        logo: MecklenburgLogo,
        url: "https://mecknc.gov/",
        colorClass: "text-red-700",
    },
    {
        title: "Mecklenburg GIS",
        logo: MecklenburgGISLogo,
        url: "https://gis.mecknc.gov/",
        colorClass: "text-red-700",
    },
];

export function SidebarMecklenburgMenu() {
    return (
        <SidebarGroup>
            <SidebarGroupContent className="mt-2">
                <SidebarMenu>
                    {MecklenburgLinks.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <Link href={item.url} target="_blank">
                                <SidebarMenuButton className="flex items-center px-2.5 md:px-2 w-full justify-start">
                                    <item.logo />
                                    <span className="block sm:hidden ml-2 text-sm">{item.title}</span>
                                </SidebarMenuButton>
                            </Link>
                        </SidebarMenuItem>
                    ))}
                </SidebarMenu>
            </SidebarGroupContent>
        </SidebarGroup>
    );
}
