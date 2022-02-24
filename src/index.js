import "./index.css"
import React from "react"
import { render } from "react-dom"
import { isDev, FriendlyError, globalHandleErrors, changeOptions } from "tied-up"
import { Counter } from "./Counter"

globalHandleErrors(true)

changeOptions({
    notify: props => {
        const { description, error } = props

        if (isDev || (!isDev && error instanceof FriendlyError)) {
            alert(`ERROR: ${description}`)
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
