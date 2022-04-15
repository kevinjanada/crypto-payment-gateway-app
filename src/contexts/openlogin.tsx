import { createContext, ReactChild, useState, useEffect, useContext } from "react"
import OpenLogin from "@toruslabs/openlogin"

const OpenLoginContext = createContext<OpenLogin | null>(null)

export const OpenLoginProvider = ({ children }: { children: ReactChild }) => {
  const [openLogin, setOpenLogin] = useState<null | OpenLogin>(null)
  useEffect(() => {
    if (openLogin) return
    (async () => {
      const instance = new OpenLogin({
        clientId: "BDJETeYsprNVHLOIWRENnIgEdfnGbQjubXemk1ooh8RT6nbxLBnKUv-nyyXQQdEVnY5zYbE7SZjnNgDvNy6J9Pk", // client id can be anything for localhost
        network: "mainnet",
      });
      await instance.init();
      setOpenLogin(instance)
    })();
  }, [openLogin]);

  return (
    <OpenLoginContext.Provider value={openLogin}>
      {children}
    </OpenLoginContext.Provider>
  )
}

export const useOpenLogin = () => useContext(OpenLoginContext)