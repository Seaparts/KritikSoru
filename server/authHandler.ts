import { Request, Response } from "express";

// Simple in-memory database for users
const users: any[] = [
  {
    id: '1',
    name: 'Mert',
    surname: 'Yılmaz',
    email: 'mert@ornek.com',
    phone: '05551112233',
    city: 'İstanbul',
    district: 'Kadıköy',
    address: 'Caferağa Mah. Moda Cad.',
    password: 'password123',
    tcNo: '12345678901',
    targetExam: 'TYT'
  }
];

export const registerUser = (req: Request, res: Response) => {
  const { name, surname, email, phone, city, district, address, password, tcNo, targetExam } = req.body;

  if (!email || !password || !name || !tcNo || !targetExam) {
    return res.status(400).json({ error: "Gerekli alanlar eksik." });
  }

  if (!/^\d{11}$/.test(tcNo)) {
    return res.status(400).json({ error: "TC Kimlik No 11 haneli rakamlardan oluşmalıdır." });
  }

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(400).json({ error: "Bu e-posta adresi zaten kullanımda." });
  }

  const newUser = {
    id: Date.now().toString(),
    name,
    surname,
    email,
    phone,
    city,
    district,
    address,
    tcNo,
    targetExam,
    password // In a real app, this should be hashed
  };

  users.push(newUser);

  // Don't send password back
  const { password: _, ...userWithoutPassword } = newUser;
  res.status(201).json({ user: userWithoutPassword });
};

export const loginUser = (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "E-posta ve şifre zorunludur." });
  }

  const user = users.find(u => u.email === email && u.password === password);

  if (!user) {
    return res.status(401).json({ error: "E-posta adresi veya şifre hatalı." });
  }

  // Don't send password back
  const { password: _, ...userWithoutPassword } = user;
  
  // In a real app, we would generate and send a JWT token here
  res.status(200).json({ 
    user: userWithoutPassword,
    token: "mock-jwt-token-" + user.id 
  });
};

export const updateProfile = (req: Request, res: Response) => {
  const { id, ...updateData } = req.body;

  if (!id) {
    return res.status(400).json({ error: "Kullanıcı ID zorunludur." });
  }

  const userIndex = users.findIndex(u => u.id === id);
  if (userIndex === -1) {
    return res.status(404).json({ error: "Kullanıcı bulunamadı." });
  }

  users[userIndex] = { ...users[userIndex], ...updateData };

  const { password: _, ...userWithoutPassword } = users[userIndex];
  res.status(200).json({ user: userWithoutPassword });
};
