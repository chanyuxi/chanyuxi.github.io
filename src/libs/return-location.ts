// The shape stored in `location.state` by RequireAuth when an anonymous
// visitor is sent to /auth, so guarded flows can return afterwards.
export interface AuthLocationState {
  from?: {
    hash: string
    pathname: string
    search: string
  }
}

/** Resolve the saved pre-login destination into a safe return path. */
export function getReturnTo(state: unknown) {
  const from = (state as AuthLocationState | null)?.from

  if (
    !from
    || !from.pathname.startsWith('/')
    || from.pathname.startsWith('//')
    || from.pathname === '/auth'
  ) {
    return '/'
  }

  return `${from.pathname}${from.search}${from.hash}`
}
