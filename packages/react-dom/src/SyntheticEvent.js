// dom[xxx] = reactElement props
export const elementPropsKey = '__props'

export function updateFiberProps(node, props) {
  node[elementPropsKey] = props
}

const validEventTypeList = ['click']

export function initEvent(container, eventType) {
  if (!validEventTypeList.includes(eventType)) {
    console.warn(`未注册的事件类型: ${eventType}`)
    return
  }

  console.log('初始化时间', eventType)

  container.addEventListener(eventType, (e) => {
    dispatchEvent(container, eventType, e)
  })
}

function dispatchEvent(container, eventType, e) {
  const targetElement = e.target

  if (targetElement === null) {
    console.warn('事件不存在target', e)
    return
  }

  // 1. 收集沿途的事件
  const { bubble, capture } = collectPaths(targetElement, container, eventType)

  // 2. 构造合成事件
  const se = createSyntheticEvent(e)

  // 3. 遍历 capture
  triggerEventFlow(capture, se)

  if (!se.__stopPropagation) {
    // 4. 遍历 bubble
    triggerEventFlow(bubble, se)
  }
}

function triggerEventFlow(paths, se) {
  for (let i = 0; i < paths.length; i++) {
    const callback = paths[i]
    callback.call(null, se)

    if (se.__stopPropagation) {
      break
    }
  }
}

function createSyntheticEvent(e) {
  const syntheticEvent = e
  syntheticEvent.__stopPropagation = false
  const originStopPropagation = e.stopPropagation

  syntheticEvent.stopPropagation = () => {
    syntheticEvent.__stopPropagation = true

    if (originStopPropagation) {
      originStopPropagation()
    }
  }

  return syntheticEvent
}

function getEventCallbackNameFromEventType(eventType) {
  return {
    click: ['onClickCapture', 'onClick'],
  }[eventType]
}

function collectPaths(targetElement, container, eventType) {
  const paths = {
    bubble: [],
    capture: [],
  }

  while (targetElement && targetElement !== container) {
    const elementProps = targetElement[elementPropsKey]
    if (elementProps) {
      // click -> onClick onClickCapture
      const callbackNameList = getEventCallbackNameFromEventType(eventType)

      if (callbackNameList) {
        callbackNameList.forEach((callbackName, i) => {
          const eventCallback = elementProps[callbackName]
          if (eventCallback) {
            if (i === 0) {
              // capture
              paths.capture.unshift(eventCallback)
            } else {
              paths.bubble.push(eventCallback)
            }
          }
        })
      }
    }

    targetElement = targetElement.parentNode
  }

  return paths
}
