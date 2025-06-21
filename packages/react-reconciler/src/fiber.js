import { NoFlags } from './fiberFlags'
import { FunctionComponent, HostComponent } from './workTags'

export class FiberNode {
  constructor(tag, pendingProps, key) {
    this.tag = tag
    this.key = key
    this.stateNode = null
    this.type = null

    // 构成树状结构
    // 指向父 fiberNode
    this.return = null
    // 右侧节点
    this.sibling = null
    this.child = null
    this.index = 0

    this.ref = null

    // 作为工作单元
    this.pendingProps = pendingProps
    this.memoizedProps = null
    this.memoizedState = null
    this.updateQueue = null

    // 双缓冲技术 current 跟 workInProgress 交换
    // 用于标记另外一个树
    this.alternate = null

    // 副作用
    this.flags = NoFlags
    this.subtreeeFlags = NoFlags
  }
}

export class FiberRootNode {
  constructor(container, hostRootFiber) {
    this.container = container
    this.current = hostRootFiber
    hostRootFiber.stateNode = this
    this.finishedWork = null
  }
}

export const createWorkInProgress = (current, pendingProps) => {
  let wip = current.alternate

  if (wip === null) {
    // mount
    wip = new FiberNode(current.tag, pendingProps, current.key)
    wip.stateNode = current.stateNode

    wip.alternate = current
    current.alternate = wip
  } else {
    // update
    wip.pendingProps = pendingProps
    wip.flags = NoFlags
  }
  wip.type = current.type
  wip.updateQueue = current.updateQueue
  wip.child = current.child
  wip.memoizedProps = current.memoizedProps
  wip.memoizedState = current.memoizedState

  return wip
}

export function createFiberFromElement(element) {
  const { type, key, props } = element
  let fiberTag = FunctionComponent

  if (typeof type === 'string') {
    // <div> type: 'div'
    fiberTag = HostComponent
  } else if (type !== 'function') {
    console.warn('未定义的type类型', element)
  }

  const fiber = new FiberNode(fiberTag, props, key)
  fiber.type = type
  return fiber
}
