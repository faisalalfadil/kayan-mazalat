import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'

export async function PUT(request: NextRequest) {
  try {
    const { adminId, currentPassword, newPassword, newName, newEmail } = await request.json()

    if (!adminId) {
      return NextResponse.json(
        { success: false, error: 'معرف المسؤول مطلوب' },
        { status: 400 }
      )
    }

    const admin = await db.admin.findUnique({
      where: { id: adminId },
    })

    if (!admin) {
      return NextResponse.json(
        { success: false, error: 'المسؤول غير موجود' },
        { status: 404 }
      )
    }

    // If changing password
    if (newPassword) {
      if (!currentPassword) {
        return NextResponse.json(
          { success: false, error: 'كلمة المرور الحالية مطلوبة' },
          { status: 400 }
        )
      }
      if (admin.password !== currentPassword) {
        return NextResponse.json(
          { success: false, error: 'كلمة المرور الحالية غير صحيحة' },
          { status: 401 }
        )
      }
      if (newPassword.length < 6) {
        return NextResponse.json(
          { success: false, error: 'كلمة المرور الجديدة يجب أن تكون 6 أحرف على الأقل' },
          { status: 400 }
        )
      }
    }

    // If changing email, check uniqueness
    if (newEmail && newEmail !== admin.email) {
      const existing = await db.admin.findUnique({
        where: { email: newEmail },
      })
      if (existing) {
        return NextResponse.json(
          { success: false, error: 'البريد الإلكتروني مستخدم بالفعل' },
          { status: 400 }
        )
      }
    }

    // Build update data
    const updateData: Record<string, string> = {}
    if (newPassword) updateData.password = newPassword
    if (newName) updateData.name = newName
    if (newEmail) updateData.email = newEmail

    const updatedAdmin = await db.admin.update({
      where: { id: adminId },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      admin: {
        id: updatedAdmin.id,
        name: updatedAdmin.name,
        email: updatedAdmin.email,
        role: updatedAdmin.role,
      },
    })
  } catch (error) {
    console.error('Account update error:', error)
    return NextResponse.json(
      { success: false, error: 'حدث خطأ في تحديث الحساب' },
      { status: 500 }
    )
  }
}
