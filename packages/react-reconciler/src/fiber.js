import { NoFlags } from './fiberFlags'

export class FiberNode {
  constructor(tag, pendingProps, key) {
    this.tag = tag
    this.key = key
    this.stateNode = null
    this.type = null

    // 构成树状结构
    // 指向父fiberNode
    this.return = null
    // 右侧节点
    this.sibling = null
    this.child = null
    this.index = 0

    this.ref = null

    // 作为工作单元
    this.pendingProps = pendingProps
    this.memoizedProps = null

    // 双缓冲技术 current 跟 workInProgress 交换
    // 用于标记另外一个树
    this.alternate = null

    // 副作用
    this.flags = NoFlags
  }
}
