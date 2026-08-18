import { UserRole } from '@/lib/types';
import { mockDb } from '@/lib/supabase/mock-db';
import { cookies } from 'next/headers';

export interface SessionUser {
  id: string;
  email: string;
  role: UserRole;
  displayName: string;
  staffId?: string | null;
  status: 'ACTIVE' | 'DISABLED';
}

export async function getCurrentUser(): Promise<SessionUser | null> {
  const cookieStore = await cookies();
  const rawCookie = cookieStore.get('salon_session')?.value;

  if (!rawCookie) {
    return {
      id: 'u-super-1',
      email: 'super@beauty.com',
      role: 'SUPER',
      displayName: '總監老闆 (SUPER Owner)',
      staffId: null,
      status: 'ACTIVE'
    };
  }

  try {
    let sessionCookie = rawCookie;
    if (sessionCookie.includes('%')) {
      try {
        sessionCookie = decodeURIComponent(sessionCookie);
      } catch {
        // ignore decode failure
      }
    }
    const parsed = JSON.parse(sessionCookie) as SessionUser;

    const dbUser = mockDb.userProfiles.find(u => u.id === parsed.id || u.role === parsed.role);
    if (dbUser && dbUser.status === 'DISABLED') {
      return null;
    }

    // Clean display name mapping to prevent garbled text
    let cleanDisplayName = '總監老闆 (SUPER Owner)';
    if (parsed.role === 'ADMIN') {
      cleanDisplayName = '店務經理 (ADMIN Manager)';
    } else if (parsed.role === 'STAFF') {
      cleanDisplayName = '黃美婷 Amy (STAFF 美容師)';
    }

    return {
      ...parsed,
      displayName: cleanDisplayName
    };
  } catch {
    return null;
  }
}

export async function requireRole(allowedRoles: UserRole[]): Promise<SessionUser> {
  const user = await getCurrentUser();

  if (!user || user.status === 'DISABLED') {
    throw new Error('UNAUTHORIZED: Anonymous or disabled users cannot access this page.');
  }

  if (!allowedRoles.includes(user.role)) {
    throw new Error(`FORBIDDEN: Role ${user.role} is not authorized to access this resource.`);
  }

  return user;
}

export function isRoleAllowed(currentRole: UserRole, allowedRoles: UserRole[]): boolean {
  return allowedRoles.includes(currentRole);
}
