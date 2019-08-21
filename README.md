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

那么此时在组件中使用到 `a`, 那么就把 `a` 加入到依赖中，如果使用了 `a.b`, 就把 `a.b` 加入到依赖中，这样如果在其他组件中使用了 `a.c`, 那么 `b` 属性的
更新并不会让使用到 `a.c` 组件 `render`, 看下面的例子

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

如果 A 组件使用了 `b.c`, B 组件使用了 `b.d`, 那么依赖就可以这样写

```js
function A() {
  const {} = useSelector(() => ['b.c'])
}

function B() {
  const {} = useSelector(() => ['b.d'])
}
```

这样每次 `A` 组件 `render` 都不会造成 `B` 组件 `render`, 但是如果 A 组件和 B 组件都用到了 `b.c` 和 `b.d`

那么此时只需要把 `b` 加入到依赖中即可，深层比较是部分性能的优化

```js
function A() {
  const {} = useSelector(() => ['b'])
}

function B() {
  const {} = useSelector(() => ['b'])
}
```

## 使用中间件

中间件的使用方法和在 `redux` 中保持一致，但是因为在 `useSelector` 中又修改了 `dispatch`， 所以中间件的 `dispatch` 记得传递第二个参数

`logger`

```js
export function logger({ getState }: { getState: any }) {
  return (next: any) => (action: any, depth?: any[]) => {
    console.log('will dispatch', action);

    // Call the next dispatch method in the middleware chain.
    const returnValue = next(action, depth);

    console.log('state after dispatch', getState());

    // This will likely be the action itself, unless
    // a middleware further in chain changed it.
    return returnValue;
  };
}
```

在传递 `action` 的时候加上可选的第二个参数, 但是在业务中使用的时候还是只需要使用 `useSelector` 即可, 使用 `selector` 中的 `dispatch`

使用 `logger`

```js
import { applyMiddleware } from 'react-redux-chaos'

function App() {
  const store = useStore(
    reducer,
    { count: 0, age: 10, person: {} },
    applyMiddleware(logger))
}
```

## 后续计划

+ 优化 `useSelector` 的用法，简化依赖项
  