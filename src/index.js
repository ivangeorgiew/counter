import React, { useState, useEffect, useMemo } from 'react'
import ReactDOM from 'react-dom'
import pureErrorHandling from 'pure-error-handling'
import './index.css'

const errorHandlers = pureErrorHandling({
    isProduction: process.env.NODE_ENV === 'production',
    notifyUser: alert
})
const { createFunc, createMethods, initUncaughtErrorHandling } = errorHandlers
const createReactFunc = function (funcDesc, onTry, onCatch) {
    return React.memo(createFunc(funcDesc, onTry, onCatch))
}

initUncaughtErrorHandling()

const Counter = createReactFunc(
    'Showing the counter',
    (props = {}) => {
        const { count = 0, delay = 1000 } = props
        const { handleOnChange, handleOnClick } = props

        return (
            <>
                <h1>Counter: {count}</h1>
                <label>
                    Delay:
                    <input type="text" value={delay} onChange={handleOnChange} />
                </label>
                <button onClick={handleOnClick}>Reset</button>
            </>
        )
    },
    () => <h1>Error with the counter</h1>
)

const CounterContainer = createReactFunc(
    'Using the counter',
    () => {
        const [count, setCount] = useState(0)
        const [delay, setDelay] = useState(1000)

        const { handleOnChange, handleOnClick } = useMemo(() => createMethods({
            handleOnChange: (e) => {
                setDelay(e.target.value)
            },
            handleOnClick: () => {
                setCount(0)
            }
        }), [setCount, setDelay])

        const createEffects = useMemo(() => createFunc(
            'Using side effects',
            () => {
                const id = setTimeout(createFunc(
                    'Ticking the timer',
                    () => { setCount(count + 1) }
                ), delay)

                return () => clearTimeout(id)
            }
        ), [count, delay])

        // Set up the interval.
        useEffect(() => createEffects(), [createEffects])

        return (
            <Counter
                {...{ count, delay, handleOnChange, handleOnClick }}
            />
        )
    },
    () => <Counter />
)

const rootElement = document.getElementById('root')
ReactDOM.render(<CounterContainer />, rootElement)
