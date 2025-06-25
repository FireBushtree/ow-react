import internals from 'shared/internals'
import { createUpdate, createUpdateQueue, enqueueUpdate, processUpdateQueue } from './updateQueue'
import { scheduleUpdateOnFiber } from './workLoop'

let currentlyRenderingFiber = null
let workInProgressHook = null
let currentHook = null

const { currentDispatcher } = internals

export function renderWithHooks(wip) {
  currentlyRenderingFiber = wip
  wip.memoizedState = null

  const current = wip.alternate
  if (current !== null) {
    // update
    currentDispatcher.current = HooksDispatcherOnUpdate
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
  useState: mountState,
}

const HooksDispatcherOnUpdate = {
  useState: updateState,
}

function dispatchSetState(fiber, updateQueue, action) {
  const update = createUpdate(action)
  enqueueUpdate(updateQueue, update)
  scheduleUpdateOnFiber(fiber)
}

function mountState(initialState) {
  // 找到当前 useState 对应的 hook数据
  const hook = mountWorkInProgressHook()
  let memoizedState

  if (initialState instanceof Function) {
    memoizedState = initialState()
  } else {
    memoizedState = initialState
  }

  const queue = createUpdateQueue()
  hook.updateQueue = queue
  hook.memoizedState = memoizedState

  const dispatch = dispatchSetState.bind(null, currentlyRenderingFiber, queue)
  queue.dispatch = dispatch

  return [memoizedState, dispatch]
}

function updateState() {
  const hook = updateWorkInProgressHook()
  const queue = hook.updateQueue
  const pending = queue.shared.pending

  if (pending !== null) {
    const { memoizedState } = processUpdateQueue(hook.memoizedState, pending)
    hook.memoizedState = memoizedState
  }

  return [hook.memoizedState, queue.dispatch]
}

function updateWorkInProgressHook() {
  // TODO render阶段触发的更新
  let nextCurrentHook

  if (currentHook === null) {
    // FC update时的 第一个 hook
    const current = currentlyRenderingFiber?.alternate

    if (current !== null) {
      nextCurrentHook = current.memoizedState
    } else {
      // mount 错误的边界情况
      nextCurrentHook = null
    }
  } else {
    // FC update时的 后续的hook
    nextCurrentHook = currentHook.next
  }

  if (nextCurrentHook === null) {
    throw new Error(`组件${currentlyRenderingFiber?.type}本次执行时的hook比上次执行时多`)
  }

  currentHook = nextCurrentHook

  // 标记 新的 hook
  const newHook = {
    memoizedState: currentHook.memoizedState,
    updateQueue: currentHook.updateQueue,
    next: null
  }

  if (workInProgressHook === null) {
    // 第一个 hook
    if (currentlyRenderingFiber === null) {
      throw new Error('不在 function component 中')
    } else {
      workInProgressHook = newHook
      currentlyRenderingFiber.memoizedState = workInProgressHook
    }
  } else {
    // 不是第一个 hook
    workInProgressHook.next = newHook
    workInProgressHook = newHook
  }

  return workInProgressHook
}

function mountWorkInProgressHook() {
  const hook = {
    memoizedState: null,
    updateQueue: null,
    next: null,
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
    workInProgressHook = hook
  }

  return workInProgressHook
}
