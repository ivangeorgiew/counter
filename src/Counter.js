import React, { useState, useEffect } from "react"
import { idxDef, createDef, boolDef, funcDef, tie } from "tied-up"
import { synEventDef, useTiedEffect } from "./utils"

const changeDirection = tie({
    descr: "Counter -> changing direction",
    spec: [
        createDef({ strictProps: { newShouldAdd: boolDef, setShouldAdd: funcDef } }),
    ],
    onTry: (props, _) => {
        const { newShouldAdd, setShouldAdd } = props

        setShouldAdd(newShouldAdd)
    },
    onCatch: () => {},
})

const createInterval = tie({
    descr: "Counter -> creating interval",
    spec: [
        createDef({
            strictProps: { delay: idxDef, shouldAdd: boolDef, setCount: funcDef },
        }),
    ],
    onTry: (props, _) => {
        const { delay, shouldAdd, setCount } = props

        const id = setInterval(
            tie({
                descr: "increasing count",
                onTry: () => setCount(count => (shouldAdd ? count + 1 : count - 1)),
                onCatch: () => {},
            }),
            delay
        )

        return () => clearInterval(id)
    },
    onCatch: () => {},
})

const handleDelayChange = tie({
    descr: "Counter -> delay change",
    spec: [funcDef, synEventDef],
    onTry: (setDelay, e) => setDelay(Number(e.target.value)),
    onCatch: () => {},
})

const handleResetClick = tie({
    descr: "Counter -> reset click",
    spec: [funcDef],
    onTry: (setCount, _) => setCount(0),
    onCatch: () => {},
})

export const Counter = tie({
    descr: "Counter",
    spec: [createDef({ strictProps: { defaultDelay: idxDef } })],
    onTry: props => {
        const { defaultDelay } = props

        const [count, setCount] = useState(0)
        const [delay, setDelay] = useState(defaultDelay)
        const [shouldAdd, setShouldAdd] = useState(true)
        const newShouldAdd = count === 0 ? true : count === 99 ? false : shouldAdd

        useTiedEffect(createInterval({ delay, shouldAdd, setCount }))
        useTiedEffect(changeDirection({ newShouldAdd, setShouldAdd }))

        return (
            <>
                <h1>Counter: {count < 10 ? "0" + count : count}</h1>
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
    onCatch: () => (
        <>
            <h1>Counter: 0</h1>
            <label>
                Delay:
                <input type="text" value={"0"} />
            </label>
            <button>Reset</button>
        </>
    ),
})
