import { features } from "@/app/data/features";
import { notFound } from "next/navigation";
import SectionContent from "./SectionContent";
import type { Metadata } from "next";

// Update the Props type to use Promise
type Props = {
    params: Promise<{ slug: string }>;
    searchParams?: { [key: string]: string | string[] | undefined };
};

export default async function SectionPage({
                                              params
                                          }: Props) {
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
                                       }: Props): Promise<Metadata> {
    const resolvedParams = await params;
    const section = features.find(feature => feature.slug === resolvedParams.slug);

    return {
        title: section?.title || 'Section not found',
    };
}