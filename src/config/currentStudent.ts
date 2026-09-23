import type { StudentProfile } from '../models/user';

// No auth in this foundation — a single hardcoded "logged in" student.
export const CURRENT_STUDENT: StudentProfile = {
  id: 'student-1',
  name: 'Jordan Avery',
  email: 'jordan.avery@campus.edu',
};
