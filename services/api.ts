
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

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
  status: 'correct' | 'incorrect' | 'pending' | 'solved' | 'error';
  imageUrl?: string;
  questionText?: string;
  answerText?: string;
}

export interface PaymentHistoryItem {
  id: string;
  planName: string;
  amount: number;
  date: string;
  referenceCode: string;
  status: 'completed' | 'cancelled' | 'pending' | 'success' | 'failed';
}

export interface UserItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  tokens: number;
  role: string;
  activePlan: string;
  dailyQuestionCount: number;
  lastQuestionDate: string;
  createdAt: string;
}

const formatDate = (dateValue: any): string => {
  if (!dateValue) return 'Bilinmiyor';
  
  let d: Date;
  if (typeof dateValue.toDate === 'function') {
    d = dateValue.toDate();
  } else {
    d = new Date(dateValue);
  }
  
  if (isNaN(d.getTime())) return 'Bilinmiyor';
  
  return `${d.toLocaleDateString('tr-TR')} ${d.toLocaleTimeString('tr-TR', {hour: '2-digit', minute:'2-digit'})}`;
};

export const fetchUsers = async (): Promise<UserItem[]> => {
  try {
    const q = query(collection(db, 'users'), orderBy('createdAt', 'desc'));
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      const formattedDate = formatDate(data.createdAt);
      
      return {
        id: doc.id,
        name: data.name || 'İsimsiz',
        email: data.email || '-',
        phone: data.phone || '-',
        tokens: data.tokens || 0,
        role: data.role || 'user',
        activePlan: data.activePlan || 'free',
        dailyQuestionCount: data.dailyQuestionCount || 0,
        lastQuestionDate: data.lastQuestionDate || '-',
        createdAt: formattedDate
      };
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const fetchUserStats = async (userId: string): Promise<UserStats> => {
  // Stats are mostly derived from the user document which is already in AuthContext
  // This is just a placeholder if we need to fetch aggregate data later
  return {
    remainingQuestions: 0,
    totalQuestions: 0,
    activePlan: 'free'
  };
};

export const fetchQuestionHistory = async (userId: string): Promise<QuestionHistoryItem[]> => {
  if (!userId) return [];
  try {
    const q = query(
      collection(db, 'questions'),
      where('uid', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      const formattedDate = formatDate(data.createdAt);
      
      return {
        id: doc.id,
        examType: data.examType || 'Genel',
        subject: data.subject || 'Soru',
        topic: data.topic || '',
        date: formattedDate,
        duration: '-',
        solutionTime: '-',
        status: data.status || 'solved',
        imageUrl: data.imageUrl,
        questionText: data.questionText,
        answerText: data.answerText
      };
    });
  } catch (error) {
    console.error("Error fetching question history:", error);
    return [];
  }
};

export const fetchPaymentHistory = async (userId: string): Promise<PaymentHistoryItem[]> => {
  if (!userId) return [];
  try {
    const q = query(
      collection(db, 'payments'),
      where('uid', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => {
      const data = doc.data();
      const formattedDate = formatDate(data.createdAt);
      
      return {
        id: doc.id,
        planName: data.provider || 'Paket',
        amount: data.amount || 0,
        date: formattedDate,
        referenceCode: doc.id.substring(0, 8).toUpperCase(),
        status: data.status || 'completed'
      };
    });
  } catch (error) {
    console.error("Error fetching payment history:", error);
    return [];
  }
};

export const handlePurchase = async (planId: string) => {
  // Real backend integration will be handled externally later.
  const response = await fetch('/api/payments/purchase', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ planId })
  });
  const data = await response.json();
  alert(data.message);
};

export const loginUser = async (data: any) => {
  // This is no longer used as AuthContext handles login directly with Firebase
  throw new Error("Use AuthContext.login instead");
};
