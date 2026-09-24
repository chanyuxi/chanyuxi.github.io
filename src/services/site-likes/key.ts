export const siteLikesMutationKeys = {
  increment: () => ['site-likes', 'increment'] as const,
}

export const siteLikesQueryKeys = {
  count: () => ['site-likes', 'count'] as const,
}
