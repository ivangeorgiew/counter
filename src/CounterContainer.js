import React, { useState, useEffect } from 'react'
import { pureFunc, impureData } from './errorHandling'
import { Counter } from './Counter'

const getEventHandlers = pureFunc(
    'getting event handlers',
    ({ setDelay, setCount }) => impureData('event handlers for Counter', {
        handleOnChange: (e) => { setDelay(e.target.value) },
        handleOnClick: () => { setCount(0) }
    }),
    () => ({})
)

const directionEffects = pureFunc(
    'getting direction effects',
    ({ count, setShouldAdd }) => impureData(
        'changing the direction of the counter',
        () => {
            if (count === 0)
                setShouldAdd(true)
            if (count === 100)
                setShouldAdd(false)
        }
    ),
    () => () => {}
)

const timerEffects = pureFunc(
    'getting timer effects',
    ({ delay, shouldAdd, setCount }) => impureData(
        'ticking the counter',
        () => {
            const id = setTimeout(impureData(
                'Ticking the timer',
                () => {
                    if (shouldAdd)
                        setCount(count => count + 1)
                    else
                        setCount(count => count - 1)
                }
            ), delay)

            return () => clearTimeout(id)
        }
    ),
    () => () => {}
)

export const CounterContainer = impureData(
    'using counter',
    () => {
        const [count, setCount] = useState(0)
        const [delay, setDelay] = useState(10)
        const [shouldAdd, setShouldAdd] = useState(true)
        const handlers = getEventHandlers({ setDelay, setCount })

        useEffect(directionEffects({ count, setShouldAdd }))
        useEffect(timerEffects({ delay, shouldAdd, setCount }))

        return <Counter count={count} delay={delay} {...handlers} />
    },
    () => <Counter />
)
