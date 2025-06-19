export function renderWithHooks(wip) {
  const Component = wip.type
  const props = wip.pendingProps
  const children = Component(props)
  return children
}