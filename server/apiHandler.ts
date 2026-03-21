import { Request, Response } from "express";

export const getUserStats = (req: Request, res: Response) => {
  res.json({
    remainingQuestions: 18,
    totalQuestions: 25,
    activePlan: "Full Focus",
    planExpiryDate: "15 Haziran 2024"
  });
};

export const getQuestionHistory = (req: Request, res: Response) => {
  const data = [
    { id: '1', examType: 'AYT', subject: 'Fizik', topic: 'Elektrik ve Manyetizma', date: '2024-06-15', duration: '3 dk 45 sn', solutionTime: '14:30', status: 'correct' },
    { id: '2', examType: 'TYT', subject: 'Matematik', topic: 'Trigonometri', date: '2024-06-14', duration: '5 dk 20 sn', solutionTime: '09:15', status: 'incorrect' },
    { id: '3', examType: 'LGS', subject: 'Fen Bilgisi', topic: 'Hücre Bölünmesi', date: '2024-06-12', duration: '2 dk 10 sn', solutionTime: '16:45', status: 'correct' },
    { id: '4', examType: 'TYT', subject: 'Türkçe', topic: 'Paragraf', date: '2024-06-10', duration: '4 dk 00 sn', solutionTime: '11:20', status: 'correct' },
    { id: '5', examType: 'AYT', subject: 'Kimya', topic: 'Gazlar', date: '2024-06-08', duration: '6 dk 15 sn', solutionTime: '20:10', status: 'correct' },
    { id: '6', examType: 'TYT', subject: 'Geometri', topic: 'Üçgenler', date: '2024-06-05', duration: '3 dk 30 sn', solutionTime: '13:05', status: 'incorrect' },
  ];
  res.json(data);
};

export const getPaymentHistory = (req: Request, res: Response) => {
  const data = [
    { id: '101', planName: 'Full Focus Paketi (3 Ay)', amount: 299.99, date: '2024-06-01 13:45', referenceCode: 'PAY-20240601-001', status: 'completed' },
    { id: '102', planName: 'Kredi Yükleme (50 Soru)', amount: 99.99, date: '2024-05-15 10:20', referenceCode: 'PAY-20240515-002', status: 'completed' },
    { id: '103', planName: 'Full Focus Paketi (1 Ay)', amount: 119.99, date: '2024-04-14 15:30', referenceCode: 'PAY-20240414-003', status: 'completed' },
    { id: '104', planName: 'Mini Çözüm', amount: 49.99, date: '2024-03-01 09:15', referenceCode: 'PAY-20240301-004', status: 'cancelled' },
  ];
  res.json(data);
};

export const purchasePlan = (req: Request, res: Response) => {
  const { planId } = req.body;
  // Backend iyzico entegrasyonu burada yapılacak
  console.log(`Purchasing plan: ${planId}`);
  res.json({ success: true, message: "Ödeme sistemine yönlendiriliyorsunuz..." });
};
