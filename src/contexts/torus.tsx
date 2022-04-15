import { createContext, ReactChild, useEffect, useState, useContext } from "react"
import Torus from "@toruslabs/torus-embed";

const TorusContext = createContext<null | Torus>(null);

export const TorusProvider = ({ children }: { children: ReactChild }) => {
  const [torus, setTorus] = useState<null | Torus>(null)
  useEffect(() => {
    if (torus) return
    (async () => {
      const _torus = new Torus({});
      await _torus.init({
        showTorusButton: false,
        network: {
          host: "rinkeby"
        }
      });
      setTorus(_torus);
    })();
  }, [torus]);

  return (
    <TorusContext.Provider value={torus}>
      {children}
    </TorusContext.Provider>
  )
}

export const useTorus = () => useContext(TorusContext)