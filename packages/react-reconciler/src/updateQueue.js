export const createUpdate = (action) => {
  return {
    action,
  }
}

export const createUpdateQueue = () => {
  return {
    shared: {
      pending: null,
    },
    dispatch: null,
  }
}

export const enqueueUpdate = (updateQueue, update) => {
  updateQueue.shared.pending = update
}

export const processUpdateQueue = (baseState, pendingUpdate) => {
  const result = {
    memoizedState: baseState,
  }

  if (pendingUpdate !== null) {
    // baseState 1 update 2 -> memoizedState 2
    // baseState 1 update () => 4x -> memoizedState 4
    const action = pendingUpdate.action
    if (action instanceof Function) {
      result.memoizedState = action(baseState)
    } else {
      result.memoizedState = action
    }
  }

  return result
}
