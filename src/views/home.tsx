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
    const tx = await ethProvider?.getSigner().sendTransaction(txRequest)
    const res = await tx?.wait()
    console.log(res)
  }

  return (
    <div className="w-screen h-screen flex justify-center items-center bg-gray-800">
      <div className="flex justify-center items-center flex-col">
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