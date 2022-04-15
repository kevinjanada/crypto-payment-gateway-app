import React, { useEffect, useState, useContext } from "react"
import { AppStateContext } from "./app-state";
import { useTorus } from "./torus"

export interface AuthContextType {
  user: any;
  login: (callback: VoidFunction) => void;
  logout: (callback: VoidFunction) => void;
}

const AuthContext = React.createContext<AuthContextType>(null!);

export const AuthProvider = ({ children}: { children: React.ReactChild }) => {
  const torus = useTorus()
  const [user, setUser] = useState<any>(null)
  const [, dispatch] = useContext(AppStateContext)

  useEffect(() => {
    (async () => {
      const publicKey = sessionStorage.getItem("publicKey")
      if (!publicKey) {
        return
      }
      dispatch({ type: "SET_LOADING", payload: true })
      const _userInfo = await torus?.getUserInfo("")
      if (_userInfo?.email) {
        setUser({
          ..._userInfo,
          publicKey,
        })
      }
      dispatch({ type: "SET_LOADING", payload: false })
    })()
  }, [torus, dispatch])

  const login = async (callback: VoidFunction) => {
    dispatch({ type: "SET_LOADING", payload: true })
    const publicKeys = await torus?.login()
    const publicKey = (publicKeys as string[])[0]
    sessionStorage.setItem("publicKey", publicKey)
    const _userInfo = await torus?.getUserInfo("");
    setUser({
      ..._userInfo,
      publicKey, 
    })
    callback()
    dispatch({ type: "SET_LOADING", payload: false })
  }

  const logout = async (callback: VoidFunction) => {
    try {
      await torus?.logout()
    } catch (err) {
      console.log(err)
    }
    setUser(null)
    callback()
  }

  const value = {user, login, logout}

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => React.useContext(AuthContext)