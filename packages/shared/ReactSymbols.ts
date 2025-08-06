const supportSymbol = typeof Symbol === 'function' && Symbol.for

export const REACT_ELEMENT_TYPE = supportSymbol ? Symbol.for('REACT_ELEMENT_TYPE') : 0xec7
