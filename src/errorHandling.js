import getErrorHandling from 'tied-pants'

export const { catchUnhandled, impureData, pureFunc } = getErrorHandling({
    notify: ({ isDevelopment, isUncaught, isFriendly, userMsg }) => {
        if (!isDevelopment) {
            if (isUncaught) alert(`ERROR - ${userMsg}`)
            else if (isFriendly) alert(`WARNING - ${userMsg}`)
        }
    }
})
