export type ActionState<T = any> = {
  success: boolean
  message: string
  data?: T
  fieldErrors?: Record<string, string[]>
  errorCode?: 'UNAUTHORIZED' | 'NOT_FOUND' | 'VALIDATION_ERROR' | 'SERVER_ERROR'
}

export const initialActionState: ActionState = {
  success: false,
  message: '',
}
