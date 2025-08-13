import { Section } from './Section.tsx';
import { skills } from '../data/portfolioData.ts';
import { Skill } from '../types.ts';

const SkillBadge: React.FC<{ name: string }> = ({ name }) => (
    <div className="bg-[#007BFF]/10 text-[#007BFF] dark:bg-[#007BFF]/20 dark:text-[#007BFF] text-sm font-medium px-3 py-1 rounded-full hover:bg-[#007BFF]/20 dark:hover:bg-[#007BFF]/30 transition-all cursor-default">
        {name}
    </div>
);

const SkillCategory: React.FC<{ category: string, skills: Skill[] }> = ({ category, skills }) => (
    <div className="mb-6">
        <h4 className="text-lg font-semibold mb-3">{category}</h4>
        <div className="flex flex-wrap gap-2">
            {skills.map(skill => <SkillBadge key={skill.name} name={skill.name} />)}
        </div>
    </div>
);

export const About: React.FC = () => {
    const skillCategories = Array.from(new Set(skills.map(s => s.category)));

    return (
        <Section id="about" className="bg-white dark:bg-[var(--bg-card-dark)] rounded-lg shadow-sm">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                About Me
            </h2>
            <div className="grid md:grid-cols-5 gap-12">
                <div className="md:col-span-2">
                    <h3 className="text-2xl font-semibold mb-4">My Journey to Tech</h3>
                    <p className="text-gray-600 dark:text-gray-400 space-y-4">
                        My fascination with technology began not in a classroom, but with a personal project: digitally archiving a vast collection of family history documents. This endeavor forced me to learn about data management, file formats, and the importance of robust backup strategies. It ignited a passion for creating order out of chaos and using technology to preserve and access information.
                        <br /><br />
                        This experience, combined with my academic background which honed my research and problem-solving skills, naturally led me to the world of IT. I thrive on diagnosing issues, whether it's a hardware malfunction, a network bottleneck, or a complex database query. I am a lifelong learner, constantly exploring new technologies and dedicated to providing clear, effective support to end-users.
                    </p>
                </div>
                <div className="md:col-span-3">
                    <h3 className="text-2xl font-semibold mb-4">Key Skills</h3>
                    {skillCategories.map(category => (
                        <SkillCategory 
                            key={category} 
                            category={category} 
                            skills={skills.filter(s => s.category === category)} 
                        />
                    ))}
                </div>
            </div>
        </Section>
    );
};