import { REACT_ELEMENT_TYPE } from 'shared'
import { createFiberFromElement, createWorkInProgress, FiberNode } from './fiber'
import { HostText } from './workTags'
import { ChildDeletion, Placement } from './fiberFlags'

function ChildReconcile(shouldTrackEffect) {
  function deleteChild(returnFiber, childToDelete) {
    if (!shouldTrackEffect) {
      return
    }

    const deletions = returnFiber.deletions

    if (deletions === null) {
      returnFiber.deletions = [childToDelete]
      returnFiber.flags |= ChildDeletion
    } else {
      deletions.push(childToDelete)
    }
  }

  function deleteRemainingChildren(returnFiber, currentFirstChild) {
    if (!shouldTrackEffect) {
      return
    }

    let childToDelete = currentFirstChild
    while (childToDelete !== null) {
      deleteChild(returnFiber, childToDelete)
      childToDelete = childToDelete.sibling
    }
  }

  function reconcileSingleElement(returnFiber, currentFiber, element) {
    const key = element.key

    while (currentFiber !== null) {
      // update

      // 1. key 相同
      if (currentFiber.key === key) {
        if (element.$$typeof === REACT_ELEMENT_TYPE) {
          // type 也相同
          if (currentFiber.type === element.type) {
            const existing = useFiber(currentFiber, element.props)
            // 更新父节点
            existing.return = returnFiber
            // 当前节点可复用，标记剩下的节点可删除
            deleteRemainingChildren(returnFiber, currentFiber.sibling)
            return existing
          }

          // key 相同 type 不用 删除所有旧的
          deleteChild(returnFiber, currentFiber)
          break
        } else {
          if (__DEV__) {
            console.warn('还未实现的 react 类型')
            break
          }
        }
      } else {
        // key不同 删掉旧的
        deleteChild(returnFiber, currentFiber)
        currentFiber = currentFiber.sibling
      }
    }

    const fiber = createFiberFromElement(element)
    fiber.return = returnFiber
    return fiber
  }

  function reconcileSingleTextNode(returnFiber, currentFiber, content) {
    while (currentFiber !== null) {
      // update
      if (currentFiber.tag === HostText) {
        const existing = useFiber(currentFiber, { content })
        // TODO 为什么需要重新标记父节点
        existing.return = returnFiber
        deleteRemainingChildren(returnFiber, currentFiber.sibling)
        return existing
      }

      deleteChild(returnFiber, currentFiber)
      currentFiber = currentFiber.sibling
    }

    const fiber = new FiberNode(HostText, { content }, null)
    fiber.return = returnFiber
    return fiber
  }

  function placeSingleChild(fiber) {
    // 首屏渲染
    if (shouldTrackEffect && fiber.alternate === null) {
      fiber.flags |= Placement
    }

    return fiber
  }

  function reconcileChildrenArray(returnFiber, currentFirstChild, newChild) {
    // 1. 将 current 保存在 map中
    const existingChildren = new Map()
    let current = currentFirstChild

    while (current !== null) {
      const keyToUse = current.key !== null ? current.key : current.index
      existingChildren.set(keyToUse, current)
      current = current.sibling
    }

    for (let i = 0; i < newChild.length; i++) {
      // 2. 遍历 newChild, 寻找是否可复用
      const after = newChild[i]

      const newFiber = updateFromMap(returnFiber, existingChildren, i, after)

      if (newFiber === null) {
        continue
      }

      // 3. 标记移动还是插入
    }

    // 4. 将Map中剩下的标记删除
  }

  function updateFromMap(returnFiber, existingChildren, index, element) {
    const keyToUse = element.key === null ? element.key : index
    const before = existingChildren.get(keyToUse)

    // HostText
    if (typeof element === 'string' || typeof element === 'number') {
      if (before) {
        if (before.tag === HostText) {
          existingChildren.delete(keyToUse)
          return useFiber(before, { content: element + '' })
        }
      }

      return new FiberNode(HostText, { content: element + '' })
    }

    // ReactElement
    if (typeof element === 'object' && element !== null) {
      switch (element.$$typeof) {
        case REACT_ELEMENT_TYPE:
          if (before) {
            if (before.type === element.type) {
              existingChildren.delete(keyToUse)
              return useFiber(before, element.props)
            }
          }
          return createFiberFromElement(element)
      }

      // TODO 数组类型
      if (Array.isArray(element)) {
      }
    }

    return null
  }

  return function reconcileChildFibers(returnFiber, currentFiber, newChild) {
    if (typeof newChild === 'object' && newChild !== null) {
      switch (newChild.$$typeof) {
        case REACT_ELEMENT_TYPE:
          return placeSingleChild(reconcileSingleElement(returnFiber, currentFiber, newChild))
        default:
          break
      }

      if (Array.isArray(newChild)) {
        return reconcileChildrenArray(returnFiber, currentFiber, newChild)
      }
    }

    // 多节点的情况

    // HostText
    if (typeof newChild === 'string' || typeof newChild === 'number') {
      return placeSingleChild(reconcileSingleTextNode(returnFiber, currentFiber, newChild))
    }

    if (currentFiber !== null) {
      // 兜底情况 两个都不是
      deleteChild(returnFiber, currentFiber)
    }

    return null
  }
}

function useFiber(fiber, pendingProps) {
  const clone = createWorkInProgress(fiber, pendingProps)
  clone.index = 0
  clone.sibling = null
  return clone
}

export const reconcileChildFibers = ChildReconcile(true)
export const mountChildFibers = ChildReconcile(false)
