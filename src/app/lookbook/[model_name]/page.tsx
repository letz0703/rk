import { Metadata } from "next"
import { notFound } from "next/navigation"
import modelsData from "@/app/models/models-data.json"
import LookbookClient from "./LookbookClient"

type Props = { params: Promise<{ model_name: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { model_name } = await params
  const model = modelsData.find(m => m.slug === model_name)
  if (!model) return { title: "Not Found — rainskiss" }
  return {
    title: `${model.name} Lookbook — rainskiss`,
    description: model.bio,
    openGraph: {
      title: `${model.name} Photo Lookbook`,
      description: model.bio,
      images: model.profileImage ? [model.profileImage] : [],
    },
  }
}

export default async function LookbookPage({ params }: Props) {
  const { model_name } = await params
  const model = modelsData.find(m => m.slug === model_name)
  if (!model) notFound()
  return <LookbookClient model={model} />
}
