import { ChildDeletion, MutationMask, NoFlags, Placement, Update } from './fiberFlags'
import { FunctionComponent, HostComponent, HostRoot, HostText } from './workTags'
import { appendChildToContainer, commitUpdate, removeChild } from 'hostConfig'

let nextEffect = null

export function commitMutationEffects(finishedWork) {
  nextEffect = finishedWork

  while (nextEffect !== null) {
    // 向下遍历
    const child = nextEffect.child
    if ((nextEffect.subtreeFlags & MutationMask) !== NoFlags && child !== null) {
      nextEffect = child
    } else {
      // 向上遍历
      up: while (nextEffect !== null) {
        commitMutationEffectsOnFiber(nextEffect)
        const sibling = nextEffect.sibling

        if (sibling !== null) {
          nextEffect = sibling
          break up
        }

        nextEffect = nextEffect.return
      }
    }
  }
}

function commitMutationEffectsOnFiber(finishedWork) {
  const flags = finishedWork.flags

  if ((flags & Placement) !== NoFlags) {
    commitPlacement(finishedWork)
    // 取消 effect 标记
    finishedWork.flags &= ~Placement
  }

  if ((flags & Update) !== NoFlags) {
    commitUpdate(finishedWork)
    // 取消 effect 标记
    finishedWork.flags &= ~Update
  }

  if ((flags & ChildDeletion) !== NoFlags) {
    const deletions = finishedWork.deletions
    if (deletions) {
      deletions.forEach((childToDelete) => {
        commitDeletion(childToDelete)
      })
    }
  }
}

/**
 *
 * @param {*} childToDelete
 *
 * 触发 useEffect中的 unmount, 解绑 ref 等
 */
function commitDeletion(childToDelete) {
  let rootHostNode = null

  commitNestedComponent(childToDelete, (unmountFiber) => {
    switch (unmountFiber.tag) {
      case HostComponent:
        if (rootHostComponent === null) {
          rootHostComponent = unmountFiber
        }

        return

      case HostText:
        if (rootHostComponent === null) {
          rootHostComponent = unmountFiber
        }

        return

      case FunctionComponent:
        // TODO useEffect中的 unmount
        break

      default:
        break
    }
  })

  if (rootHostNode !== null) {
    const hostParent = getHostParent(childToDelete)
    removeChild(rootHostNode, hostParent)
  }

  childToDelete.return = null
  childToDelete.child = null
}

function commitNestedComponent(root, onCommitUnmount) {
  let node = root
  while (true) {
    onCommitUnmount(node)

    if (node.child !== null) {
      // 向下遍历的过程
      node.child.return = node
      node = node.child
      continue
    }

    if (node === root) {
      // 中止条件
      return
    }

    while (node.sibling === null) {
      if (node.return === null || node.return === root) {
        return
      }

      // 向上归的过程
      node = node.return
    }

    node.sibling.return = node.return
    node = node.sibling
  }
}

function commitPlacement(finishedWork) {
  // parent DOM
  // finishedWork ~~ DOM
  if (__DEV__) {
    console.warn('执行Placement操作', finishedWork)
  }

  const hostParent = getHostParent(finishedWork)

  // 找到finishedWork对应的dom
  if (hostParent !== null) {
    appendPlacementNodeIntoContainer(finishedWork, hostParent)
  }
}

function getHostParent(fiber) {
  let parent = fiber.return
  while (parent) {
    const parentTag = parent.tag
    /// HostComponent HostRoot
    if (parentTag === HostComponent) {
      return parent.stateNode
    }
    if (parentTag === HostRoot) {
      return parent.stateNode.container
    }
    parent = parent.return
  }

  if (__DEV__) {
    console.warn('未找到parent')
  }

  return null
}

function appendPlacementNodeIntoContainer(finishedWork, hostParent) {
  if (finishedWork.tag === HostComponent || finishedWork.tag === HostText) {
    appendChildToContainer(hostParent, finishedWork.stateNode)
    return
  }

  const child = finishedWork.child

  if (child !== null) {
    appendPlacementNodeIntoContainer(child, hostParent)
    let sibling = child.sibling

    while (sibling !== null) {
      appendPlacementNodeIntoContainer(sibling, hostParent)
      sibling = sibling.sibling
    }
  }
}
