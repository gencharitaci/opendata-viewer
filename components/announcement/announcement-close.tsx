import { X } from "lucide-react";
import { Button } from "../ui/button";

interface AnnouncementCloseProps {
    onHide: () => void
}

export function AnnouncementClose({
    onHide,
}: AnnouncementCloseProps) {
    return (
        <Button
            variant={"ghost"}
            className="absolute inset-y-0 right-2.5 my-auto p-1 text-sm text-sky-700 underline transition-colors hover:text-sky-900"
            onClick={onHide}
        >
            <X className="h-8 w-8" />
        </Button>
    )
}