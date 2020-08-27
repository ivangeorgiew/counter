import React, { useState, useEffect, useMemo } from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { createFunc, createMethods, initUncaughtErrorHandling } from './errorHandling'

initUncaughtErrorHandling()

const Counter = React.memo(createFunc(
    'Showing the counter',
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
))

const rootElement = document.getElementById('root')
ReactDOM.render(<Counter />, rootElement)
