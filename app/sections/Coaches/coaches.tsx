import { Instagram } from 'lucide-react';

const Coaches = () => {
    const coaches = [
        {
            name: "John Smith",
            title: "Head Coach",
            description: "Specializing in strength training and powerlifting with 10+ years of experience. Former national champion.",
            image: "/grey.png",
            instagram: "johnsmith_fitness",
            specialties: ["Powerlifting", "Strength Training", "Competition Prep"],
            experience: "12 years",
            certifications: ["NSCA-CSCS", "IPF Level 2"]
        },
        {
            name: "Sarah Johnson",
            title: "Fitness Coach",
            description: "Expert in functional training and HIIT workouts. Certified nutritionist helping clients achieve their body goals.",
            image: "/grey.png",
            instagram: "sarahj_fit",
            specialties: ["HIIT", "Nutrition", "Weight Loss"],
            experience: "8 years",
            certifications: ["ACE-CPT", "Precision Nutrition"]
        },
        {
            name: "Mike Wilson",
            title: "Personal Trainer",
            description: "Bodybuilding specialist with expertise in muscle growth and contest preparation. Professional competitor.",
            image: "/grey.png",
            instagram: "mike_wilson_pro",
            specialties: ["Bodybuilding", "Contest Prep", "Muscle Gain"],
            experience: "15 years",
            certifications: ["IFBB Pro", "NASM-CPT"]
        },
        {
            name: "Emma Davis",
            title: "Rehabilitation Coach",
            description: "Focuses on injury prevention and recovery. Combines physiotherapy knowledge with strength training.",
            image: "/grey.png",
            instagram: "emma_rehab",
            specialties: ["Injury Recovery", "Mobility", "Pain Management"],
            experience: "10 years",
            certifications: ["DPT", "FMS Level 2"]
        },
        {
            name: "David Martinez",
            title: "CrossFit Coach",
            description: "CrossFit Level 2 trainer specialized in improving overall athleticism and functional strength.",
            image: "/grey.png",
            instagram: "david_cf_coach",
            specialties: ["CrossFit", "Olympic Lifting", "Conditioning"],
            experience: "7 years",
            certifications: ["CF-L2", "USAW-L1"]
        }
    ];

    return (
        <section id="coaches" className="py-16 bg-background">
            <div className="container mx-auto px-4 md:px-8">
                <div className="grid grid-cols-3 mb-8 gap-4 md:gap-8">
                    <h2 className="col-span-3 md:col-span-1 text-4xl md:text-6xl font-bold tracking-tight">Our Coaches</h2>
                    <p className="col-span-3 md:col-span-1 text-text-secondary tracking-tight">
                        Meet our elite team of certified trainers who combine years of experience with cutting-edge
                        training methods. Each coach brings unique expertise and a proven track record of transforming
                        clients' lives through personalized fitness guidance.
                    </p>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {coaches.map((coach, index) => (
                        <div
                            key={index}
                            className="rounded-card overflow-hidden bg-card backdrop-blur-md border border-border "
                        >
                            <div className="relative">
                                <img
                                    src={coach.image}
                                    alt={coach.name}
                                    className="w-full h-64 object-cover"
                                />
                                <a
                                    href={`https://instagram.com/${coach.instagram}`}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="absolute top-4 right-4 bg-social-icon backdrop-blur-md p-2 rounded-icon border border-border"
                                >
                                    <Instagram className="w-6 h-6 text-white" />
                                </a>
                            </div>
                            <div className="p-6">
                                <div className="flex justify-between items-start mb-4">
                                    <div>
                                        <h3 className="text-2xl font-bold mb-1 tracking-tight">{coach.name}</h3>
                                        <h4 className="text-text-primary tracking-tight">{coach.title}</h4>
                                    </div>
                                    <span className="text-sm font-medium bg-primary/10 text-primary px-3 py-1 rounded-full">
                                        {coach.experience}
                                    </span>
                                </div>
                                <p className="text-text-secondary mb-4 tracking-tight">{coach.description}</p>
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex flex-wrap gap-2">
                                            {coach.specialties.map((specialty, idx) => (
                                                <span
                                                    key={idx}
                                                    className="text-xs bg-card border border-border text-secondary px-3 py-1 rounded-full"
                                                >
                                                    {specialty}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Coaches;