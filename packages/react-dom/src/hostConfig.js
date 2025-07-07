import { HostText } from 'react-reconciler/src/workTags'

export const createInstance = (type, props) => {
  // TODO handle props
  const element = document.createElement(type)
  return element
}

export const createTextInstance = (content) => {
  return document.createTextNode(content)
}

export const appendInitialChild = (parent, child) => {
  parent.appendChild(child)
}

export const appendChildToContainer = appendInitialChild

export const commitUpdate = (fiber) => {
  switch (fiber.tag) {
    case HostText:
      const text = fiber.memoizedProps.content
      return commitTextUpdate(fiber.stateNode, text)
    default:
      if (__DEV__) {
        console.log('还没实现的commit类型', fiber)
      }
      break
  }
}

export function commitTextUpdate(textInstance, content) {
  textInstance.textContent = content
}

export function removeChild(child, container) {
  container.removeChild(child)
}