import { FunctionComponent, HostComponent, HostRoot, HostText } from './workTags'
import { appendInitialChild, createInstance, createTextInstance } from 'hostConfig'
import { NoFlags, Update } from './fiberFlags'
import { updateFiberProps } from '../../react-dom/src/SyntheticEvent'

function markUpdate(fiber) {
  fiber.flags |= Update
}

/**
 * 递归中的 归 阶段
 */
export const completeWork = (wip) => {
  const newProps = wip.pendingProps
  const current = wip.alternate

  switch (wip.tag) {
    case HostComponent:
      if (current !== null && wip.stateNode) {
        // update
        // 1. props 是否会变化
        // 2. 变了 update Flag
        updateFiberProps(wip.stateNode, newProps)
      } else {
        // 1. 构建DOM
        const instance = createInstance(wip.type, newProps)

        // 2. 将DOM插入到DOM树中
        appendAllChildren(instance, wip)
        wip.stateNode = instance
      }
      bubbleProperties(wip)
      return null
    case HostText:
      if (current !== null && wip.stateNode) {
        // update
        const oldText = current.memoizedProps.content
        const newText = newProps.content
        if (oldText !== newText) {
          markUpdate(wip)
        }
      } else {
        // 1. 构建DOM
        const instance = createTextInstance(newProps.content)
        wip.stateNode = instance
      }
      bubbleProperties(wip)
      return null
    case HostRoot:
      bubbleProperties(wip)
      return null
    case FunctionComponent:
      bubbleProperties(wip)
      return null

    default:
      if (__DEV__) {
        console.warn('未处理的completeWork type')
      }
      break
  }
}

function appendAllChildren(parent, wip) {
  let node = wip.child

  while (node !== null) {
    if (node.tag === HostComponent || node.tag === HostText) {
      appendInitialChild(parent, node.stateNode)
    } else if (node.child !== null) {
      node.child.return = node
      node = node.child
      continue
    }

    if (node === wip) {
      return
    }

    while (node.sibling === null) {
      if (node.return === null || node.return === wip) {
        return
      }

      node = node?.return
    }

    node.sibling.return = node.return
    node = node.sibling
  }
}

function bubbleProperties(wip) {
  let subtreeFlags = NoFlags
  let child = wip.child

  while (child !== null) {
    subtreeFlags |= child.subtreeFlags
    subtreeFlags |= child.flags

    child.return = wip
    child = child.sibling
  }

  wip.subtreeFlags |= subtreeFlags
}
