'use client'

import { useState } from 'react'
import { useAccount, useContractRead, useContractWrite } from 'wagmi'

interface User {
  address: string
  role: number
  isActive: boolean
}

export function UserManagement() {
  const { address } = useAccount()
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [newRole, setNewRole] = useState('')

  const { data: users } = useContractRead({
    address: 'YOUR_CONTRACT_ADDRESS',
    abi: [
      {
        inputs: [],
        name: 'getAllUsers',
        outputs: [
          {
            components: [
              { name: 'address', type: 'address' },
              { name: 'role', type: 'uint8' },
              { name: 'isActive', type: 'bool' },
            ],
            name: 'users',
            type: 'tuple[]',
          },
        ],
        stateMutability: 'view',
        type: 'function',
      },
    ],
    functionName: 'getAllUsers',
  })

  const { write: updateUserRole } = useContractWrite({
    address: 'YOUR_CONTRACT_ADDRESS',
    abi: [
      {
        inputs: [
          { name: 'userAddress', type: 'address' },
          { name: 'newRole', type: 'uint8' },
        ],
        name: 'updateUserRole',
        outputs: [],
        stateMutability: 'nonpayable',
        type: 'function',
      },
    ],
    functionName: 'updateUserRole',
  })

  const roleMap = {
    0: '租客',
    1: '房東',
    2: '管理員',
  }

  const handleUpdateRole = async (userAddress: string, role: string) => {
    try {
      await updateUserRole({
        args: [userAddress, BigInt(role)],
      })
    } catch (error) {
      console.error('Role update failed:', error)
    }
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">用戶管理</h2>
      <div className="space-y-4">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  地址
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  角色
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  狀態
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  操作
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users?.map((user) => (
                <tr key={user.address}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.address.slice(0, 6)}...{user.address.slice(-4)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {roleMap[user.role as keyof typeof roleMap]}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        user.isActive
                          ? 'bg-green-100 text-green-800'
                          : 'bg-red-100 text-red-800'
                      }`}
                    >
                      {user.isActive ? '啟用' : '停用'}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <button
                      onClick={() => setSelectedUser(user)}
                      className="text-indigo-600 hover:text-indigo-900"
                    >
                      編輯
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {selectedUser && (
          <div className="mt-4 p-4 border rounded-lg">
            <h3 className="text-lg font-medium mb-2">編輯用戶</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  用戶地址
                </label>
                <p className="mt-1 text-sm text-gray-500">{selectedUser.address}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  新角色
                </label>
                <select
                  value={newRole}
                  onChange={(e) => setNewRole(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">選擇角色</option>
                  <option value="0">租客</option>
                  <option value="1">房東</option>
                  <option value="2">管理員</option>
                </select>
              </div>
              <button
                onClick={() => handleUpdateRole(selectedUser.address, newRole)}
                className="bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700"
                disabled={!newRole}
              >
                更新角色
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 