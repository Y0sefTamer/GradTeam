'use server';

import db from '@/lib/db';
import { getSession } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

export async function getTeams(filters: { search?: string } = {}) {
  const { search } = filters;

  try {
    const whereClause: any = {};

    if (search && search.trim() !== '') {
      whereClause.OR = [
        { name: { contains: search.trim() } },
        { domain: { contains: search.trim() } },
        { requiredRoles: { contains: search.trim() } },
      ];
    }

    const teams = await db.team.findMany({
      where: whereClause,
      orderBy: {
        createdAt: 'desc',
      },
    });

    return { success: true, data: teams };
  } catch (error) {
    console.error('Error fetching teams:', error);
    return { success: false, error: 'Failed to fetch teams', data: [] };
  }
}

export async function createTeam(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: 'Unauthorized' };
  }

  const name = formData.get('name') as string;
  const domain = formData.get('domain') as string;
  const requiredRoles = formData.get('requiredRoles') as string;
  const contactLink = formData.get('contactLink') as string;

  if (!name || !domain || !requiredRoles || !contactLink) {
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

    await db.team.create({
      data: {
        name,
        domain,
        requiredRoles,
        contactLink,
        creatorId: session.userId,
      },
    });

    // Mark the team creator's status to having a team
    await db.user.update({
      where: { id: session.userId },
      data: { hasTeam: true },
    });

    revalidatePath('/dashboard/teams');
    revalidatePath('/dashboard/students');
    revalidatePath('/dashboard/profile');

    return { success: true };
  } catch (error) {
    console.error('Error creating team:', error);
    return { success: false, error: 'Failed to create team' };
  }
}

export async function updateTeam(prevState: any, formData: FormData) {
  const session = await getSession();
  if (!session) {
    return { success: false, error: 'Unauthorized' };
  }

  const teamId = formData.get('teamId') as string;
  const name = formData.get('name') as string;
  const domain = formData.get('domain') as string;
  const requiredRoles = formData.get('requiredRoles') as string;
  const contactLink = formData.get('contactLink') as string;

  if (!teamId || !name || !domain || !requiredRoles || !contactLink) {
    return { success: false, error: 'All fields are required' };
  }

  try {
    // Check if the user exists in the database
    const userExists = await db.user.findUnique({
      where: { id: session.userId },
      select: { id: true },
    });

    if (!userExists) {
      return { success: false, error: 'User not found. Please log in again.' };
    }

    // Check if the team exists and the user is the creator
    const team = await db.team.findUnique({
      where: { id: teamId },
      select: { creatorId: true },
    });

    if (!team) {
      return { success: false, error: 'Team not found' };
    }

    if (team.creatorId !== session.userId) {
      return { success: false, error: 'Unauthorized' };
    }

    await db.team.update({
      where: { id: teamId },
      data: {
        name,
        domain,
        requiredRoles,
        contactLink,
      },
    });

    revalidatePath('/dashboard/teams');
    revalidatePath('/dashboard/students');
    revalidatePath('/dashboard/profile');

    return { success: true };
  } catch (error) {
    console.error('Error updating team:', error);
    return { success: false, error: 'Failed to update team' };
  }
}
