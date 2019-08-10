import * as React from 'react'
import { render, cleanup, fireEvent } from '@testing-library/react'
import { Provider, combineReducers, useStore, useSelector } from '../src'

describe('react-redux-chaos test', () => {
  afterEach(cleanup)

  function countReducer(state = 0, action: any) {
    switch (action.type) {
      case 'increase': {
        return state + 1
      }
      case 'decrease': {
        return state - 1
      }
      default:
        return state
    }
  }

  function ageReducer(state = 18, action: any) {
    switch (action.type) {
      case 'increaseBy': {
        return state + action.payload
      }
      case 'decreaseBy': {
        return state - action.payload
      }
      default:
        return state
    }
  }

  const initialState = { count: 0, age: 18 }
  function DemoProvider({ children }: any) {
    const store = useStore(
      combineReducers({ count: countReducer, age: ageReducer }) as any,
      initialState
    )
    return <Provider value={store}>{children}</Provider>
  }

  function CountComponent() {
    const { getState, dispatch } = useSelector(() => ['count'])
    const state: any = getState()

    return (
      <div>
        <div>count: {state.count}</div>
        <div>
          <button onClick={() => dispatch({ type: 'increase' })}>increaseCount</button>
          <button onClick={() => dispatch({ type: 'decrease' })}>decreaseCount</button>
        </div>
      </div>
    )
  }

  function AgeComponent() {
    const { getState, dispatch } = useSelector(() => ['age'])
    const state: any = getState()

    return (
      <div>
        <div>age: {state.age}</div>
        <div>
          <button onClick={() => dispatch({ type: 'increaseBy', payload: 10 })}>increaseAge</button>
          <button onClick={() => dispatch({ type: 'decreaseBy', payload: 5 })}>decreaseAge</button>
        </div>
      </div>
    )
  }

  it('snapshot', () => {
    const { container } = render(
      <DemoProvider>
        <CountComponent />
        <AgeComponent />
      </DemoProvider>
    )
    expect(container.innerHTML).toMatchSnapshot()
  })

  it('trigger count button', () => {
    const { getByText } = render(
      <DemoProvider>
        <CountComponent />
        <AgeComponent />
      </DemoProvider>
    )
    expect(getByText('count: 0')).not.toBeNull()
    fireEvent.click(getByText(/increaseCount/i))
    expect(getByText('count: 1')).not.toBeNull()
    fireEvent.click(getByText(/decreaseCount/i))
    expect(getByText('count: 0')).not.toBeNull()
  })

  it('trigger age button', () => {
    const { getByText } = render(
      <DemoProvider>
        <CountComponent />
        <AgeComponent />
      </DemoProvider>
    )
    expect(getByText('age: 18')).not.toBeNull()
    fireEvent.click(getByText(/increaseAge/i))
    expect(getByText('age: 28')).not.toBeNull()
    fireEvent.click(getByText(/decreaseAge/i))
    expect(getByText('age: 23')).not.toBeNull()
  })
})
