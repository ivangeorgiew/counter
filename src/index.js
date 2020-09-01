import './index.css'
import getErrorHandling from 'tied-pants'
import _React from 'react'
import _ReactDOM from 'react-dom'

const { createData, initUncaughtErrorHandling } = getErrorHandling({
    onError: ({ userMsg, prodMsg }) => {
        //TODO change with actual notifications
        alert(userMsg)

        if (process?.env?.NODE_ENV === 'production') {
            //TODO change with actual logging in prod service
            console.info(prodMsg)
        }
    }
})

initUncaughtErrorHandling()

//doesn't slow-down performance (even speeds up at lower component renders)
export const React = createData('React', _React)
export const { useState, useEffect, useMemo } = React
export const ReactDOM = createData('ReactDOM', _ReactDOM)
export const { render } = ReactDOM


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

        const [handleOnChange, handleOnClick] = useMemo(
            () => createData('Event handlers', [
                (e) => { setDelay(e.target.value) },
                () => { setCount(0) }
            ]),
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
            <Counter {...{ count, delay, handleOnChange, handleOnClick }} />
        )
    },
    () => <Counter />
)

const rootElement = document.getElementById('root')
render(<CounterContainer />, rootElement)
