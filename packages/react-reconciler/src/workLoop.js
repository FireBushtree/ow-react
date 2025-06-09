import { beginWork } from './beginWork'
import { completeWork } from './completeWork'

let workInProgress = null

function prepareFreshStack(fiber) {
  workInProgress = fiber
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
