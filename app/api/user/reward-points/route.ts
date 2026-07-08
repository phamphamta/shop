import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({ message: "Điểm cuối dữ liệu điểm thưởng" });
}