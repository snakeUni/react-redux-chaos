import * as React from 'react'
import { useCurrent, getPath } from './hookUtil'
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

  /**
   * 用于修改值, 用于中间件的时候可以不传第二个值，但是在 selector 中仍然需要
   * @param action
   * @param deps 可能不存在，如果不存在则全部更新
   */
  const dispatch = (action: Action, deps?: string[]) => {
    const oldState = get()
    // 获取到执行后的 state
    const state = reducer(oldState as T, action)
    set(state)

    const changeKeys: string[] = []

    // 进行浅比较获取到修改的值
    if (deps) {
      deps.forEach(key => {
        const oldValue = getPath(oldState, key)
        const newValue = getPath(state, key)
        if (oldValue !== newValue) {
          changeKeys.push(key)
        }
      })
    }

    // 遍历监听器，只对变化的组件进行更新
    listeners.current.forEach(listener => {
      const listenerProps = listener.props
      // 如果依赖存在则更新依赖中的选项，如果不存在则更新全部
      if (deps) {
        // 遍历监听器，对修改的部分进行更新
        for (let i = 0; i < changeKeys.length; i++) {
          if (listenerProps.indexOf(changeKeys[i]) > -1) {
            listener.listener()
          }
        }
      } else {
        listener.listener()
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
