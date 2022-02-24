import { useEffect } from "react"
import { createDef, funcDef, tieImpure } from "tied-up"

export const synEventDef = createDef({
    getMsg: arg => {
        const errMsg = "must be SyntheticEvent"

        try {
            return arg.constructor.name !== "SyntheticEvent" ? errMsg : ""
        } catch {
            return errMsg
        }
    },
})

export const useTiedEffect = tieImpure(
    "using tied react effect",
    [funcDef],
    eff => {
        useEffect(eff, [eff])
    },
    () => {
        useEffect(() => {}, [])
    }
)
