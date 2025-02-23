import { features } from "@/app/data/features";
import { notFound } from "next/navigation";
import SectionContent from "./SectionContent";

// Define the params type
type SectionPageParams = {
    params: {
        slug: string;
    };
};

// Add type annotation to the params parameter
export default function SectionPage({ params }: SectionPageParams) {
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