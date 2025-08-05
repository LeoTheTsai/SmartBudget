const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const registerUser = async (userData: { name: string; email: string; password: string; monthlyBudget: number }) => {
  const res = await fetch(`${API_BASE}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });

  const data = await res.json();
  return { ...data, status: res.status };
};

export const loginUser = async (credentials: { email: string; password: string }) => {
  const res = await fetch(`${API_BASE}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

  const data = await res.json();
  return { ...data, status: res.status };
};

export const updateMonthlyBudget = async (budget: number, user: any) => {
  const res = await fetch(`${API_BASE}/user/${user?.id}/budget`, {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ monthlyBudget: budget }),
  });
  if (!res.ok) throw new Error('Failed to update budget');
  return await res.json();
};
