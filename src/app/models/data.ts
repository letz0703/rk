import rawData from "./models-data.json"

export type GalleryItem = {
  id: string
  thumbnail: string
  deviantartUrl: string
  easelUrl: string
  memo: string
}

export type Model = {
  slug: string
  name: string
  nameKo: string
  nationality: string
  profileImage: string
  bio: string
  gallery: GalleryItem[]
  deviantArtUrl: string
  nsfwUrl?: string
  nsfwPreview?: string
}

export const models: Model[] = rawData as Model[]

export function getModel(slug: string): Model | undefined {
  return models.find((m) => m.slug === slug)
}
