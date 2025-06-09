import { beginWork } from './beginWork'
import { completeWork } from './completeWork'
import { HostRoot } from './workTags'
import { createWorkInProgress } from './fiber'

let workInProgress = null

function prepareFreshStack(root) {
  workInProgress = createWorkInProgress(root.current, {})
}

export function scheduleUpdateOnFiber(fiber) {
  // 调度功能
  const root = markUpdateFromFiberToRoot(fiber)
  renderRoot(root)
}

function markUpdateFromFiberToRoot(fiber) {
  let node = fiber
  let parent = fiber.return

  while (parent !== null) {
    node = parent
    parent = parent.return
  }

  if (node.tag === HostRoot) {
    return node
  }

  return null
}

function renderRoot(root) {
  prepareFreshStack(root)

  do {
    try {
      workLoop()
      break
    } catch {
      workInProgress = null
    }
    // eslint-disable-next-line no-constant-condition
  } while (true)
}

function workLoop() {
  while (workInProgress !== null) {
    performUnitOfWork()
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
