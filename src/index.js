import "./index.css"
import React from "react"
import { render } from "react-dom"
import { isDev, FriendlyError, handleGlobalErrors, changeOptions } from "tied-up"
import { Counter } from "./Counter"

handleGlobalErrors(true)

changeOptions({
    notify: props => {
        const { descr, error } = props

        if (isDev || (!isDev && error instanceof FriendlyError)) {
            alert(`Error with: ${descr}`)
        }
    },
})

render(
    <React.StrictMode>
        <Counter defaultDelay={10} />
        <Counter defaultDelay={100} />
        <Counter defaultDelay={1000} />
    </React.StrictMode>,
    document.getElementById("root")
)
