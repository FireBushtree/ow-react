import { REACT_ELEMENT_TYPE } from 'shared/ReactSymbols'
import type {
  ElementType,
  Key,
  Props,
  ReactElement as ReactElementType,
  Ref,
  Type,
} from 'shared/ReactTypes'

// ReactElement
const ReactElement = (type: Type, key: Key, ref: Ref, props: Props) => {
  const element: ReactElementType = {
    $$typeof: REACT_ELEMENT_TYPE,
    type,
    key,
    ref,
    props,
    __mark: 'owen_react',
  }

  return element
}

export const jsx = (
  type: ElementType,
  config: any,
  ...maybeChildren: any[]
) => {
  let key: Key = null
  let ref: Ref = null
  const props: Props = {}

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
        ref = `${val}`
      }
      continue
    }

    if (Object.hasOwn(config, prop)) {
      props[prop] = val
    }
  }

  const maybeChildrenLength = maybeChildren.length

  // props.children 有两种可能
  // 1. 是一个对象
  // 2. 是一个数组
  if (maybeChildrenLength) {
    if (maybeChildrenLength === 1) {
      props.children = maybeChildren[0]
    } else {
      props.children = maybeChildren
    }
  }

  return ReactElement(type, key, ref, props)
}

export const jsxDEV = jsx
