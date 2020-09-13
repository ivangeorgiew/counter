import React from 'react'
import { pureFunc } from './errorHandling'

export const Counter = pureFunc(
    'rendering Counter',
    ({ count = 0, delay, handleOnClick, handleOnChange }) => {
        const readOnly = typeof handleOnChange !== 'function'

        return (
            <>
                <h1>Counter: {count}</h1>
                <label>
                    Delay:
                    <input
                        type="text"
                        readOnly={readOnly}
                        value={delay}
                        onChange={handleOnChange}
                    />
                </label>
                <button onClick={handleOnClick}>Reset</button>
            </>
        )
    },
    () => <h1>Error with the component</h1>
)
