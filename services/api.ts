
/**
 * Mock API Layer
 * Note: Real backend integration will be handled externally later.
 * All fetch calls are placeholders.
 */

export interface UserStats {
  remainingQuestions: number;
  totalQuestions: number;
  activePlan: string;
  planExpiryDate?: string;
}

export interface QuestionHistoryItem {
  id: string;
  examType: string;
  subject: string;
  topic: string;
  date: string;
  duration: string;
  solutionTime: string;
  status: 'correct' | 'incorrect';
}

export interface PaymentHistoryItem {
  id: string;
  planName: string;
  amount: number;
  date: string;
  referenceCode: string;
  status: 'completed' | 'cancelled' | 'pending';
}

export const fetchUserStats = async (): Promise<UserStats> => {
  const response = await fetch('/api/user/stats');
  if (!response.ok) throw new Error('Failed to fetch user stats');
  return response.json();
};

export const fetchQuestionHistory = async (filters?: any): Promise<QuestionHistoryItem[]> => {
  const response = await fetch('/api/user/questions');
  if (!response.ok) throw new Error('Failed to fetch question history');
  return response.json();
};

export const fetchPaymentHistory = async (filters?: any): Promise<PaymentHistoryItem[]> => {
  const response = await fetch('/api/user/payments');
  if (!response.ok) throw new Error('Failed to fetch payment history');
  return response.json();
};

export const handlePurchase = async (planId: string) => {
  const response = await fetch('/api/payments/purchase', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planId })
  });
  const data = await response.json();
  alert(data.message);
};

export const loginUser = async (data: any) => {
  const response = await fetch('/api/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  return response.json();
};
