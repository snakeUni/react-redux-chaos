import * as React from 'react'

function forceReducer(state: boolean) {
  return !state
}

/**
 * forceUpdate
 */
export function useForceUpdate() {
  return React.useReducer(forceReducer, false)[1]
}

/**
 * 获取当前的 state 的值
 * @param initialState
 */
export function useCurrent<T>(initialState: T): [() => T, (state: T) => void, T] {
  const [state, setState] = React.useState(initialState)
  const stateRef = React.useRef(initialState)

  const get = () => stateRef.current

  const set = (state: T) => {
    setState(state)
    stateRef.current = state
  }

  return [get, set, state]
}

let seed = 0
const now = Date.now()

export function getUuid() {
  return `chaos_${now}_${seed++}`
}
