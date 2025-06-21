import { FiberNode, FiberRootNode } from './fiber'
import { HostRoot } from './workTags'
import { createUpdate, createUpdateQueue, enqueueUpdate } from './updateQueue'
import { scheduleUpdateOnFiber } from './workLoop'

export function createContainer(container) {
  const hostRootFiber = new FiberNode(HostRoot, {}, null)
  const root = new FiberRootNode(container, hostRootFiber)
  hostRootFiber.updateQueue = createUpdateQueue()
  return root
}

export function updateContainer(element, root) {
  const hostRootFiber = root.current
  const update = createUpdate(element)
  // 将当前 update 插入 update 队列
  enqueueUpdate(hostRootFiber.updateQueue, update)
  scheduleUpdateOnFiber(hostRootFiber)

  return element
}
