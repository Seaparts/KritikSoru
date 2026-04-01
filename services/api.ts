
import { collection, query, where, getDocs, orderBy, doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
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
  uid?: string;
  model?: string;
  cost?: number;
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
  
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');

  return `${day}.${month}.${year} / ${hours}:${minutes}`;
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

export const fetchAllQuestions = async (): Promise<QuestionHistoryItem[]> => {
  try {
    const q = query(
      collection(db, 'questions'),
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
        answerText: data.answerText,
        uid: data.uid,
        model: data.model || 'gpt-4o',
        cost: data.cost || 0
      };
    });
  } catch (error) {
    console.error("Error fetching all questions:", error);
    return [];
  }
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
        answerText: data.answerText,
        uid: data.uid,
        model: data.model || 'gpt-4o',
        cost: data.cost || 0
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

export const trackVisit = async (isLoggedIn: boolean) => {
  try {
    const today = new Date();
    const dateString = today.toISOString().split('T')[0]; // YYYY-MM-DD
    
    // Global stats
    const globalRef = doc(db, 'analytics', 'global');
    const globalDoc = await getDoc(globalRef);
    
    if (!globalDoc.exists()) {
      await setDoc(globalRef, {
        totalVisits: 1,
        totalLoggedInVisits: isLoggedIn ? 1 : 0
      });
    } else {
      await updateDoc(globalRef, {
        totalVisits: increment(1),
        totalLoggedInVisits: isLoggedIn ? increment(1) : increment(0)
      });
    }
    
    // Daily stats
    const dailyRef = doc(db, 'analytics', `daily_${dateString}`);
    const dailyDoc = await getDoc(dailyRef);
    
    if (!dailyDoc.exists()) {
      await setDoc(dailyRef, {
        date: dateString,
        visits: 1,
        loggedInVisits: isLoggedIn ? 1 : 0
      });
    } else {
      await updateDoc(dailyRef, {
        visits: increment(1),
        loggedInVisits: isLoggedIn ? increment(1) : increment(0)
      });
    }
  } catch (error) {
    console.error("Error tracking visit:", error);
  }
};

export const getAnalytics = async () => {
  try {
    const today = new Date();
    const dateString = today.toISOString().split('T')[0];
    
    const globalRef = doc(db, 'analytics', 'global');
    const dailyRef = doc(db, 'analytics', `daily_${dateString}`);
    
    const [globalDoc, dailyDoc] = await Promise.all([
      getDoc(globalRef),
      getDoc(dailyRef)
    ]);
    
    return {
      totalVisits: globalDoc.exists() ? globalDoc.data().totalVisits || 0 : 0,
      totalLoggedInVisits: globalDoc.exists() ? globalDoc.data().totalLoggedInVisits || 0 : 0,
      todayVisits: dailyDoc.exists() ? dailyDoc.data().visits || 0 : 0,
      todayLoggedInVisits: dailyDoc.exists() ? dailyDoc.data().loggedInVisits || 0 : 0
    };
  } catch (error) {
    console.error("Error getting analytics:", error);
    return {
      totalVisits: 0,
      totalLoggedInVisits: 0,
      todayVisits: 0,
      todayLoggedInVisits: 0
    };
  }
};

export const getTokenUsageStats = async () => {
  try {
    const usageRef = collection(db, 'token_usage');
    const snapshot = await getDocs(usageRef);
    
    let totalPromptTokens = 0;
    let totalCompletionTokens = 0;
    let totalTokens = 0;
    let totalCost = 0;
    
    const dailyData: Record<string, { tokens: number, cost: number }> = {};

    const MODEL_PRICING: Record<string, { input: number, output: number }> = {
      'gpt-5.4': { input: 2.50, output: 15.00 },
      'gpt-5.2': { input: 1.75, output: 14.00 },
      'gpt-5.1': { input: 1.25, output: 10.00 },
      'gpt-5': { input: 1.25, output: 10.00 },
      'gpt-5-mini': { input: 0.25, output: 2.00 },
      'gpt-5-nano': { input: 0.05, output: 0.40 },
      'gpt-4o': { input: 2.50, output: 10.00 },
      'gpt-4o-mini': { input: 0.15, output: 0.60 },
      'gpt-4.1': { input: 2.00, output: 8.00 },
      'gpt-4.1-mini': { input: 0.80, output: 3.20 },
      'gpt-4.1-nano': { input: 0.20, output: 0.80 },
    };

    snapshot.forEach(doc => {
      const data = doc.data();
      const pTokens = data.promptTokens || 0;
      const cTokens = data.completionTokens || 0;
      const tTokens = data.totalTokens || 0;
      const model = data.model || 'gpt-4o';
      
      totalPromptTokens += pTokens;
      totalCompletionTokens += cTokens;
      totalTokens += tTokens;
      
      const pricing = MODEL_PRICING[model] || MODEL_PRICING['gpt-4o'];
      const cost = (pTokens / 1_000_000) * pricing.input + (cTokens / 1_000_000) * pricing.output;
      totalCost += cost;
      
      const date = data.date || data.createdAt?.split('T')[0];
      if (date) {
        if (!dailyData[date]) {
          dailyData[date] = { tokens: 0, cost: 0 };
        }
        dailyData[date].tokens += tTokens;
        dailyData[date].cost += cost;
      }
    });

    const chartData = Object.keys(dailyData).sort().map(date => {
      const d = new Date(date);
      const formattedDate = d.toLocaleDateString('tr-TR', { month: 'short', day: 'numeric' });
      return {
        date: formattedDate,
        tokens: dailyData[date].tokens,
        cost: Number(dailyData[date].cost.toFixed(4))
      };
    });

    return {
      totalPromptTokens,
      totalCompletionTokens,
      totalTokens,
      totalCost,
      chartData
    };
  } catch (error) {
    console.error("Error getting token usage stats:", error);
    return {
      totalPromptTokens: 0,
      totalCompletionTokens: 0,
      totalTokens: 0,
      totalCost: 0,
      chartData: []
    };
  }
};
