'use server';

import db from '@/lib/db';
import { createSession, deleteSession } from '@/lib/auth';
import bcrypt from 'bcryptjs';

export async function registerUser(prevState: any, formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const track = formData.get('track') as string;
  const skills = formData.get('skills') as string;
  const contactLink = formData.get('contactLink') as string;

  if (!name || !email || !password || !track || !skills || !contactLink) {
    return { success: false, error: 'All fields are required' };
  }

  try {
    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return { success: false, error: 'Email already registered' };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await db.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        track,
        skills,
        contactLink,
        hasTeam: false,
      },
    });

    // Create session
    await createSession(user.id, user.email, user.name);

    return { success: true };
  } catch (error: any) {
    console.error('Registration error:', error);
    return { success: false, error: 'Internal server error occurred' };
  }
}

export async function loginUser(prevState: any, formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { success: false, error: 'Email and password are required' };
  }

  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return { success: false, error: 'Invalid email or password' };
    }

    const passwordsMatch = await bcrypt.compare(password, user.password);

    if (!passwordsMatch) {
      return { success: false, error: 'Invalid email or password' };
    }

    await createSession(user.id, user.email, user.name);

    return { success: true };
  } catch (error: any) {
    console.error('Login error:', error);
    return { success: false, error: 'Internal server error occurred' };
  }
}

export async function logoutUser() {
  await deleteSession();
}
