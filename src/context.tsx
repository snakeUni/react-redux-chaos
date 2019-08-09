import * as React from 'react'
import { UseStoreResult } from './type'

export const storeContext = React.createContext<UseStoreResult<any> | undefined>(undefined)

/**
 * selectorContext 用户获取值并且可以和 dispatch 相应的值 这个可以进行缓存所以真正存储只的地方是 storeContext
 */
export const selectorContext = React.createContext<UseStoreResult<any> | undefined>(undefined)
