import React from "react"
import { useLocation, Navigate } from "react-router-dom"
import { useAuth } from "../contexts/auth"

export const AuthGuard = ({ children }: { children: JSX.Element }) => {
  const { user } = useAuth()
  let location = useLocation();

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return children
}