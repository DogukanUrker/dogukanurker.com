import {fetchContributors, fetchLanguages, fetchRepos} from '@/lib/fetchRepos';
import {ProjectDetails} from './project-details';
import {notFound} from 'next/navigation';
import {Skeleton} from "@/components/ui/skeleton";
import {Card, CardContent, CardHeader} from '@/components/ui/card';

export default async function Page({params}: { params: { slug: string } }) {
    const {slug} = params;

    if (!slug) {
        notFound();
    }

    try {
        const token = process.env.NEXT_PUBLIC_GITHUB_API_KEY || '';
        const data = await fetchRepos('dogukanurker', token);
        const currentRepo = data.find(r => r.name.toLowerCase() === slug.toLowerCase());

        if (!currentRepo) {
            notFound();
        }

        // Fetch additional data
        const [languagesData, contributorsData] = await Promise.all([
            fetchLanguages(currentRepo.languages_url, token),
            fetchContributors(currentRepo.contributors_url, token)
        ]);

        return (
            <ProjectDetails
                repo={currentRepo}
                languages={languagesData}
                contributors={contributorsData}
            />
        );
    } catch (error) {
        console.error('Error fetching data:', error);
        notFound();
    }
}

// Loading state
export function Loading() {
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