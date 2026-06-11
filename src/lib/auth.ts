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
