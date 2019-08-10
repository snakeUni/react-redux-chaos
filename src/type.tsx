/**
 * reducer, action 必须拥有一个 type 字段
 */
export type ReducerType<T> = (state: T, action: Action) => T

/**
 * action 必须要有 type 字段用去区分
 */
export interface Action {
  type: string
  payload?: any
}

export interface UseStoreResult<T> {
  getState: () => T
  dispatch: (action: Action, depth: any[]) => Action
  subscriber: (listener: Listener) => () => void
}

export interface UseSelectorResult<T> {
  getState: () => T
  dispatch: (action: Action) => Action
}

export type UseStore<T> = (reducer: ReducerType<T>, initialState: T) => UseStoreResult<T>

export interface Listener {
  listener: () => any
  props: any[]
}

/**
 * provider 组件
 */
export interface ProviderProps<T> {
  value: UseStoreResult<T>
  children?: React.ReactNode
}

export interface Reducers<T> {
  [key: string]: (state: T, action: Action) => any
}
