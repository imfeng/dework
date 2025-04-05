'use client'

import { useState } from 'react'
import { useDework } from '@/hooks'
import { formatEther } from 'viem'

// 模擬物件數據
const mockProperties = [
  {
    id: 1,
    name: '台北市中山區商辦空間',
    description: '位於台北市中山區的現代化辦公空間，交通便利，設施齊全。',
    depositAmount: BigInt(2000 * 1e6),
    monthlyRent: BigInt(500 * 1e6),
    landlord: '0x8731d54E9D02c286767d56ac03e8037C07e01e98',
    leaseDuration: 365,
    ensName: 'taipei-office.eth',
    image: '/images/property1.jpg'
  },
  {
    id: 2,
    name: '新竹科學園區實驗室',
    description: '適合生技或科技研發的專業實驗室空間，設備先進。',
    depositAmount: BigInt(3000 * 1e6),
    monthlyRent: BigInt(800 * 1e6),
    landlord: '0x8731d54E9D02c286767d56ac03e8037C07e01e98',
    leaseDuration: 730,
    ensName: 'hsinchu-lab.eth',
    image: '/images/property2.jpg'
  },
  {
    id: 3,
    name: '台中市西屯區倉儲空間',
    description: '面積寬廣的倉儲空間，交通便利，適合電商或物流企業。',
    depositAmount: BigInt(1500 * 1e6),
    monthlyRent: BigInt(400 * 1e6),
    landlord: '0x8731d54E9D02c286767d56ac03e8037C07e01e98',
    leaseDuration: 365,
    ensName: 'taichung-warehouse.eth',
    image: '/images/property3.jpg'
  }
]

export const PropertyListing = () => {
  const { isContractReady } = useDework()
  const [filter, setFilter] = useState({
    searchTerm: '',
    propertyType: '',
    location: ''
  })

  const handleApply = (property: any) => {
    alert(`您已申請租賃 ${property.name}，這是示範功能。`)
  }

  const filteredProperties = mockProperties.filter(property => {
    return (
      property.name.toLowerCase().includes(filter.searchTerm.toLowerCase()) ||
      property.description.toLowerCase().includes(filter.searchTerm.toLowerCase())
    )
  })

  if (!isContractReady) {
    return <div>Contracts are not ready. Please check your configuration.</div>
  }

  return (
    <div className="space-y-8">
      {/* 搜索和篩選 */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4">搜索可租賃物件</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">關鍵字搜索</label>
            <input
              type="text"
              value={filter.searchTerm}
              onChange={e => setFilter({ ...filter, searchTerm: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
              placeholder="輸入關鍵字..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">物件類型</label>
            <select
              value={filter.propertyType}
              onChange={e => setFilter({ ...filter, propertyType: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">所有類型</option>
              <option value="office">辦公室</option>
              <option value="lab">實驗室</option>
              <option value="warehouse">倉庫</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">位置</label>
            <select
              value={filter.location}
              onChange={e => setFilter({ ...filter, location: e.target.value })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            >
              <option value="">所有地區</option>
              <option value="taipei">台北市</option>
              <option value="hsinchu">新竹市</option>
              <option value="taichung">台中市</option>
            </select>
          </div>
        </div>
      </div>

      {/* 物件列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProperties.map(property => (
          <div key={property.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="h-48 bg-gray-200 flex items-center justify-center">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-20 w-20 text-gray-400"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <div className="p-6">
              <h3 className="text-xl font-bold mb-2">{property.name}</h3>
              <p className="text-gray-600 mb-4">{property.description}</p>
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span className="text-gray-500">押金</span>
                  <span className="font-medium">{Number(property.depositAmount) / 1e6} USDC</span>
                </div>
                <div className="flex justify-between mb-1">
                  <span className="text-gray-500">月租金</span>
                  <span className="font-medium">{Number(property.monthlyRent) / 1e6} USDC</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">租期</span>
                  <span className="font-medium">{property.leaseDuration} 天</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-500">ENS: {property.ensName}</span>
                <button
                  onClick={() => handleApply(property)}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded"
                >
                  申請租賃
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredProperties.length === 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md text-center">
          <p className="text-gray-500">沒有找到符合條件的物件。</p>
        </div>
      )}
    </div>
  )
}