import React from 'react'
import ReactDOM from 'react-dom'
import pureErrorHandling from 'pure-error-handling'
import './index.css'

const { createData, initUncaughtErrorHandling } = pureErrorHandling({ notifyUser: alert })
const { useState, useEffect, useMemo } = createData(React)
const render = createData('React render method', ReactDOM.render)

initUncaughtErrorHandling()

const Counter = createData(
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

const CounterContainer = createData(
    'Using the counter',
    () => {
        const [count, setCount] = useState(0)
        const [delay, setDelay] = useState(1000)

        const { handleOnChange, handleOnClick } = useMemo(
            () => createData('Event handlers', {
                handleOnChange: (e) => { setDelay(e.target.value) },
                handleOnClick: () => { setCount(0) }
            }),
            [setCount, setDelay]
        )

        // Set up the interval.
        useEffect(() => {
            const tickTheTimer = createData(
                'Ticking the timer',
                () => { setCount(count + 1) }
            )

            const id = setTimeout(tickTheTimer, delay)

            return () => clearTimeout(id)
        }, [count, delay])

        return (
            <Counter
                {...{ count, delay, handleOnChange, handleOnClick }}
            />
        )
    },
    () => <Counter />
)

const rootElement = document.getElementById('root')
render(<CounterContainer />, rootElement)
