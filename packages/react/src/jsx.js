import { REACT_ELEMENT_TYPE } from 'shared'

function ReactElement(type, key, ref, props) {
  const element = {
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    key,
    ref,
    props,
    __mark: 'owen',
  }

  return element
}

export function jsx(type, config, ...maybeChildren) {
  let key = null
  let ref = null
  const props = {}

  for (const prop in config) {
    const val = config[prop]
    if (prop === 'key') {
      if (val !== undefined) {
        key = `${val}`
      }

      continue
    }

    if (prop === 'ref') {
      if (val !== undefined) {
        ref = val
      }
      continue
    }

    if ({}.hasOwnProperty.call(config, prop)) {
      props[prop] = val
    }

    const maybeChildrenLength = maybeChildren.length
    if (maybeChildrenLength) {
      if (maybeChildrenLength === 1) {
        props.children = maybeChildren[0]
      } else {
        props.children = maybeChildren
      }
    }
  }

  return ReactElement(type, key, ref, props)
}

export const jsxDev = jsx
