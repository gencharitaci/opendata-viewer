import { SidebarGroup, SidebarGroupContent, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/sidebar/sidebar";
import Link from "next/link";
import { FacebookSVG, InstagramSVG, LinkedInSVG, XTwitterSVG, YouTubeSVG } from "./meck-social-media";

const socialMediaData = [
    {
        title: "Facebook",
        icon: FacebookSVG,
        url: "https://facebook.com/MecklenburgCounty",
        colorClass: "text-sky-700",
    },
    {
        title: "Twitter - X",
        icon: XTwitterSVG,
        url: "https://x.com/MeckCounty",
        colorClass: "text-gray-700",
    },
    {
        title: "YouTube",
        icon: YouTubeSVG,
        url: "https://youtube.com/user/meckgov",
        colorClass: "text-red-700",
    },
    {
        title: "LinkedIn",
        icon: LinkedInSVG,
        url: "https://linkedin.com/company/mecklenburg-county/",
        colorClass: "text-sky-700",
    },
    {
        title: "Instagram",
        icon: InstagramSVG,
        url: "https://instagram.com/mecklenburgcounty/",
        colorClass: "text-red-700",
    },
];

export function SidebarSocialMediaMenu() {
    return (
        <SidebarGroup>
            <SidebarGroupContent>
                <SidebarMenu>
                    {socialMediaData.map((item) => (
                        <SidebarMenuItem key={item.title}>
                            <Link href={item.url} target="_blank"> 
                                <SidebarMenuButton className="flex items-center px-2.5 md:px-2 w-full justify-start">
                                    <item.icon className={`size-3 mx-2 my-0 ${item.colorClass}`} />
                                    {/* Title visible only on mobile */}
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
