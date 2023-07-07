import { useEffect, useRef } from 'react'

function useStateRef<T>(state: T) {
  const stateRef = useRef(state)

  useEffect(() => {
    stateRef.current = state
  }, [state])

  return stateRef
}

export { useStateRef }
