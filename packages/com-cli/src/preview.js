'use strict'
import '@babel/polyfill'
import * as React from 'react'
import * as ReactDOM from 'react-dom'

import App from './App'
import UserComponent from '@component-entry'

ReactDOM.render(<App UserComponent={UserComponent} />, document.getElementById('app'))
