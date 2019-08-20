import { compose } from './hookUtil'

/**
 * 直接应用 redux 中的 middleware
 * @param middlewares
 */
export default function applyMiddleware(...middlewares: any[]) {
  return (createStore: any) => (...args: any[]) => {
    const store = createStore(...args)
    let dispatch = (...args: any[]) => {}

    const middlewareAPI = {
      getState: store.getState,
      dispatch: (...args: any[]) => dispatch(...args)
    }
    const chain = middlewares.map(middleware => middleware(middlewareAPI))
    dispatch = compose(...chain)(store.dispatch)

    return {
      ...store,
      dispatch
    }
  }
}
