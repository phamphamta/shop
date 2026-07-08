import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { sanityFetch } from "@/sanity/lib/live";
import { USER_BY_CLERK_ID_QUERY } from "@/sanity/queries/userQueries";
import ProfileClient from "@/components/profile/ProfileClient";

interface SanityUser {
  _id: string;
  clerkUserId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  dateOfBirth?: string;
  profileImage?: {
    asset: {
      _id: string;
      url: string;
    };
  };
  addresses?: Array<{
    _id: string;
    name: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    default: boolean;
    type: "home" | "office" | "other";
    createdAt: string;
    phone?: string;
  }>;
  preferences?: Record<string, unknown>;
  loyaltyPoints?: number;
  rewardPoints?: number;
  totalSpent?: number;
  lastLogin?: string;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export default async function ProfilePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const clerkUser = await currentUser();

  if (!clerkUser) {
    redirect("/sign-in");
  }

  // Lấy dữ liệu người dùng từ Sanity
  let sanityUser: SanityUser | null = null;
  try {
    const { data } = await sanityFetch({
      query: USER_BY_CLERK_ID_QUERY,
      params: { clerkUserId: userId },
    });
    sanityUser = data;
  } catch (error) {
    console.error("Lỗi khi lấy dữ liệu người dùng từ Sanity:", error);
  }

  // Kết hợp dữ liệu từ Clerk và Sanity - tuần tự hóa (serialize) các object của Clerk thành dữ liệu thuần túy (plain data)
  const userData = {
    clerk: {
      id: clerkUser.id,
      firstName: clerkUser.firstName,
      lastName: clerkUser.lastName,
      emailAddresses: clerkUser.emailAddresses.map((email) => ({
        id: email.id,
        emailAddress: email.emailAddress,
        verification: email.verification
          ? {
            status: email.verification.status,
            strategy: email.verification.strategy,
          }
          : null,
      })),
      imageUrl: clerkUser.imageUrl,
      createdAt: new Date(clerkUser.createdAt),
      updatedAt: new Date(clerkUser.updatedAt),
    },
    sanity: sanityUser,
  };

  return <ProfileClient userData={userData} />;
}