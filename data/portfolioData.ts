
import { Skill, Article, Project, EducationEntry } from '../types';

export const skills: Skill[] = [
    { name: 'Hardware Troubleshooting', category: 'IT Support' },
    { name: 'Network Configuration', category: 'IT Support' },
    { name: 'Active Directory', category: 'IT Support' },
    { name: 'Ticketing Systems (Jira)', category: 'IT Support' },
    { name: 'Customer Service', category: 'IT Support' },
    { name: 'Windows 10/11', category: 'Operating Systems' },
    { name: 'macOS', category: 'Operating Systems' },
    { name: 'Linux (Ubuntu)', category: 'Operating Systems' },
    { name: 'SQL Server', category: 'Databases' },
    { name: 'MySQL', category: 'Databases' },
    { name: 'PostgreSQL', category: 'Databases' },
    { name: 'Database Design', category: 'Databases' },
    { name: 'HTML5 & CSS3', category: 'Web Technologies' },
    { name: 'JavaScript (ES6+)', category: 'Web Technologies' },
    { name: 'React', category: 'Web Technologies' },
    { name: 'Tailwind CSS', category: 'Web Technologies' },
    { name: 'Git & GitHub', category: 'Tools' },
    { name: 'Docker', category: 'Tools' },
    { name: 'PowerShell', category: 'Tools' },
];

export const articles: Article[] = [
    {
        title: "Workstation unable to access network or internet",
        summary: "A step-by-step guide to troubleshooting and resolving a network connectivity issue on a Windows workstation, involving checking physical cables and configuring static IP addresses.",
        pdfUrl: "/assets/pdf/workstation-network-troubleshooting.pdf"
    },
    {
        title: "System frequently shutting down unexpectedly",
        summary: "A guide to diagnosing and replacing a faulty Power Supply Unit (PSU) in a desktop computer that causes unexpected shutdowns, especially under load.",
        pdfUrl: "/assets/pdf/system-shutdown-troubleshooting.pdf"
    }
];

export const projects: Project[] = [
    {
        title: "Automated System Health Check Script",
        description: "A PowerShell script designed for system administrators to quickly assess the health of a Windows machine. It checks CPU usage, memory availability, disk space, and critical services, then logs the output to a file with a timestamp. This automates routine checks and helps in early detection of potential issues.",
        technologies: ["PowerShell", "System Administration", "Automation"],
        image: "https://picsum.photos/seed/powershell/800/600",
        type: "script",
        scriptDetails: {
            code: `
# System Health Check Script
Write-Host "Starting System Health Check..."

# 1. Check CPU Usage
$cpu = Get-CimInstance Win32_Processor | Measure-Object -Property LoadPercentage -Average | Select-Object Average
Write-Host ("CPU Load: {0:N2}%" -f $cpu.Average)

# 2. Check Memory Usage
$mem = Get-CimInstance Win32_OperatingSystem
$totalMem = [math]::Round($mem.TotalVisibleMemorySize / 1MB, 2)
$freeMem = [math]::Round($mem.FreePhysicalMemory / 1MB, 2)
$usedMem = $totalMem - $freeMem
$percentFree = ($freeMem / $totalMem) * 100
Write-Host ("Memory: {0:N2} GB used / {1:N2} GB total ({2:N2}% free)" -f $usedMem, $totalMem, $percentFree)

# 3. Check Disk Space
$disk = Get-CimInstance Win32_LogicalDisk -Filter "DeviceID='C:'"
$totalDisk = [math]::Round($disk.Size / 1GB, 2)
$freeDisk = [math]::Round($disk.FreeSpace / 1GB, 2)
$percentDiskFree = ($freeDisk / $totalDisk) * 100
Write-Host ("Disk (C:): {0:N2} GB free / {1:N2} GB total ({2:N2}% free)" -f $freeDisk, $totalDisk, $percentDiskFree)

# 4. Check Critical Services
$services = @("Spooler", "WinRM", "BITS")
Write-Host "Checking critical services..."
foreach ($service in $services) {
    $svc = Get-Service -Name $service -ErrorAction SilentlyContinue
    if ($svc) {
        Write-Host ("- {0}: {1}" -f $svc.Name, $svc.Status)
    } else {
        Write-Host "- $service: Not Found"
    }
}

Write-Host "Health Check Complete."
            `,
            output: [
                "Starting System Health Check...",
                "CPU Load: 15.73%",
                "Memory: 6.81 GB used / 15.93 GB total (57.25% free)",
                "Disk (C:): 152.34 GB free / 475.81 GB total (32.02% free)",
                "Checking critical services...",
                "- Spooler: Running",
                "- WinRM: Running",
                "- BITS: Stopped",
                "Health Check Complete."
            ]
        },
        codeUrl: "https://github.com/dylan-walsh"
    },
    {
        title: "Home Inventory Database",
        description: "A web application built with React and a mock backend to manage a home inventory. Users can add, edit, and delete items, categorize them by room, and view a dashboard summarizing the total value of items. This project demonstrates database design principles and front-end development skills.",
        technologies: ["React", "Tailwind CSS", "JavaScript", "Database Design"],
        image: "https://picsum.photos/seed/inventory/800/600",
        type: "web",
        liveUrl: "https://react.dev",
        codeUrl: "https://github.com/dylan-walsh"
    },
    {
        title: "This Portfolio Website",
        description: "A fully responsive, single-page portfolio built from the ground up to showcase my skills and projects. It features a light/dark mode, on-scroll animations using the Intersection Observer API, and dynamically generated content. The site is designed to be a living resume, demonstrating my capabilities in modern web development.",
        technologies: ["React", "TypeScript", "Tailwind CSS", "HTML5", "UI/UX Design"],
        image: "https://picsum.photos/seed/portfolio/800/600",
        type: "meta",
        codeUrl: "https://github.com/dylan-walsh"
    }
];

export const education: EducationEntry[] = [
    {
        credential_type: "Certificate",
        title: "ICDL Professional - Databases",
        institution: "ICDL Foundation",
        date: "Completed 2024",
        verificationUrl: "#",
        badgeImage: "/icdl-databases.png"
    },
    {
        credential_type: "Certificate",
        title: "ICDL Core - Computer & Online Essentials",
        institution: "ICDL Foundation",
        date: "Completed 2024",
        verificationUrl: "#",
        badgeImage: "/icdl-computer-essentials.png"
    },
    {
        credential_type: "Certificate",
        title: "Google IT Support Professional Certificate",
        institution: "Coursera / Google",
        date: "Completed 2023",
        verificationUrl: "#",
        isBadgeEmbed: true,
    },
    {
        credential_type: "Degree",
        title: "Master of Arts in History",
        institution: "University of Example",
        date: "2018 - 2020",
        transcriptUrl: "#",
    },
    {
        credential_type: "Degree",
        title: "Bachelor of Arts in History",
        institution: "University of Example",
        date: "2014 - 2018",
        transcriptUrl: "#",
    },
];
