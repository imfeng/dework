import { useSession } from 'next-auth/react';

interface KycStatus {
  isFirstLogin: boolean
  username?: string | null
  passportVerified: boolean
  passportData?: any
  kycCompleted: boolean
}

interface UpdateKycStatusParams {
  username?: string
  passportVerified?: boolean
  passportData?: any
  kycCompleted?: boolean
}

export const getUserKycStatus = async (): Promise<KycStatus> => {
  try {
    const response = await fetch('/api/kyc/status', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '獲取 KYC 狀態失敗');
    }

    return await response.json();
  } catch (error) {
    console.error('獲取 KYC 狀態時出錯:', error);
    // 返回默認狀態
    return {
      isFirstLogin: true,
      username: null,
      passportVerified: false,
      kycCompleted: false,
    };
  }
};

export const updateKycStatus = async (params: UpdateKycStatusParams): Promise<void> => {
  try {
    const response = await fetch('/api/kyc/update', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(params),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '更新 KYC 狀態失敗');
    }
  } catch (error) {
    console.error('更新 KYC 狀態時出錯:', error);
    throw error;
  }
};

// 用戶端 hook 包裝
export const useKycService = () => {
  return {
    getUserKycStatus,
    updateKycStatus,
  };
};
