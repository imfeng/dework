import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import prisma from '@/lib/prisma';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.address) {
      return NextResponse.json(
        { error: '未授權' },
        { status: 401 }
      );
    }
    
    const userAddress = session.user.address.toLowerCase();
    const body = await request.json();
    
    // 獲取當前 KYC 數據或創建新的記錄
    let userKyc = await prisma.userKyc.findUnique({
      where: { userAddress },
    });
    
    if (userKyc) {
      // 更新現有記錄
      userKyc = await prisma.userKyc.update({
        where: { userAddress },
        data: {
          username: body.username ?? userKyc.username,
          passportVerified: body.passportVerified ?? userKyc.passportVerified,
          passportData: body.passportData ? JSON.stringify(body.passportData) : userKyc.passportData,
          kycCompleted: body.kycCompleted ?? userKyc.kycCompleted,
          updatedAt: new Date(),
        },
      });
    } else {
      // 創建新記錄
      userKyc = await prisma.userKyc.create({
        data: {
          userAddress,
          username: body.username,
          passportVerified: body.passportVerified ?? false,
          passportData: body.passportData ? JSON.stringify(body.passportData) : null,
          kycCompleted: body.kycCompleted ?? false,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
    }
    
    return NextResponse.json({
      success: true,
      data: {
        username: userKyc.username,
        passportVerified: userKyc.passportVerified,
        kycCompleted: userKyc.kycCompleted,
      },
    });
  } catch (error) {
    console.error('更新 KYC 狀態時出錯:', error);
    return NextResponse.json(
      { error: '服務器錯誤' },
      { status: 500 }
    );
  }
}
