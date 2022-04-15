import { createContext, Dispatch, ReactChild, useReducer } from "react"

export interface IAppState {
  loading: boolean
}

const initialState = {
  loading: false
}

export default function reducer(state: IAppState, action: any) {
  switch(action.type) {
    case "SET_LOADING":
      return {
        ...state,
        loading: action.payload
      }
    default:
      throw new Error("Invalid action type : " + action.type);
  }
}

export const AppStateContext = createContext<[IAppState, Dispatch<any>]>([initialState, () => {}])

export const AppStateProvider = ({ children }:{ children: ReactChild }) => {
  const [state, dispatch] = useReducer(reducer, initialState)

  return (
    <AppStateContext.Provider value={[state, dispatch]}>
      {children}
    </AppStateContext.Provider>
  )
}
