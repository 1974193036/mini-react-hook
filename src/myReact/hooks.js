export function useReducer(reducer, initalState) {
  const dispatch = () => {
    console.log('dispatch')
  }

  return [initalState, dispatch]
}
