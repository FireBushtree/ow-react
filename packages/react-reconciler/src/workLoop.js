import { beginWork } from './beginWork'
import { completeWork } from './completeWork'
import { HostRoot } from './workTags'
import { createWorkInProgress } from './fiber'
import { MutationMask, NoFlags } from './fiberFlags'
import { commitMutationEffects } from './commitWork'

let workInProgress = null

export function scheduleUpdateOnFiber(fiber) {
  // 调度功能
  const root = markUpdateFromFiberToRoot(fiber)
  renderRoot(root)
}

/**
 * 从当前节点向上递归找到根节点
 */
function markUpdateFromFiberToRoot(fiber) {
  let node = fiber
  let parent = fiber.return

  while (parent !== null) {
    node = parent
    parent = parent.return
  }

  if (node.tag === HostRoot) {
    return node.stateNode
  }

  return null
}

function prepareFreshStack(root) {
  // 初始化 workInProgress
  workInProgress = createWorkInProgress(root.current, {})
}

function renderRoot(root) {
  prepareFreshStack(root)

  try {
    workLoop()
  } catch {
    workInProgress = null
  }
  root.finishedWork = root.current.alternate

  // wip fiberNode树 树中的flags
  commitRoot(root)
}

function commitRoot(root) {
  const finishedWork = root.finishedWork
  if (finishedWork === null) {
    return
  }

  if (__DEV__) {
    console.warn('commit阶段开始', finishedWork)
  }

  // 重置
  root.finishedWork = null

  // 判断 3 个子阶段需要执行的操作
  // root flags root subtreeFlags
  const subtreeHasEffect = (finishedWork.subtreeFlags & MutationMask) !== NoFlags
  const rootHasEffect = (finishedWork.flags & MutationMask) !== NoFlags

  if (subtreeHasEffect || rootHasEffect) {
    // TODO 1. beforeMutation

    // 2. mutation Placement
    commitMutationEffects(finishedWork)
    root.current = finishedWork

    // TODO 3. layout
  } else {
    root.current = finishedWork
  }
}

function workLoop() {
  while (workInProgress !== null) {
    performUnitOfWork(workInProgress)
  }
}

function performUnitOfWork(fiber) {
  const next = beginWork(fiber)
  fiber.memoizedProps = fiber.pendingProps

  if (next === null) {
    completeUnitOfWork(fiber)
  } else {
    workInProgress = next
  }
}

function completeUnitOfWork(fiber) {
  let node = fiber

  do {
    completeWork(node)
    const sibling = node.sibling
    if (sibling !== null) {
      workInProgress = sibling
      return
    }

    node = node.return
    workInProgress = node
  } while (node !== null)
}
