export type ActionState<T = unknown> = {
  success: boolean
  message: string
  data?: T
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  payload?: any
  fieldErrors?: Record<string, string[]>
  errorCode?: 'UNAUTHORIZED' | 'NOT_FOUND' | 'VALIDATION_ERROR' | 'SERVER_ERROR'
}

export const initialActionState: ActionState = {
  success: false,
  message: '',
}
