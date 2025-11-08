"use client";

import React from 'react';
import { CoursePage as GenericCoursePage } from './CoursePage';
import { Kindergarten } from '../coursePage/Kindergarten';
import { School } from '../coursePage/School';
import { Intermediate } from '../coursePage/Intermediate';
import { UG_PG } from '../coursePage/UG_PG';
import { CoachingCenter } from '../coursePage/CoachingCenter';
import { StudyHall } from '../coursePage/StudyHall';
import { ExamPreparation } from '../coursePage/ExamPreparation';
import { StudyAbroad } from '../coursePage/StudyAbroad';
import { TuitionCentre } from '../coursePage/TuitionCentre';

interface BaseCourse {
  id: string;
  title: string;
  institution: string;
  location?: string;
  description?: string;
  aboutCourse?: string;
  eligibility?: string;
  price: number;
  duration?: string;
  mode?: string;
  timings?: string;
  brandLogo?: string;
  startDate?: string;
  image?: string;
  operationalDays?: string[];
  features?: {
    recognized?: boolean;
    activities?: boolean;
    transport?: boolean;
    extraCare?: boolean;
    mealsProvided?: boolean;
    playground?: boolean;
  };
}

export interface InstituteCoursePageProps {
  course: BaseCourse;
  instituteType?: string; // Raw institute type label from API or filters
  onBack?: () => void;
  onRequestCall?: () => void;
  onBookDemo?: () => void;
}

// Normalization helper to map potential variations to component keys
function normalizeType(raw?: string): string {
  if (!raw) return '';
  const cleaned = raw.trim().toLowerCase();
  if (cleaned === "school's" || cleaned === 'school' || cleaned === 'schools') return 'School';
  if (cleaned === 'ug_pg' || cleaned === 'ug-pg' || cleaned === 'graduation' || cleaned === 'under graduation' || cleaned === 'post graduation') return 'UG_PG';
  if (cleaned === 'coaching' || cleaned === 'coaching center' || cleaned === 'coachingcentre') return 'CoachingCenter';
  if (cleaned === 'study hall' || cleaned === 'studyhalls' || cleaned === 'study_hall') return 'StudyHall';
  if (cleaned === 'exam' || cleaned === 'exam preparation' || cleaned === 'exampreparation') return 'ExamPreparation';
  if (cleaned === 'study abroad' || cleaned === 'studyabroad' || cleaned === 'abroad') return 'StudyAbroad';
  if (cleaned === 'tuition centre' || cleaned === 'tuition center' || cleaned === 'tuition') return 'TuitionCentre';
  if (cleaned === 'intermediate') return 'Intermediate';
  if (cleaned === 'kindergarten') return 'Kindergarten';
  return ''; // Unknown -> fallback generic
}

const componentMap: Record<string, React.FC<any>> = {
  Kindergarten,
  School,
  Intermediate,
  UG_PG,
  CoachingCenter,
  StudyHall,
  ExamPreparation,
  StudyAbroad,
  TuitionCentre,
};

export const InstituteCoursePage: React.FC<InstituteCoursePageProps> = ({
  course,
  instituteType,
  onBack,
  onRequestCall,
  onBookDemo,
}) => {
  const key = normalizeType(instituteType) || 'StudyAbroad'; // Default for now
  const Component = componentMap[key] || GenericCoursePage;

  return (
    <Component
      course={course}
      onBack={onBack}
      onRequestCall={onRequestCall}
      onBookDemo={onBookDemo}
    />
  );
};

export default InstituteCoursePage;