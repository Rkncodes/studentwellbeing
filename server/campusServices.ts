// Duplicated from src/config/campusServices.ts — the backend (Node) can't
// import from src/ (different module graph/target than the Vite frontend).
// Keep these two lists in sync until this becomes a real shared package.

export interface CampusService {
  id: string;
  name: string;
  description: string;
  category: string;
  assignmentGroup: string;
}

export const CAMPUS_SERVICES: CampusService[] = [
  {
    id: 'svc-mental-health',
    name: 'Counseling & Mental Health',
    description: 'Confidential support for stress, anxiety, and mental health concerns.',
    category: 'Mental Health',
    assignmentGroup: 'Counseling Services',
  },
  {
    id: 'svc-financial-aid',
    name: 'Financial Aid Office',
    description: 'Tuition, scholarships, loans, and billing questions.',
    category: 'Financial Aid',
    assignmentGroup: 'Financial Aid',
  },
  {
    id: 'svc-housing',
    name: 'Housing & Residence Life',
    description: 'Dorm issues, roommate conflicts, and housing changes.',
    category: 'Housing',
    assignmentGroup: 'Residence Life',
  },
  {
    id: 'svc-academic-advising',
    name: 'Academic Advising',
    description: 'Course selection, scheduling conflicts, and academic planning.',
    category: 'Academic',
    assignmentGroup: 'Academic Advising',
  },
  {
    id: 'svc-it-support',
    name: 'IT Help Desk',
    description: 'Campus accounts, Wi-Fi, and technology access issues.',
    category: 'IT Support',
    assignmentGroup: 'IT Service Desk',
  },
  {
    id: 'svc-campus-safety',
    name: 'Campus Safety',
    description: 'Safety concerns, harassment reports, and emergencies.',
    category: 'Safety',
    assignmentGroup: 'Campus Safety',
  },
  {
    id: 'svc-general',
    name: 'General Student Services',
    description: 'Anything that does not fit another category.',
    category: 'General',
    assignmentGroup: 'Student Services',
  },
];

export function getServiceById(id: string): CampusService | undefined {
  return CAMPUS_SERVICES.find((s) => s.id === id);
}
