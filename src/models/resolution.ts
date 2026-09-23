export type ActionType = 'SELF_SERVICE' | 'STAFF_ASSISTANCE' | 'ESCALATION';

export interface Resolution {
  actionType: ActionType;
  actionRationale: string;
  instructions: string[];
  requiresStaff: boolean;
  caseTitle: string;
  clarifyingQuestions: string[];
}
