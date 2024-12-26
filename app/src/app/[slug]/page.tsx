import {fetchContributors, fetchLanguages, fetchRepos} from '@/lib/fetchRepos';
import {ProjectDetails} from './project-details';
import {notFound} from 'next/navigation';

interface PageProps {
    params: Promise<{
        slug: string;
    }>;
}

export default async function Page({params}: PageProps) {
    const {slug} = await params;

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