# react-redux-chaos

a status manage library for react

## Install

```js
yarn add react-redux-chaos or npm install react-redux-chaos
```

`react-redux-chaos` 采用了全新的 `Hooks` 写法，同样也暴露出来 `Hooks` 的方法，可以在组件里面使用。

## Advantage

+ 采用全新的 `Hooks` 的写法
+ 用法简单，只需要在组件内部调用 `useSelector` 就能拿到最新的值
+ 局部更新， `react context` 会造成使用 `context` 的组件都会渲染，有性能问题， `react-redux-chaos` 只渲染更改的组件

## Usage

```js
import { Provider, useStore } from 'react-redux-chaos'
```

App.js

```js
import { Provider, useStore, combineReducers } from 'react-redux-chaos'

const initialState = { count: 0, name: 'snake' }

function App({ children }) {
  const store = useStore(combineReducers({ a: reducerA, b: reducerB }), initialState)
  return (
    <Provider value={store}>
      {children}
    </Provider>
  )
}
```

`combineReducers` 的写法和 redux 的写法保持一致

reducerA

action 必须要有 `type` 字段

```js
function reducerA(state, action) {
  switch (action.type) {
    case 'add': {
      return state + 1
    }
    case 'decrease': {
      return state - 1
    }
    default:
      return state
  }
}
```

reducerB

action 必须要有 `type` 字段

```js
function reducerA(state, action) {
  switch (action.type) {
    case 'change': {
      return 'chaos'
    }
    case 'delete': {
      return ''
    }
    default:
      return state
  }
}
```

## How to getState and dispatch

componentA.js

```js
import React from 'react'
import { useSelector } from 'react-redux-chaos'

export default function ComponentA() {
  const { getState, dispatch } = useSelector(() => ['count'])
  const state = getState();

  return (
    <div>
      count: {state.count}
      <button onClick={() => dispatch({ type: 'add' })}>add</button>
      <button onClick={() => dispatch({ type: 'decrease' })}>decrease</button>
    </div>
  );
}
```

当点击 `add` 的时候, count 将变为 1, 相反点击 `decrease` count 将变为 0

componentB.js

```js
import React from 'react'
import { useSelector } from 'react-redux-chaos'

export default function ComponentB() {
  const { getState, dispatch } = useSelector(() => ['name'])
  const state = getState();

  return (
    <div>
      name: {state.name}
      <button onClick={() => dispatch({ type: 'change' })}>change</button>
      <button onClick={() => dispatch({ type: 'delete' })}>delete</button>
    </div>
  );
}
```

B 组件的效果和 A 组件是类似的。

## useSelector

`useSelector` 是需要在组件中使用的一个 `hook`, 需要传递一个回调函数，回调函数返回一个数组，数组的 `key` 是组件中需要使用的值

用法

```js
useSelector(() => ['count'])
```

此时 `count` 是需要使用的，只要在组件中用到的值都需要加入依赖, 如果用到的是对象比如

```js
const { getState } = useSelector(() => ['a'])

const state = getState()

state.a.b
```

那么此时就需要 `a` 加入到依赖中，那么只要 a 中的任何值发生变化都会触发 `render`, 因为需要进行局部 `render`, 所以不会对依赖的内容进行深比较, 目前只对 `state 的第一层进行比较`, 下面的 state

`state`

```js
{
  a: 10,
  b: {
    c: 1,
    d: 2
  }
}
```

在使用 `c` 或者 `d` 的时候， 要把 `b` 加入到依赖中，每次只会对 `b`, 进行比较，所以需要更新内部的值的话，记得修改 `b` 的引用。 

## 后续计划

+ 优化 `useSelector` 的用法，简化依赖项
+ 增加中间件
  