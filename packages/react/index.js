import currentDispatcher, { resolveDispatcher } from './src/currentDispatcher'
import { jsx } from './src/jsx'

export function useState(initialState) {
  const dispatcher = resolveDispatcher()
  return dispatcher.useState(initialState)
}

export const __SECRET_INTERNALS__OWEN = {
  currentDispatcher
}

export default {
  version: '0.0.0',
  createElement: jsx,
}
