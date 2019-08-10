/**
 * useSelector 通过 context 注入相应的信息，如果修改的是当前组件，那么只渲染当前的组件，需要把相应组件用到的 props
 * 全部放入到监控函数中，只要其中发生变化就调用 forceUpdate 触发组件的 re-render, 但是不会影响其他组件的 re-render, 否则就会像 react-redux 的 v6版本
 * 引起不必要渲染导致的的性能问题，最终回退到之前的订阅的版本
 */

import * as React from 'react'
import { selectorContext } from './context'
import { useForceUpdate, getUuid } from './hookUtil'
import { Action, UseSelector } from './type'

const { useEffect, useContext } = React

export default function useSelector<T>(): UseSelector<T> {
  const api = useContext(selectorContext)
  const forceUpdate = useForceUpdate()
  const randomId = React.useRef(getUuid())

  if (!api) {
    throw new Error('expected useSelector to be used in Provider')
  }

  useEffect(() => {
    // 订阅需要的信息
    const unsubcriber = api.subscriber({
      uuid: randomId.current,
      listener: () => forceUpdate(false)
    })
    // 组件卸载的时候取消注册
    return () => {
      unsubcriber()
    }
  }, [api, forceUpdate])

  return {
    dispatch: (action: Action) => {
      api.dispatch(action, randomId.current)
      return action
    },
    getState: api.getState
  }
}
