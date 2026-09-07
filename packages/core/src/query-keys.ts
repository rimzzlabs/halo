/**
 * Every TanStack Query key in the app is built here. Keys drift when they are
 * written inline, and a cache read then stops matching the cache write.
 */
export const sessionKeys = {
  all: ["session"] as const,
  current: () => [...sessionKeys.all, "current"] as const,
};

export const healthKeys = {
  all: ["health"] as const,
  status: () => [...healthKeys.all, "status"] as const,
};

export const userKeys = {
  all: ["users"] as const,
  detail: (id: string) => [...userKeys.all, "detail", id] as const,
};

/** Mutation keys, so a pending sign-in can be observed from anywhere. */
export const authMutationKeys = {
  all: ["auth"] as const,
  signIn: () => [...authMutationKeys.all, "sign-in"] as const,
  signUp: () => [...authMutationKeys.all, "sign-up"] as const,
  signOut: () => [...authMutationKeys.all, "sign-out"] as const,
};
