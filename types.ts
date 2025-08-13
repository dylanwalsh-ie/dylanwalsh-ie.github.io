
export interface Skill {
    name: string;
    category: 'IT Support' | 'Operating Systems' | 'Databases' | 'Web Technologies' | 'Tools';
}

export interface Article {
    title: string;
    summary: string;
    pdfUrl: string;
}

export interface Project {
    title: string;
    description: string;
    technologies: string[];
    image: string;
    codeUrl?: string;
    liveUrl?: string;
    type: 'web' | 'script' | 'meta';
    scriptDetails?: {
        code: string;
        output: string[];
    };
}

export interface EducationEntry {
    credential_type: 'Certificate' | 'Degree';
    title: string;
    institution: string;
    date: string;
    verificationUrl?: string;
    transcriptUrl?: string;
    isBadgeEmbed?: boolean;
    badgeImage?: string;
}
