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
    if (typeof listener !== 'object') {
      throw new Error('expected listener to be a object')
    }

    // 加入到监听器中
    listeners.current.push(listener)

    return () => {
      const index = listeners.current.indexOf(listener)
      listeners.current.splice(index, 1)
    }
  }

  const dispatch = (action: Action, deps: string[]) => {
    const oldState = get()
    // 获取到执行后的 state
    const state = reducer(oldState as T, action)
    set(state)

    const changeKeys: string[] = []

    // 进行浅比较获取到修改的值
    deps.forEach(key => {
      if ((oldState as any)[key] !== (state as any)[key]) {
        changeKeys.push(key)
      }
    })

    // 遍历监听器，只对变化的组件进行更新
    listeners.current.forEach(listener => {
      const listenerProps = listener.props
      // 遍历监听器，对修改的部分进行更新
      for (let i = 0; i < changeKeys.length; i++) {
        if (listenerProps.indexOf(changeKeys[i]) > -1) {
          listener.listener()
        }
      }
    })

    return action
  }

  useEffect(() => {
    if (typeof reducer !== 'function') {
      throw new Error('expect reducer to be a function')
    }
  }, [reducer])

  return {
    getState: getState,
    subscriber: subscriber,
    dispatch: dispatch
  }
}
