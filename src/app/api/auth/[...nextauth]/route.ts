import { handlers } from "@/auth-config"
import type { NextRequest } from "next/server"

export const dynamic = "force-dynamic"

export async function GET(req: NextRequest) {
  return handlers.GET(req)
}

export async function POST(req: NextRequest) {
  return handlers.POST(req)
}
