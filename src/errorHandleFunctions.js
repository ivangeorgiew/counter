export const isDevelopment = process && process.env && process.env.NODE_ENV ?
    process.env.NODE_ENV === 'development' :
    false

export const isBrowser = typeof window !== 'undefined'
    && ({}).toString.call(window) === '[object Window]'

export const isNodeJS = typeof global !== "undefined" 
    && ({}).toString.call(global) === '[object global]'

export const stringifyAll = function (data) {
    try {
        const parser = function(_key, val) {
            if (val instanceof Error) {
                return Object.getOwnPropertyNames(val).reduce((acc, key) => {
                    acc[key] = val[key]
                    return acc
                }, { stack: val.stack })
            }

            if (typeof val === 'function') {
                if (/^\s*async\s+/g.test(val)) {
                     return '[function Async]'
                }

                if (/^\s*class\s*\w*/g.test(val)) {
                    return '[function Class]'
                }

                if (/^\s*function\s*\*/g.test(val)) {
                    return '[function Generator]'
                }

                if (/^\s*\(.*\)\s+=>/g.test(val)) {
                    return '[function Arrow]'
                }

                return '[function Function]'
            }

            return val
        }

        return JSON.stringify(data, parser)
    } catch(e) {
        return JSON.stringify('[object Cyclic]')
    }
}

export const logError = function (params) {
    params = params === Object(params) ? params : {}

    const funcDesc = typeof params.funcDesc === 'string' ?
        params.funcDesc :
        'Unknown function'
    const err = params.err instanceof Error ?
        params.err :
        new Error('Unknown error')
    const args = Array.isArray(params.args) ?
        params.args.map(el => JSON.parse(stringifyAll(el))) :
        ['[unknown]']

    const stringOfArgs = args.reduce((acc, arg, idx) => {
        return idx === 0 ? (acc + arg) : (acc + ` , ${arg}`)
    }, '')

    if (isDevelopment) {
        console.log()
        console.error(` Issue with: ${funcDesc}\n Function arguments: ${stringOfArgs}\n`, err)
        console.log()
    }

    const commonProps = {
        functionDescription: funcDesc,
        arguments: args,
        date: new Date().toUTCString(),
        error: err
    }

    if (isBrowser) {
        //TODO notify the user
        alert(`Internal error with: ${funcDesc}`)

        //TODO logging service in production
        if (!isDevelopment) {
            console.info(stringifyAll({
                ...commonProps,
                localUrl: window.location.href,
                machineInfo: {
                    browserInfo: window.navigator.userAgent,
                    language: window.navigator.language,
                    osType: window.navigator.platform
                }
            }))
        }
    }

    if (isNodeJS && !isDevelopment) {
        //TODO logging service in production
        console.info(stringifyAll({
            ...commonProps,
            localUrl: __filename,
            machineInfo: {
                cpuArch: process.arch,
                osType: process.platform,
                depVersions: process.versions
            }
        }))
    }
}

export const createFunc = function(funcDesc, onTry, onCatch) {
    if (typeof onTry !== 'function') {
        logError({
            funcDesc: 'Undefined function',
            err: new Error(`Instead of function was given ${onTry}`)
        })

        return function() {}
    }

    const innerCatch = function({ err, args }) {
        logError({ funcDesc, err, args })
        
        if (typeof onCatch === 'function') {
            return createFunc('Catching errors', onCatch)
                .apply(this, args)
        }
    }

    if (onTry.constructor.name === 'AsyncFunction') {
        return async function(...args) {
            try {
                return await onTry.apply(this, args)
            } catch(err) {
                return innerCatch.call(this, { err, args })
            }
        }
    }

    return function(...args) {
        try {
            return onTry.apply(this, args)
        } catch(err) {
            return innerCatch.call(this, { err, args })
        }
    }
}

export const createMethods = createFunc(
    'Error handling methods',
    (obj, shouldHandleProto = false) => {
        Object.getOwnPropertyNames(obj).forEach(key => {
            if (key !== 'constructor' && obj[key] instanceof Function) {
                obj[key] = createFunc.call(obj,
                    `Executing method ${key}`,
                    obj[key],
                    obj.onCatch
                )
            }
        })
        
        if(shouldHandleProto) {
            createMethods(obj.prototype, false)
        }

        return obj
    },
    obj => obj
)

export const getWrapApp = app => createFunc(
    'Wrapping the server',
    (method, path, onTry) => {
        if (
            typeof method !== 'string' ||
            typeof path !== 'string' ||
            typeof onTry !== 'function' ||
            app !== Object(app)
        ) {
            return
        }

        app[method](path, createFunc(
            `app.${method}('${path}')`,
            onTry,
            (req, res, next) => {
                if (!res.headersSent) {
                    res.status(500).json({ message: 'Server error' })
                }
            }
        ))
    }
)

