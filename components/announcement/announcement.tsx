import { Alert, AlertDescription, AlertTitle } from "../ui/alert"
import { AnnouncementClose } from "./announcement-close"


interface AnnouncementProps {
    showAnnouncement: boolean
    onHide: () => void
    icon?: React.ReactNode
    title?: React.ReactNode
    description: React.ReactNode
}


export function Announcement({
    showAnnouncement,
    onHide,
    icon,
    title,
    description,
}: AnnouncementProps) {
    if (!showAnnouncement) return null

    return (
        <Alert className="relative isolate mx-2 xs:mx-2 w-auto flex flex-col justify-start overflow-hidden rounded-lg border border-sky-600/25 bg-gradient-to-r from-sky-100/80 to-sky-200/80 sm:flex-row sm:items-center sm:py-2 sm:gap-x-2">
            <div className="flex items-center gap-1">
                {icon && (
                    <div className="flex items-center justify-center rounded-full border border-sky-600/50 bg-white/70 p-1 shadow-[inset_0_0_1px_1px_#fff]">
                        {icon}
                    </div>
                )}
                {title && (
                    <AlertTitle className="text-xs font-semibold text-gray-900 my-auto">
                        {title}
                    </AlertTitle>
                )}
                <AlertDescription className="text-xs text-gray-900 sm:ml-0 text-wrap">
                    {description}
                </AlertDescription>

            </div>

            <AnnouncementClose onHide={onHide} />
        </Alert>
    )
}
