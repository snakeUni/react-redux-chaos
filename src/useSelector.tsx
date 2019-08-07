/**
 * useSelector 通过 context 注入相应的信息，如果修改的是当前组件，那么只渲染当前的组件，需要把相应组件用到的 props
 * 全部放入到监控函数中，只要其中发生变化就调用 forceUpdate 触发组件的 re-render, 但是不会影响其他组件的 re-render, 否则就会像 react-redux 的 v6版本
 * 引起不必要渲染导致的的性能问题，最终回退到之前的订阅的版本
 */

import * as React from 'react'
import { selectorContext, SelectorContext } from './context'
import { useForceUpdate } from './hookUtil'

const { useEffect, useContext } = React

export default function useSelector<T>(callbalk: (state: T) => any[]): SelectorContext<T> {
  const api = useContext(selectorContext)
  const forceUpdate = useForceUpdate()
  if (!api) {
    throw new Error('expected useSelector to be used in Provider')
  }
  useEffect(() => {
    forceUpdate(false)
  }, callbalk(api.getState()))
  return api as any
}
