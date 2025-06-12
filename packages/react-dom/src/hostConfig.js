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
