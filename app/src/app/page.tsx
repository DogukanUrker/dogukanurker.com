import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"


export default function Home() {
    
    return (
        <div className="h-screen flex flex-col items-center justify-center select-none text-4xl font-bold">
            <div className={"mb-4"}><Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="https://x.com/dogukanurker" target={"_blank"}>X</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="https://github.com/dogukanurker" target={"_blank"}>GitHub</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator/>
                    <BreadcrumbItem>
                        <BreadcrumbLink href="https://youtube.com/@dogukanurker"
                                        target={"_blank"}>Youtube</BreadcrumbLink>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
            </div>
            <h1>Doğukan Ürker</h1>
            <p className={"text-base mt-4"}>Building apps</p>
        </div>
    );
}
