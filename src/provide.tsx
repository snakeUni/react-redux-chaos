import * as React from 'react'
import { storeContext, selectorContext } from './context'
import { ProviderProps } from './type'

const { useState } = React

export default function Provider<T>({ value, children }: ProviderProps<T>) {
  // 缓存 value 的值进行局部更新
  const [api] = useState(value)

  return (
    <storeContext.Provider value={value}>
      <selectorContext.Provider value={api}>{children}</selectorContext.Provider>
    </storeContext.Provider>
  )
}
