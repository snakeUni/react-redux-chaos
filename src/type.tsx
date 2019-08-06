/**
 * reducer, action 必须拥有一个 type 字段
 */
export type ReducerType<T> = (state: T, action: Action) => T

/**
 * action 必须要有 type 字段用去区分
 */
export interface Action {
  type: string
}

export interface UseStoreResult<T> {
  getState: () => T
  dispatch: (action: Action) => Action
  subscriber: (listener: Listener) => () => void
}

export type UseStore<T> = (reducer: ReducerType<T>, initialState: T) => UseStoreResult<T>

export type Listener = () => any
