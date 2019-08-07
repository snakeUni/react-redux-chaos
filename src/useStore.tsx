import * as React from 'react'
import { useCurrent } from './hookUtil'
import { ReducerType, UseStoreResult, Listener, Action } from './type'

const { useRef, useEffect } = React
/**
 * useStore 返回一个 store
 * 包含 state, dispatch, subscribe
 */
export default function useStore<T extends object>(
  reducer: ReducerType<T>,
  initialState?: T
): UseStoreResult<T> {
  const [get, set] = useCurrent(initialState || {})
  const listeners = useRef<Listener[]>([])

  /**
   * 返回 store 存的所有的 state
   */
  const getState = () => get() as T

  /**
   * 监听器用于更新子组件
   * @param listener
   */
  const subscriber = (listener: Listener) => {
    if (typeof listener !== 'function') {
      throw new Error('expect listener to be a function')
    }

    listeners.current.push(listener)

    return () => {
      const index = listeners.current.indexOf(listener)
      listeners.current.splice(index, 1)
    }
  }

  const dispatch = (action: Action) => {
    const state = reducer(get() as T, action)
    set(state)
    return action
  }

  useEffect(() => {
    if (typeof reducer !== 'function') {
      throw new Error('expect reducer to be a function')
    }
  }, [])

  return {
    getState: getState,
    subscriber: subscriber,
    dispatch: dispatch
  }
}
