export const ApiErrorKind = {
  Contract: 'contract',
  Http: 'http',
  Network: 'network',
  Timeout: 'timeout',
} as const

export type ApiErrorKind = (typeof ApiErrorKind)[keyof typeof ApiErrorKind]

export class ApiError extends Error {
  constructor(
    message: string,
    readonly kind: ApiErrorKind,
    readonly status: null | number = null,
    readonly code: null | string = null,
  ) {
    super(message)
    this.name = 'ApiError'
  }

  static contract(message: string) {
    return new ApiError(message, ApiErrorKind.Contract)
  }
}
