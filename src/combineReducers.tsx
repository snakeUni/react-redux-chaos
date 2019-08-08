import * as React from 'react'
import { Reducers, Action } from './type'

/**
 * 用于把所有的 reducer 组装起来，和 redux 中的 combineReducers 类似
 * @param reducers
 */
export default function combineReducers<T>(reducers: Reducers<T>) {
  const keys = Object.keys(reducers)
  if (keys.length === 0) {
    throw new Error('reducer cannot be null')
  }
  return (state: T, action: Action) => {
    let hasChanged = false
    const nextState = {}
    keys.forEach(key => {
      const reducer = reducers[key]
      const previousState = (state as any)[key]
      const nextStateWithKey = reducer(previousState, action)
      ;(nextState as any)[key] = nextStateWithKey
      hasChanged = hasChanged || nextStateWithKey !== previousState
    })
    return hasChanged ? nextState : state
  }
}
