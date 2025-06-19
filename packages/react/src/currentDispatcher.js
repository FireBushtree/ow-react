const currentDispatcher = {
  current: null
}

export function resolveDispatcher() {
  const dispatcher = currentDispatcher.current
  if (dispatcher === null) {
    throw Error('不在 function component 中')
  }

  return dispatcher
}

export default currentDispatcher