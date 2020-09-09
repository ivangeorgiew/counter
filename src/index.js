import './index.css'
import getErrorHandling from 'tied-pants'
import React from 'react'
import ReactDOM from 'react-dom'

const { createData } = getErrorHandling({
    notify: ({ isUncaught, isFriendly, userMsg, productionMsg }) => {
        if (isUncaught) {
            alert(`ERROR - ${userMsg}`)
        } else if (isFriendly) {
            alert(`WARNING - ${userMsg}`)
        }
    }
})

const { memo, useState, useEffect, useMemo } = createData('React', React)
const { render } = createData('ReactDOM', ReactDOM)

const Counter = createData(
    'showing counter',
    memo((props = {}) => {
        const { count = 0, delay } = props
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
    }),
    () => <h1>Error with the counter</h1>
)

const CounterContainer = createData(
    'using counter',
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

        return <Counter {...{ count, delay, handleOnChange, handleOnClick }} />
    },
    () => <Counter />
)

const rootElement = document.getElementById('root')
render(<CounterContainer />, rootElement)
