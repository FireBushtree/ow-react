import { REACT_ELEMENT_TYPE } from 'shared'
import { createFiberFromElement, FiberNode } from './fiber'
import { HostText } from './workTags'
import { Placement } from './fiberFlags'

function ChildReconcile(shouldTrackEffect) {
  function reconcileSingleElement(returnFiber, currentFiber, element) {
    const fiber = createFiberFromElement(element)
    fiber.return = returnFiber
    return fiber
  }

  function reconcileSingleTextNode(returnFiber, currentFiber, content) {
    const fiber = new FiberNode(HostText, { content }, null)
    return fiber
  }

  function placeSingleChild(fiber) {
    // 首屏渲染
    if (shouldTrackEffect && fiber.alternate === null) {
      fiber.flags |= Placement
    }

    return fiber
  }

  return function reconcileChildFibers(returnFiber, currentFiber, newChild) {
    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(reconcileSingleElement(returnFiber, currentFiber, newChild))
        default:
          return
      }
    }

    // 多节点的情况

    // HostText
    if (typeof newChild === 'string' || typeof newChild === 'number') {
      return placeSingleChild(reconcileSingleTextNode(returnFiber, currentFiber, newChild))
    }

    return null
  }
}

export const reconcileChildFibers = ChildReconcile(true)
export const mountChildFibers = ChildReconcile(false)
