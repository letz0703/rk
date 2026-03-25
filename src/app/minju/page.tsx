"use client"

import { useAuthContext } from "@/components/context/AuthContext"
import { getModel } from "@/app/models/data"
import ModelPageContent from "@/app/models/ModelPageContent"
import { notFound } from "next/navigation"

const ADMIN_EMAIL = "rainskiss@gmail.com"

export default function MinjuPage() {
  const { user } = useAuthContext()
  const isAdmin = user?.email === ADMIN_EMAIL
  const model = getModel("minju")
  if (!model) notFound()
  return <ModelPageContent model={model} isAdmin={isAdmin} />
}
