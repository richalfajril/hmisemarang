export type ActionState<T = unknown> = {
  success: boolean
  message: string
  data?: T
  payload?: any
  fieldErrors?: Record<string, string[]>
  errorCode?: 'UNAUTHORIZED' | 'NOT_FOUND' | 'VALIDATION_ERROR' | 'SERVER_ERROR'
}

export const initialActionState: ActionState = {
  success: false,
  message: '',
}
