"use client"

import { useAuthContext } from "@/components/context/AuthContext"
import { getModel } from "@/app/models/data"
import ModelPageContent from "@/app/models/ModelPageContent"
import PasswordGate from "@/app/components/PasswordGate"
import { notFound } from "next/navigation"

const ADMIN_EMAIL = "rainskiss@gmail.com"

export default function ElizabethPage() {
  const { user } = useAuthContext()
  const isAdmin = user?.email === ADMIN_EMAIL
  const model = getModel("elizabeth")
  if (!model) notFound()
  return (
    <PasswordGate>
      <ModelPageContent model={model} isAdmin={isAdmin} />
    </PasswordGate>
  )
}
