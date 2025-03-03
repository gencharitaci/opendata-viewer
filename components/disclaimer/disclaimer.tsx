import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { Separator } from "@radix-ui/react-separator";
import Cookies from "js-cookie";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { useIsMobile } from "@/hooks/use-mobile";

const Disclaimer = () => {
    const isMobile = useIsMobile();
    const [isOpen, setIsOpen] = useState(false);
    const [dontShowAgain, setDontShowAgain] = useState(false);

    useEffect(() => {
        // Check if the "disclaimerAccepted" cookie exists
        const disclaimerAccepted = Cookies.get("disclaimerAccepted");
        if (!disclaimerAccepted) {
            // Open the dialog if the cookie does not exist
            setIsOpen(true);
        }
    }, []);

    const handleAccept = () => {
        if (dontShowAgain) {
            // Set a cookie to remember that the disclaimer was accepted
            Cookies.set("disclaimerAccepted", "true", { expires: 30 }); // Expires in 30 days
        }
        setIsOpen(false);
    };

    return (
        <Dialog
            open={isOpen}
            // Prevent closing with the escape key or outside click
            onOpenChange={(open) => setIsOpen(open && !dontShowAgain)}
        >
            <DialogContent 
                className={`bg-gradient-to-r from-sky-700/20 via-amber-500/20 to-sky-300/20 rounded-2xl opacity-85 transition-opacity duration-300 ease-in-out 
                ${isMobile ? 'w-[80vw] px-4' : 'w-[512px]'}`}>
                <DialogHeader>
                    <DialogTitle className="pb-2 text-orange-800">Disclaimer</DialogTitle>
                    <Separator className="w-full h-[0.5px] bg-gray-300" />
                    <DialogDescription className="pt-2 text-justify">
                        <p className="mb-4">
                            This GIS tool provides information for general reference only and should not be considered a legal document.
                        </p>
                        <p className="mb-4">
                            Data may not be completely accurate and users should always consult primary sources, such as recorded deeds and plats,
                            to verify information before making any decisions based on this data.
                        </p>
                        <p className="mb-4">
                            Mecklenburg County, NC assumes no liability for errors or omissions within the GIS data and provides it &apos;as is&apos; without warranty
                        </p>
                        <span className="text-orange-900"> (NCGS 153A-463).</span>
                    </DialogDescription>
                </DialogHeader>
                <Separator className="w-full h-[0.5px] bg-gray-300" />
                <DialogFooter className="flex px-0 py-0">
                    <div className="flex flex-1 justify-between px-1">
                        <div className="flex flex-1 justify-start py-2">
                            <Input
                                type="checkbox"
                                id="dontShowAgain"
                                className="w-4 h-4 border-gray-300 rounded mr-2"
                                checked={dontShowAgain}
                                onChange={(e) => setDontShowAgain(e.target.checked)}
                            />
                            <Label
                                className="text-sm text-gray-700 cursor-pointer"
                            >
                                Don&apos;t show again
                            </Label>
                        </div>
                        <Button
                            onClick={handleAccept}
                            className="px-3 py-2 text-sm text-white font-bold transition duration-150 hover:text-gray-700">
                            Accept
                        </Button>
                    </div>
                </DialogFooter>

            </DialogContent>
        </Dialog>
    );
};

export default Disclaimer;
