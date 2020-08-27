import getErrorHandling from 'pure-error-handling'

export const {
    createFunc,
    createMethods,
    initUncaughtErrorHandling
} = getErrorHandling({
    isProduction: process.env.NODE_ENV,
    notifyUser: alert,
    loggingService: console.info
})
