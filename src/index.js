import React from 'react'
import { render } from 'react-dom'
import './index.css'
import { catchUnhandled } from './errorHandling'
import { CounterContainer } from './CounterContainer'

catchUnhandled()

const rootElement = document.getElementById('root')
render(<CounterContainer />, rootElement)
