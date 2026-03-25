import { getModel } from "@/app/models/data"
import ModelPageContent from "@/app/models/ModelPageContent"
import { notFound } from "next/navigation"

export default function MinjuPage() {
  const model = getModel("minju")
  if (!model) notFound()
  return <ModelPageContent model={model} />
}
