import React, { useState } from "react"
import { idxDef, createDef, boolDef, funcDef, tie, RETHROW } from "tied-up"
import { synEventDef, useTiedEffect } from "./utils"

const changeDirection = tie(
    "Counter -> change direction",
    [createDef({ strictProps: { newShouldAdd: boolDef, setShouldAdd: funcDef } })],
    (props, _) => {
        const { newShouldAdd, setShouldAdd } = props

        setShouldAdd(newShouldAdd)
    },
    () => RETHROW
)

// TODO: maybe implement it like this?
const createInterval = tie({
    desc: "Counter -> create interval",
    pre: props => [
        [ isIdx, props.delay ],
        [ isBool, props.shouldAdd ],
        [ isFunc, props.setCount ],
    ],
    post: r => [ [ isFunc, r ] ],
    onTry: (props, _) => {
        const { delay, shouldAdd, setCount } = props
        const id = setInterval(tie({
            desc: "change count",
            onTry: () => setCount(count => (shouldAdd ? count + 1 : count - 1)),
            onCatch: () => RETHROW,
        }), delay)

        return () => clearInterval(id)
    },
    onCatch: () => (() => {}),
})

const createInterval = tie(
    "Counter -> create interval",
    [
        createDef({
            strictProps: { delay: idxDef, shouldAdd: boolDef, setCount: funcDef },
        }),
    ],
    (props, _) => {
        const { delay, shouldAdd, setCount } = props

        const id = setInterval(
            tie(
                "increase count",
                [],
                () => setCount(count => (shouldAdd ? count + 1 : count - 1)),
                () => {}
            ),
            delay
        )

        return () => clearInterval(id)
    },
    () => RETHROW
)

const handleDelayChange = tie(
    "Counter -> delay change",
    [funcDef, synEventDef],
    (setDelay, e) => setDelay(Number(e.target.value)),
    () => {}
)

const handleResetClick = tie(
    "Counter -> reset click",
    [funcDef],
    (setCount, _) => setCount(0),
    () => {}
)

// TODO: maybe implement it like this?
export const Counter = tie({
    desc: "Counter",
    isPure: false,
    pre: props => [ [ isIdx, props.defaultDelay ] ],
    post: r => [ [ isHtml, r ] ],
    onTry: () => {
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
          <p>Issue with the component!</p>
          <h1>Counter: 0</h1>
          <label>
              Delay:
              <input type="text" value={"0"} />
          </label>
          <button>Reset</button>
      </>
  )
})

export const Counter = tie(
    "Counter",
    [createDef({ strictProps: { defaultDelay: idxDef } })],
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
    () => (
        <>
            <p>Issue with the component!</p>
            <h1>Counter: 0</h1>
            <label>
                Delay:
                <input type="text" value={"0"} />
            </label>
            <button>Reset</button>
        </>
    )
)
