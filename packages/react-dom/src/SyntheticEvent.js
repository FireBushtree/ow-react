// dom[xxx] = reactElement props
export const elementPropsKey = '__props'

export function updateFiberProps(node, props) {
  node[elementPropsKey] = props
}

const validEventTypeList = []

function initEvent(container, eventType) {
  if (!validEventTypeList.includes(eventType)) {
    console.warn(`未注册的事件类型: ${eventType}`)
    return
  }

  console.log('初始化时间', eventType)

  container.addEventListener(eventType, e => {
    dispatchEvent(container, eventType, e)
  })
}

function dispatchEvent(container, eventType, e) {
  // 1. 收集沿途的事件
  // 2. 构造合成事件
  // 3. 遍历 capture
  // 4. 遍历 bubble
}