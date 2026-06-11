import { cookies } from 'next/headers';
import { DEMO_USERS, DemoUser } from './session';

export async function getCurrentUser(): Promise<DemoUser> {
  const cookieStore = await cookies();
  const email = cookieStore.get('clisp_email')?.value;
  
  if (!email) {
    // Default to Public Visitor
    return DEMO_USERS.find(u => u.role === 'Public Visitor') || DEMO_USERS[DEMO_USERS.length - 1];
  }
  
  return DEMO_USERS.find(u => u.email === email) || DEMO_USERS[0];
}

export async function loginUser(email: string) {
  const cookieStore = await cookies();
  cookieStore.set('clisp_email', email, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 24, // 1 day
    path: '/'
  });
}

export async function logoutUser() {
  const cookieStore = await cookies();
  cookieStore.delete('clisp_email');
}

