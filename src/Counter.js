import React, { useState } from "react"
import { idxDef, createDef, boolDef, funcDef, tieImpure, tieInterval } from "tied-up"
import { synEventDef, useTiedEffect } from "./utils"

const changeDirection = tieImpure(
    "Counter -> changing direction",
    [
        createDef({
            strictProps: { newShouldAdd: boolDef, setShouldAdd: funcDef },
        }),
    ],
    (props, _) => {
        const { newShouldAdd, setShouldAdd } = props

        setShouldAdd(newShouldAdd)
    },
    () => {}
)

const createInterval = tieImpure(
    "Counter -> creating interval",
    [
        createDef({
            strictProps: { delay: idxDef, shouldAdd: boolDef, setCount: funcDef },
        }),
    ],
    (props, _) => {
        const { delay, shouldAdd, setCount } = props

        const id = tieInterval(
            "increasing count",
            [],
            () => {
                setCount(count => (shouldAdd ? count + 1 : count - 1))
            },
            () => {},
            delay
        )

        return () => clearInterval(id)
    },
    () => () => {}
)

const handleDelayChange = tieImpure(
    "Counter -> delay change",
    [funcDef, synEventDef],
    (setDelay, e) => {
        setDelay(Number(e.target.value))
    },
    () => {}
)

const handleResetClick = tieImpure(
    "Counter -> reset click",
    [funcDef],
    (setCount, _) => {
        setCount(0)
    },
    () => {}
)

export const Counter = tieImpure(
    "Counter",
    [
        createDef({
            strictProps: { defaultDelay: idxDef },
        }),
    ],
    props => {
        const { defaultDelay } = props

        const [count, setCount] = useState(0)
        const [delay, setDelay] = useState(defaultDelay)
        const [shouldAdd, setShouldAdd] = useState(true)
        const newShouldAdd = count === 0 ? true : count === 99 ? false : shouldAdd

        useTiedEffect(createInterval({ delay, shouldAdd, setCount }))
        useTiedEffect(changeDirection({ newShouldAdd, setShouldAdd }))

        return (
            <>
                <h1>Counter: {count}</h1>
                <label>
                    Delay:
                    <input
                        type="text"
                        value={delay}
                        onChange={handleDelayChange(setDelay)}
                    />
                </label>
                <button onClick={handleResetClick(setCount)}>Reset</button>
            </>
        )
    },
    () => (
        <>
            <h1>Counter: NaN</h1>
            <label>
                Delay:
                <input type="text" value={"NaN"} />
            </label>
            <button>Reset</button>
        </>
    )
)
