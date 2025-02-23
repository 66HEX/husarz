import { features } from "@/app/data/features";
import { notFound } from "next/navigation";
import SectionContent from "./SectionContent";
import type { Metadata } from "next";

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function SectionPage({
                                              params
                                          }: PageProps) {
    const resolvedParams = await params;
    const section = features.find(feature => feature.slug === resolvedParams.slug);

    if (!section) {
        notFound();
    }

    return <SectionContent section={section} />;
}

export function generateStaticParams() {
    return features.map((feature) => ({
        slug: feature.slug,
    }));
}

export async function generateMetadata({
                                           params
                                       }: PageProps): Promise<Metadata> {
    const resolvedParams = await params;
    const section = features.find(feature => feature.slug === resolvedParams.slug);

    return {
        title: section?.title || 'Section not found',
    };
}