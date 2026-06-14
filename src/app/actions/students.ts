'use server';

import db from '@/lib/db';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getStudents(filters: { track?: string; search?: string } = {}) {
  const { track, search } = filters;

  try {
    const whereClause: any = {};

    if (track && track !== 'All') {
      whereClause.track = track;
    }

    if (search && search.trim() !== '') {
      whereClause.skills = {
        contains: search.trim(),
      };
    }

    const students = await db.user.findMany({
      where: whereClause,
      select: {
        id: true,
        name: true,
        email: true,
        track: true,
        skills: true,
        contactLink: true,
        hasTeam: true,
        createdAt: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { success: true, data: students };
  } catch (error) {
    console.error('Error fetching students:', error);
    return { success: false, error: 'Failed to fetch students', data: [] };
  }
}

export async function getCurrentUser() {
  const session = await getSession();
  if (!session) return null;

  try {
    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: {
        id: true,
        name: true,
        email: true,
        track: true,
        skills: true,
        contactLink: true,
        hasTeam: true,
      },
    });
    return user;
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
}

export async function updateProfile(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: 'Unauthorized' };
  }

  const name = formData.get('name') as string;
  const track = formData.get('track') as string;
  const skills = formData.get('skills') as string;
  const contactLink = formData.get('contactLink') as string;
  const hasTeam = formData.get('hasTeam') === 'true';

  if (!name || !track || !skills || !contactLink) {
    return { success: false, error: 'All fields are required' };
  }

  try {
    const userExists = await db.user.findUnique({
      where: { id: session.userId },
      select: { id: true },
    });

    if (!userExists) {
      return { success: false, error: 'User not found. Please log in again.' };
    }

    await db.user.update({
      where: { id: session.userId },
      data: {
        name,
        track,
        skills,
        contactLink,
        hasTeam,
      },
    });

    revalidatePath('/dashboard/students');
    revalidatePath('/dashboard/profile');
    
    return { success: true };
  } catch (error) {
    console.error('Error updating profile:', error);
    return { success: false, error: 'Failed to update profile' };
  }
}

export async function toggleTeamStatus() {
  const session = await getSession();
  if (!session) {
    return { success: false, error: 'Unauthorized' };
  }

  try {
    const user = await db.user.findUnique({
      where: { id: session.userId },
      select: { hasTeam: true },
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    await db.user.update({
      where: { id: session.userId },
      data: { hasTeam: !user.hasTeam },
    });

    revalidatePath('/dashboard/students');
    revalidatePath('/dashboard/profile');
    
    return { success: true };
  } catch (error) {
    console.error('Error toggling team status:', error);
    return { success: false, error: 'Failed to update status' };
  }
}
