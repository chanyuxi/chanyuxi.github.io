export const postQueryKeys = {
  all: ['posts'] as const,
  detail: (slug: string) => [...postQueryKeys.all, 'detail', slug] as const,
  // Private data is scoped by user id so one account's cached posts can
  // never render for another signed-in account.
  editor: (userId: string, id: string) =>
    [...postQueryKeys.all, 'editor', userId, id] as const,
  list: () => [...postQueryKeys.all, 'list'] as const,
  listPages: (search: string) => [...postQueryKeys.list(), 'pages', search] as const,
  minePages: (userId: string) =>
    [...postQueryKeys.all, 'mine', userId, 'pages'] as const,
}

export const postMutationKeys = {
  create: () => [...postQueryKeys.all, 'create'] as const,
  delete: (id: string) => [...postQueryKeys.all, 'delete', id] as const,
  publish: () => [...postQueryKeys.all, 'publish'] as const,
  update: (id: string) => [...postQueryKeys.all, 'update', id] as const,
}
