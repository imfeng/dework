import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.address) {
      return NextResponse.json(
        { error: '未授權' },
        { status: 401 }
      );
    }
    
    const userAddress = session.user.address;
    
    // 從數據庫獲取用戶 KYC 信息
    const userKyc = await prisma.userKyc.findUnique({
      where: { userAddress: userAddress.toLowerCase() },
    });
    
    if (!userKyc) {
      // 第一次登錄，沒有 KYC 記錄
      return NextResponse.json({
        isFirstLogin: true,
        username: null,
        passportVerified: false,
        passportData: null,
        kycCompleted: false,
      });
    }
    
    return NextResponse.json({
      isFirstLogin: false,
      username: userKyc.username,
      passportVerified: userKyc.passportVerified,
      passportData: userKyc.passportData,
      kycCompleted: userKyc.kycCompleted,
    });
  } catch (error) {
    console.error('獲取 KYC 狀態時出錯:', error);
    return NextResponse.json(
      { error: '服務器錯誤' },
      { status: 500 }
    );
  }
}
