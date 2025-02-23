import { features } from "@/app/data/features";
import { notFound } from "next/navigation";
import SectionContent from "./SectionContent";

// Define the params type using Next.js's built-in types
type Props = {
    params: {
        slug: string;
    };
    searchParams: { [key: string]: string | string[] | undefined };
};

export default function SectionPage({ params, searchParams }: Props) {
    const section = features.find(feature => feature.slug === params.slug);

    if (!section) {
        notFound();
    }

    return <SectionContent section={section} />;
}

// Generate static params for all sections
export function generateStaticParams() {
    return features.map((feature) => ({
        slug: feature.slug,
    }));
}