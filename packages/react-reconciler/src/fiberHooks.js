import internals from 'shared/internals'

let currentlyRenderingFiber = null
let workInProgressHook = null

const { currentDispatcher } = internals

export function renderWithHooks(wip) {
  currentlyRenderingFiber = wip
  wip.memoizedState = null

  const current = wip.alternate
  if (current !== null) {
    // update
  } else {
    // mount
    currentDispatcher.current = HooksDispatcherOnMount
  }

  const Component = wip.type
  const props = wip.pendingProps
  const children = Component(props)
  return children
}

const HooksDispatcherOnMount = {
  useState: mountState
}

function mountState(initialState) {
  // 找到当前 useState 对应的 hook数据
}

function mountWorkInProgressHook() {
  const hook = {
    memoizedState: null,
    updateQueue: null,
    next: null
  }

  if (workInProgressHook === null) {
    // 第一个 hook
    if (currentlyRenderingFiber === null) {
      throw new Error('不在 function component 中')
    } else {
      workInProgressHook = hook
      currentlyRenderingFiber.memoizedState = workInProgressHook
    }
  } else {
    // 不是第一个 hook
    workInProgressHook.next = hook
  }
}
