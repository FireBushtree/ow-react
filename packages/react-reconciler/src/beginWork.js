import { FunctionComponent, HostComponent, HostRoot, HostText } from './workTags'
import { processUpdateQueue } from './updateQueue'
import { mountChildFibers, reconcileChildFibers } from './childFibers'
import { renderWithHooks } from './fiberHooks'

/**
 * 递归中的 递 阶段
 */
export const beginWork = (wip) => {
  switch (wip.tag) {
    case HostRoot:
      return updateHostRoot(wip)
    case HostComponent:
      return updateHostComponent(wip)
    case HostText:
      return null
    case FunctionComponent:
      return updateFunctionComponent(wip)
    default:
      break
  }

  return null
}

function updateFunctionComponent(wip) {
  const nextProps = wip.pendingProps
  const nextChildren = renderWithHooks(wip, nextProps)

  reconcileChildren(wip, nextChildren)
  return wip.child
}

/**
 * 1. 计算状态的最新值
 * 2. 创建子fiberNode
 */
function updateHostRoot(wip) {
  const baseState = wip.memoizedState
  const updateQueue = wip.updateQueue
  const pending = updateQueue.shared.pending
  updateQueue.shared.pending = null
  const { memoizedState } = processUpdateQueue(baseState, pending)
  wip.memoizedState = memoizedState

  const nextChildren = wip.memoizedState
  reconcileChildren(wip, nextChildren)
  return wip.child
}

function updateHostComponent(wip) {
  const nextProps = wip.pendingProps
  const nextChildren = nextProps.children
  reconcileChildren(wip, nextChildren)
  return wip.child
}

function reconcileChildren(wip, children) {
  const current = wip.alternate

  if (current !== null) {
    // update
    // 根据 节点逐步创建出 所有的 fibers
    wip.child = reconcileChildFibers(wip, current?.child, children)
  } else {
    // mount
    wip.child = mountChildFibers(wip, null, children)
  }
}
