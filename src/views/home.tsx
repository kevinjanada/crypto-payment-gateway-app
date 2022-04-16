import { useAuth } from "../contexts/auth"
import { ChangeEvent, useState } from "react";
import { useNavigate } from "react-router-dom";
import Card from "../components/card"
import { useTorus } from "../contexts/torus";
import { ethers } from "ethers";
import { useEffect } from "react";
import { TextInput } from "../components/text-input";
import { ButtonPrimary } from "../components/button-primary";

function Home() {
  const {user, logout} = useAuth()
  const navigate = useNavigate()
  const torus = useTorus()

  const [account, setAccount] = useState<any>({})
  const [email, setEmail] = useState<string>("")
  const [eth, setEth] = useState<number>(0)
  const [ethProvider, setEthProvider] = useState<ethers.providers.Web3Provider | null>(null)
  const [loadingSendEth, setLoadingSendEth] = useState<boolean>(false)
  const [loadingMsg, setLoadingMsg] = useState<string | null>(null)
  const [errMsg, setErrMsg] = useState<any>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  useEffect(() => {
    (async () => {
      await getAccountInfo()
    })()
  })

  const getAccountInfo = async () => {
    const provider = new ethers.providers.Web3Provider(torus?.provider as any)
    setEthProvider(provider)
    const signer = provider.getSigner()
    const address = await signer.getAddress()
    const balanceInWei = (await signer.getBalance()).toString()
    const balanceInEth = ethers.utils.formatEther(balanceInWei)
    setAccount({ address, balance: balanceInEth.toString() })
  }

  const onClickLogout = async () => {
    await logout(() => navigate("/login"))
  }

  const onEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const onEthChange =(e: ChangeEvent<HTMLInputElement>) => {
    setEth(parseFloat(e.target.value))
  }

  const onSendEth = async () => {
    setLoadingSendEth(true)
    setLoadingMsg(null)
    setErrMsg(null)
    setSuccessMsg(null)
    try {
      const receiverAddress = await torus?.getPublicAddress({ verifier: "google", verifierId: email })
      const ethAmount = eth.toString()

      const ethInWei = ethers.utils.parseEther(ethAmount)
      console.log(ethInWei)
      const txRequest: ethers.providers.TransactionRequest = {
        to: receiverAddress as string,
        value: ethInWei,
        gasPrice: undefined,
        gasLimit: 100000,
        maxPriorityFeePerGas: ethers.utils.parseUnits("5", "gwei"),
        maxFeePerGas: ethers.utils.parseUnits("200", "gwei"),
      }
      setLoadingMsg("Please confirm transaction")
      const tx = await ethProvider?.getSigner().sendTransaction(txRequest)

      setLoadingMsg("Processing your transaction. Please wait...")
      const res = await tx?.wait()

      console.log(res)
      setSuccessMsg(`Successfully sent ${ethers.utils.formatEther(ethInWei)} to ${email} with eth address ${receiverAddress}`)
    } catch (err) {
      console.log(err)
      setErrMsg(err)
    }
    setLoadingSendEth(false)
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-800">
      <div className="flex justify-center items-center flex-col">
        {
          loadingSendEth &&
          <div className="fixed top-0 left-0 right-0 bottom-0 w-full h-screen z-50 overflow-hidden bg-gray-700 opacity-75 flex flex-col items-center justify-center">
            <svg role="status" className="inline mr-2 w-10 h-10 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600" viewBox="0 0 100 101" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z" fill="currentColor"/>
              <path d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z" fill="currentFill"/>
            </svg>
            <p className="text-white">
              {loadingMsg}
            </p>
          </div>
        }
        <Card>
          <div className="">
            <p>
              <strong>Email</strong>: {user.email}
            </p>
            <p>
              <strong>Name</strong>: {user.name}
            </p>
          </div>
          <div className="mt-4">
            <p className="break-word">
              <strong>Eth Wallet Address</strong>: <small>{account.address}</small>
            </p>
            <p className="mt-2">
              <strong>Eth Balance</strong>: {account.balance}
            </p>
          </div>
          {/* Send Eth Form */}
          <div className="mt-4">
            <p>
              <strong>Send Eth to Email</strong>
            </p>
            <TextInput
              label="Email"
              id="email"
              type="email"
              onChange={onEmailChange}
            />
            <TextInput
              label="Eth"
              id="eth"
              type="number"
              onChange={onEthChange}
            />
          </div>
          <div className="mt-3">
            <ButtonPrimary onClick={onSendEth}>
              Send Eth to Email
            </ButtonPrimary>
            {
              errMsg &&
              <p className="text-red-600">{errMsg}</p>
            }
            {
              successMsg &&
              <div>
                <small className="text-green-600">{successMsg}</small>
              </div>
            }
          </div>
          <div className="mt-10">
            <ButtonPrimary onClick={onClickLogout}>
              Logout
            </ButtonPrimary>
          </div>
        </Card>
      </div>
    </div>
  )
}

export default Home