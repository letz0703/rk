"use client"

import { useAuthContext } from "@/components/context/AuthContext"
import { getModel } from "@/app/models/data"
import ModelPageContent from "@/app/models/ModelPageContent"
import AgeGate from "@/components/AgeGate"
import { notFound } from "next/navigation"
import { use } from "react"

const ADMIN_EMAIL = "rainskiss@gmail.com"

export default function ModelPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params)
  const { user } = useAuthContext()
  const isAdmin = user?.email === ADMIN_EMAIL
  const model = getModel(slug)
  if (!model) notFound()
  return (
    <AgeGate>
      <ModelPageContent model={model} isAdmin={isAdmin} />
    </AgeGate>
  )
}
