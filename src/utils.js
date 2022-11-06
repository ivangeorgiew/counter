import { useEffect } from "react"
import { createDef, funcDef, tie } from "tied-up"

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

export const useTiedEffect = tie({
    descr: "using tied react effect",
    spec: [funcDef],
    onTry: eff => useEffect(eff, [eff]),
    onCatch: () => {},
})
