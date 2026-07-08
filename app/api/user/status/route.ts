import { NextRequest, NextResponse } from "next/server";
import { currentUser } from "@clerk/nextjs/server";
import { backendClient } from "@/sanity/lib/backendClient";
import { writeClient } from "@/sanity/lib/client";

export async function GET() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Người dùng chưa được xác thực" },
        { status: 401 }
      );
    }

    // Check if user exists in Sanity
    const userEmail = user.emailAddresses[0]?.emailAddress;
    const sanityUser = await backendClient.fetch(
      `*[_type == "userType" && email == $email][0]{
        _id,
        email,
        firstName,
        lastName,
        isActive,
        isBusiness,
        premiumStatus,
        businessStatus,
        membershipType,
        premiumAppliedAt,
        premiumApprovedBy,
        premiumApprovedAt,
        businessAppliedAt,
        businessApprovedBy,
        businessApprovedAt,
        rejectionReason
      }`,
      { email: userEmail }
    );

    return NextResponse.json({
      success: true,
      userExists: !!sanityUser,
      userProfile: sanityUser || null,
    });
  } catch (error) {
    console.error("Error checking user status:", error);
    return NextResponse.json(
      { error: "Không thể kiểm tra trạng thái người dùng" },
      { status: 500 }
    );
  }
}

export async function POST() {
  try {
    const user = await currentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Người dùng chưa được xác thực" },
        { status: 401 }
      );
    }

    const userEmail = user.emailAddresses[0]?.emailAddress;
    if (!userEmail) {
      return NextResponse.json(
        { error: "Không tìm thấy email của người dùng" },
        { status: 400 }
      );
    }

    // Check if user already exists in Sanity
    const existingSanityUser = await backendClient.fetch(
      `*[_type == "userType" && email == $email][0]`,
      { email: userEmail }
    );

    if (existingSanityUser) {
      // Check current premium status
      if (existingSanityUser.premiumStatus === "rejected") {
        return NextResponse.json(
          {
            success: false,
            error:
              "Yêu cầu đăng ký Premium của bạn đã bị từ chối. Vui lòng liên hệ quản trị viên để được hỗ trợ.",
          },
          { status: 400 }
        );
      }

      if (existingSanityUser.premiumStatus === "pending") {
        return NextResponse.json(
          {
            success: false,
            error: "Yêu cầu đăng ký Premium của bạn hiện đang chờ duyệt.",
          },
          { status: 400 }
        );
      }

      if (existingSanityUser.isActive) {
        return NextResponse.json(
          {
            success: false,
            error: "Người dùng này đã sở hữu tài khoản Premium.",
          },
          { status: 400 }
        );
      }

      // Update existing user to pending status
      const updatedUser = await writeClient
        .patch(existingSanityUser._id)
        .set({
          premiumStatus: "pending",
          premiumAppliedAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        })
        .commit();

      return NextResponse.json({
        success: true,
        message:
          "🎉 Gửi yêu cầu đăng ký Premium thành công! Hồ sơ của bạn đang được xét duyệt, chúng tôi sẽ thông báo kết quả cho bạn trong vòng 24-48 giờ tới.",
        userProfile: updatedUser,
      });
    }

    // Create new user with pending premium status
    const newUser = await writeClient.create({
      _type: "userType",
      email: userEmail,
      firstName: user.firstName,
      lastName: user.lastName,
      isActive: false, // Will be set to true when approved
      premiumStatus: "pending",
      isBusiness: false,
      businessStatus: "none",
      membershipType: "standard",
      premiumAppliedAt: new Date().toISOString(),
      rewardPoints: 0,
      loyaltyPoints: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      preferences: {
        newsletter: true,
        emailNotifications: true,
        smsNotifications: false,
        preferredCurrency: "USD",
        preferredLanguage: "en",
      },
    });

    // Track user registration event
    try {
      await fetch(
        `${process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000"
        }/api/analytics/track`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            eventName: "user_registration",
            eventParams: {
              userId: newUser._id,
              email: userEmail,
              membershipType: "standard",
              premiumStatus: "pending",
            },
          }),
        }
      );
    } catch (analyticsError) {
      console.error("Failed to track user registration event:", analyticsError);
    }

    return NextResponse.json({
      success: true,
      message:
        "🎉 Gửi yêu cầu đăng ký Premium thành công! Hồ sơ của bạn đang được xét duyệt, chúng tôi sẽ thông báo kết quả cho bạn trong vòng 24-48 giờ tới.",
      userProfile: newUser,
    });
  } catch (error) {
    console.error("Error creating user in Sanity:", error);
    return NextResponse.json(
      { error: "Không thể đăng ký dịch vụ premium" },
      { status: 500 }
    );
  }
}