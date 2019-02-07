import React from 'react'
import {render} from 'react-dom'
import App from './components/App.jsx'

import './index.scss'

render(<App endpoints={window.__noBackend.middlewaresRoutes} />,document.getElementById('root'))