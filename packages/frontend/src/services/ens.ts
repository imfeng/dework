import { ethers } from 'ethers'
import { ENS_ABI } from '@/constants/abi'

const ENS_REGISTRY_ADDRESS = process.env.NEXT_PUBLIC_ENS_REGISTRY_ADDRESS
const ENS_RESOLVER_ADDRESS = process.env.NEXT_PUBLIC_ENS_RESOLVER_ADDRESS

declare global {
  interface Window {
    ethereum?: any
  }
}

export const ensService = {
  async resolveName(name: string): Promise<string | null> {
    try {
      if (!window.ethereum) throw new Error('No Ethereum provider found')
      const provider = new ethers.BrowserProvider(window.ethereum)
      const resolver = await provider.getResolver(name)
      if (!resolver) return null
      return await resolver.getAddress()
    } catch (error) {
      console.error('Error resolving ENS name:', error)
      return null
    }
  },

  async registerName(name: string, address: string): Promise<string> {
    try {
      if (!window.ethereum) throw new Error('No Ethereum provider found')
      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const registry = new ethers.Contract(
        ENS_REGISTRY_ADDRESS as string,
        ENS_ABI,
        signer
      )

      const tx = await registry.register(name, address)
      await tx.wait()
      return tx.hash
    } catch (error) {
      console.error('Error registering ENS name:', error)
      throw error
    }
  },

  async isNameAvailable(name: string): Promise<boolean> {
    try {
      if (!window.ethereum) throw new Error('No Ethereum provider found')
      const provider = new ethers.BrowserProvider(window.ethereum)
      const registry = new ethers.Contract(
        ENS_REGISTRY_ADDRESS as string,
        ENS_ABI,
        provider
      )
      return await registry.available(name)
    } catch (error) {
      console.error('Error checking ENS name availability:', error)
      return false
    }
  },

  async getPrimaryName(address: string): Promise<string | null> {
    try {
      if (!window.ethereum) throw new Error('No Ethereum provider found')
      const provider = new ethers.BrowserProvider(window.ethereum)
      const registry = new ethers.Contract(
        ENS_REGISTRY_ADDRESS as string,
        ENS_ABI,
        provider
      )
      const name = await registry.primaryName(address)
      return name || null
    } catch (error) {
      console.error('Error getting primary ENS name:', error)
      return null
    }
  },
} 