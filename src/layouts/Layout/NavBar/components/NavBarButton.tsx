import { Button } from "@/components/ui/button"


export function NavBarButton({label}: Readonly<{label: string}>) {
    return (
        <div>
            <Button variant={"default"} className='rounded-full font-semibold shadow-md btn-text px-10'>
                {label}
            </Button>
        </div>
    )
}