export const initUncaughtErrorHandling = createFunc(
    'Initializing uncaught errors handling',
    (args = {}) => {
        const server = args.server
        const port = args.port || 8080
        const sockets = args.sockets || new Set()

        const onUncaughtError = function(eventOrError) {
            const funcDesc = 'The app crashed, please restart!'

            if (isBrowser) {
                eventOrError.preventDefault()

                logError({ funcDesc, err: eventOrError.error || eventOrError.reason })

                //TODO in prod prevent user from interacting with the page
                if (!isDevelopment) {
                    window.document.body.style['pointer-events'] = 'none'
                }
            }

            if (isNodeJS) {
                if (server === Object(server) && server.close) {
                    server.close()
                }
                if (sockets instanceof Set) {
                    sockets.forEach(socket => { socket.destroy() })
                }

                let exitCode = 0

                if (eventOrError instanceof Error) {
                    exitCode = 1
                    logError({ funcDesc, err: eventOrError })
                }

                setTimeout(() => { process.exit(exitCode) }, 1000).unref()
            }
        }


        if (isBrowser) {
            window.addEventListener('error', onUncaughtError, true)
            window.addEventListener('unhandledrejection', onUncaughtError, true)
        }

        if (isNodeJS) {
            if (server === Object(server)) {
                server.on('connection', socket => {
                    sockets.add(socket);

                    socket.on('close', () => { sockets.delete(socket) })
                })

                server.listen(port, err => {
                    if (err) throw err
                    console.log(`Server listening on ${port}`)
                })
            }

            process.on('uncaughtException', onUncaughtError)
            process.on('unhandledRejection', onUncaughtError)
            process.on('SIGTERM', onUncaughtError)
            process.on('SIGINT', onUncaughtError)
        }
    }
)

/*
// *** EXAMPLES ***
if (isBrowser) {
    initUncaughtErrorHandling()
}

if (isNodeJS) {
    // Use `nodemon` for restarting on change
    // Usef `forever` for restarting on crash
    const http = require('http')
    const express = require('express')
    const app = express()
    const wrapApp = getWrapApp(app)

    wrapApp('use', '/', express.urlencoded({ extended: true }))
    wrapApp('use', '/', express.json())
    wrapApp('use', '/', (req, res, next) => {
        res.set('Access-Control-Allow-Origin', '*')
        res.set(
            'Access-Control-Allow-Headers',
            'Origin, X-Requested-With, Content-Type, Accept'
        )
        next()
    })

    wrapApp('get', '/', (req, res, next) => {
        res.send('Hello World!')

        throw new Error('whoops')
    })

    wrapApp('get', '/err', async (req, res, next) => {
        await new Promise(resolve => setTimeout(resolve, 1000))

        throw new Error('Async whoops')
    })

    app.get('/uncaught', async (req, res, next) => {
        throw new Error('Is uncaught error')
    })

    wrapApp('all', '*', (req, res, next) => {
        res.status(404).json({ message: 'Page not found' })
    })

    initUncaughtErrorHandling({ server: http.createServer(app) })
}

export const printNum = createFunc(
    'Printing a number',
    num => {
        blabla
        return num
    },
    num => {
        console.log(`Ran inside catch - the argument was ${num}`)
        return 0
    }
)

export const measureFib = createFunc(
    'Measuring time for fibonacci number',
    num => {
        const fib = n => {
            if (n < 0 || Math.trunc(n) !== n)
                throw new Error('num had to be positive integer')

            return n <= 1 ? n : fib(n-1) + fib(n-2)
        }

        const startTime = Date.now()	
    
        try {
            return fib(num)
        } finally {
            console.log(`execution time ${Date.now() - startTime}ms`)
        }
    },
    () => 'Incorrect fibonacchi calculation'
)

export const delayReturn = createFunc(
    'Delaying async function',
    async (ms) => {
        await new Promise(resolve => setTimeout(resolve, ms))
        
        if (typeof ms === 'number')
            return 'Proper result'
        else
            throw new Error('Async error from promise')
    },
    () => 'Default result'
)

export const undefinedFunc = createFunc()

console.log('undefinedFunc(31)', undefinedFunc(31))
console.log('printNum(9)', printNum(9))
delayReturn(10).then(val => console.log('delayReturn(10) ' + val))
console.log('measureFib(35)', measureFib(35))
console.log(
    'measureFib({ a: [ 2, 5, { b: { c: 123 } } ] }, -32.55)',
    measureFib({ a: [ 2, 5, { b: { c: 123 } } ] }, -32.55)
)
console.log('measureFib(-12)', measureFib(-12))
console.log('\nThe program continues...')
delayReturn('invalid ms').then(val => console.log('delayReturn("invalid ms")', val))
//new Promise(() => { uncaughtAsyncFunc() })
//setTimeout(() => { uncaughtSyncFunc() }, 500)
*/
