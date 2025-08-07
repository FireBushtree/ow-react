import type { Key, Props, Ref } from 'shared/ReactTypes'
import type { WorkTag } from './workTags'

export class FiberNode {
  stateNode: any
  type: any
  return: FiberNode | null
  sibling: FiberNode | null
  child: FiberNode | null
  index: number
  ref: Ref
  memoizedProps: Props | null

  constructor(
    readonly tag: WorkTag,
    public pendingProps: Props,
    public key: Key,
  ) {
    // 存储 当前真实的 dom
    this.stateNode = null
    // 如果是一个 FunctionComponent 就存储 FunctionComponent 的那个函数
    this.type = null

    // 构成树状结构
    // 父节点
    this.return = null
    // 兄弟节点 右边那个
    this.sibling = null
    this.child = null
    this.index = 0
    this.ref = null

    // 作为工作单元
    this.memoizedProps = null
  }
}
