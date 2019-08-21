import { compose } from './hookUtil'

/**
 * 直接应用 redux 中的 middleware
 * @param middlewares
 */
export default function applyMiddleware(...middlewares: any[]) {
  return (createStore: any) => (...args: any[]) => {
    const store = createStore(...args)
    let dispatch = (..._args: any[]) => {
      throw new Error(
        'Dispatching while constructing your middleware is not allowed. ' +
          'Other middleware would not be applied to this dispatch.'
      )
    }

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
