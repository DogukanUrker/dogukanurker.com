import {Skeleton} from "@/components/ui/skeleton";
import {Card, CardContent, CardHeader} from '@/components/ui/card';

export default function Loading() {
    return (
        <div className="container mx-auto py-10 space-y-8">
            <Skeleton className="h-8 w-48"/>
            <Card>
                <CardHeader>
                    <Skeleton className="h-8 w-3/4 mb-2"/>
                    <Skeleton className="h-4 w-full"/>
                </CardHeader>
                <CardContent className="space-y-8">
                    <div className="space-y-4">
                        <Skeleton className="h-4 w-full"/>
                        <Skeleton className="h-4 w-full"/>
                        <Skeleton className="h-4 w-3/4"/>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}