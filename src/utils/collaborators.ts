// Which collaborators the home shows and when their list moves (specs/next-collaborators-bar, CLB-003, CLB-009).
// Pure rules with no Astro import: the bar component only presents what this module decides.

interface CollaboratorLike {
  id: string;
  data: { name: string; order: number; status: 'pending' | 'approved' };
}

/** Approved entries only, by `order` and then by name. */
export function approvedCollaborators<T extends CollaboratorLike>(entries: readonly T[]): T[] {
  return entries
    .filter((entry) => entry.data.status === 'approved')
    .sort((a, b) => a.data.order - b.data.order || a.data.name.localeCompare(b.data.name, 'es'));
}

/** One or two brands stay still: a strip that moves needs at least three to read as a strip. */
export const movesAsStrip = (count: number): boolean => count >= 3;

/** Seconds for one loop of the strip: longer as the list grows, never under half a minute. */
export const stripLoopSeconds = (count: number): number => Math.max(30, count * 8);
