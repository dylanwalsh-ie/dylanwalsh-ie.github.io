import { renderSection } from './Section.js';
import { skills } from '../data/portfolioData.js';

const SkillBadge = (name) => `
    <div class="bg-[#007BFF]/10 text-[#007BFF] dark:bg-[#007BFF]/20 dark:text-[#007BFF] text-sm font-medium px-3 py-1 rounded-full hover:bg-[#007BFF]/20 dark:hover:bg-[#007BFF]/30 transition-all cursor-default">
        ${name}
    </div>
`;

const SkillCategory = (category, skills) => `
    <div class="mb-6">
        <h4 class="text-lg font-semibold mb-3">${category}</h4>
        <div class="flex flex-wrap gap-2">
            ${skills.map(skill => SkillBadge(skill.name)).join('')}
        </div>
    </div>
`;

export function renderAbout() {
    const skillCategories = Array.from(new Set(skills.map(s => s.category)));

    const content = `
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-12">
            About Me
        </h2>
        <div class="grid md:grid-cols-5 gap-12">
            <div class="md:col-span-2">
                <h3 class="text-2xl font-semibold mb-4">My Journey to Tech</h3>
                <p class="text-gray-600 dark:text-gray-400 space-y-4">
                    My fascination with technology began not in a classroom, but with a personal project: digitally archiving a vast collection of family history documents. This endeavor forced me to learn about data management, file formats, and the importance of robust backup strategies. It ignited a passion for creating order out of chaos and using technology to preserve and access information.
                    <br /><br />
                    This experience, combined with my academic background which honed my research and problem-solving skills, naturally led me to the world of IT. I thrive on diagnosing issues, whether it's a hardware malfunction, a network bottleneck, or a complex database query. I am a lifelong learner, constantly exploring new technologies and dedicated to providing clear, effective support to end-users.
                </p>
            </div>
            <div class="md:col-span-3">
                <h3 class="text-2xl font-semibold mb-4">Key Skills</h3>
                ${skillCategories.map(category => SkillCategory(
                    category, 
                    skills.filter(s => s.category === category)
                )).join('')}
            </div>
        </div>
    `;

    return renderSection('about', content, 'bg-white dark:bg-[var(--bg-card-dark)] rounded-lg shadow-sm');
}
