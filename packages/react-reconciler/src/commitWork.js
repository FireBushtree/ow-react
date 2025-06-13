import { MutationMask, NoFlags, Placement } from './fiberFlags'
import { HostComponent, HostRoot, HostText } from './workTags'
import { appendChildToContainer } from 'hostConfig'

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
    finishedWork.flags &= ~Placement
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
