
/**
 * @file Type definitions for the portfolio
 * @author Dylan Walsh <dylanwalsh23ie@gmail.com>
 * @description This file defines the TypeScript interfaces for the data structures
 * used throughout the site, such as for experience and education history.
 */

/**
 * Definition types for work or professional experience entries
 * the syllabus and transcript URLs are optional
 */
export interface ExperienceItem {
  role: string;
  company: string;
  duration: string;
  location: string;
  points: string[];
  syllabusUrl?: string;
  transcriptUrl?: string;
}

/**
 * Definition types for higher education or certification entries
 * the syllabus, transcript and grades are optional
 */
export interface EducationItem {
  degree: string;
  institution: string;
  duration: string;
  location: string;
  details: string[];
  grade?: string;
  syllabusUrl?: string;
  transcriptUrl?: string;
}