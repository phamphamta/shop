import { NextRequest, NextResponse } from "next/server";
import { auth, currentUser } from "@clerk/nextjs/server";
import { backendClient } from "@/sanity/lib/backendClient";

export async function GET() {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json(
        { error: "Người dùng chưa được xác thực" },
        { status: 401 }
      );
    }

    const userEmail = user.emailAddresses[0]?.emailAddress;
    if (!userEmail) {
      return NextResponse.json(
        { error: "Không tìm thấy email người dùng" },
        { status: 400 }
      );
    }

    // Fetch addresses for this user by email
    const addresses = await backendClient.fetch(
      `*[_type == "address" && email == $email] | order(default desc, createdAt desc) {
        _id,
        name,
        email,
        phone,
        address,
        city,
        state,
        zip,
        country,
        default,
        type,
        createdAt
      }`,
      { email: userEmail }
    );

    return NextResponse.json({
      success: true,
      addresses,
    });
  } catch (error) {
    console.error("Error fetching addresses:", error);
    return NextResponse.json(
      { error: "Lấy danh sách địa chỉ thất bại" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json(
        { error: "Người dùng chưa được xác thực" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const {
      name,
      address,
      city,
      state,
      zip,
      country,
      countryCode,
      stateCode,
      subArea,
      default: isDefault,
      type,
      phone,
    } = body;

    // Validate required fields
    if (!name || !address || !city || !state || !zip) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ các trường bắt buộc" },
        { status: 400 }
      );
    }

    // First, ensure the user exists in Sanity
    let sanityUser = await backendClient.fetch(
      `*[_type == "user" && clerkUserId == $clerkUserId][0]`,
      { clerkUserId: userId }
    );

    if (!sanityUser) {
      // Create user if doesn't exist
      sanityUser = await backendClient.create({
        _type: "user",
        clerkUserId: userId,
        email: user.emailAddresses[0]?.emailAddress,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: new Date().toISOString(),
      });
    }

    // If this is set as default, unset all other default addresses for this user
    if (isDefault) {
      const userEmail = user.emailAddresses[0]?.emailAddress;
      const existingAddresses = await backendClient.fetch(
        `*[_type == "address" && email == $email && default == true]`,
        { email: userEmail }
      );

      for (const existingAddress of existingAddresses) {
        await backendClient
          .patch(existingAddress._id)
          .set({ default: false })
          .commit();
      }
    }

    // Create new address
    const newAddress = await backendClient.create({
      _type: "address",
      name,
      email: user.emailAddresses[0]?.emailAddress,
      address,
      city,
      state,
      zip,
      country: country || "",
      countryCode: countryCode || "",
      stateCode: stateCode || "",
      subArea: subArea || "",
      default: isDefault || false,
      type: type || "home",
      phone: phone || null,
      user: {
        _type: "reference",
        _ref: sanityUser._id,
      },
      createdAt: new Date().toISOString(),
    });

    return NextResponse.json({
      success: true,
      addressId: newAddress._id,
      message: "Tạo địa chỉ thành công",
    });
  } catch (error) {
    console.error("Error creating address:", error);
    return NextResponse.json(
      { error: "Tạo địa chỉ thất bại" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return NextResponse.json(
        { error: "Người dùng chưa được xác thực" },
        { status: 401 }
      );
    }

    const body = await request.json();

    const {
      _id,
      name,
      address,
      city,
      state,
      zip,
      country,
      countryCode,
      stateCode,
      subArea,
      default: isDefault,
      type,
      phone,
    } = body;

    if (!_id) {
      return NextResponse.json(
        { error: "ID địa chỉ là bắt buộc để cập nhật" },
        { status: 400 }
      );
    }

    // Validate required fields
    if (!name || !address || !city || !state || !zip) {
      return NextResponse.json(
        { error: "Vui lòng nhập đầy đủ các trường bắt buộc" },
        { status: 400 }
      );
    }

    const userEmail = user.emailAddresses[0]?.emailAddress;
    if (!userEmail) {
      return NextResponse.json(
        { error: "Không tìm thấy email người dùng" },
        { status: 400 }
      );
    }

    // If this is set as default, unset all other default addresses for this user
    if (isDefault) {
      const existingAddresses = await backendClient.fetch(
        `*[_type == "address" && email == $email && _id != $currentId]`,
        { email: userEmail, currentId: _id }
      );

      for (const existingAddress of existingAddresses) {
        await backendClient
          .patch(existingAddress._id)
          .set({ default: false })
          .commit();
      }
    }

    // Update the address
    const updatedAddress = await backendClient
      .patch(_id)
      .set({
        name,
        address,
        city,
        state,
        zip,
        country: country || "",
        countryCode: countryCode || "",
        stateCode: stateCode || "",
        subArea: subArea || "",
        default: isDefault || false,
        type: type || "home",
        phone: phone || null,
        updatedAt: new Date().toISOString(),
      })
      .commit();

    return NextResponse.json({
      success: true,
      address: updatedAddress,
      message: "Cập nhật địa chỉ thành công",
    });
  } catch (error) {
    console.error("Error updating address:", error);
    return NextResponse.json(
      {
        error: "Cập nhật địa chỉ thất bại",
        details: error instanceof Error ? error.message : "Lỗi không xác định",
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { userId } = await auth();

    if (!userId) {
      return NextResponse.json(
        { error: "Người dùng chưa được xác thực" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const addressId = searchParams.get("id");

    if (!addressId) {
      return NextResponse.json(
        { error: "ID địa chỉ là bắt buộc" },
        { status: 400 }
      );
    }

    // Delete the address
    await backendClient.delete(addressId);

    return NextResponse.json({
      success: true,
      message: "Xóa địa chỉ thành công",
    });
  } catch (error) {
    console.error("Error deleting address:", error);
    return NextResponse.json(
      { error: "Xóa địa chỉ thất bại" },
      { status: 500 }
    );
  }
}