export function searchSets(sets, keyword) {
  if (!keyword) return sets

  const lowerKeyword = keyword.toLowerCase().trim()

  return sets.filter((set) => {
    const combined = [
      set.title,
      set.description,
      ...(set.tags || [])
    ]
      .join(" ")
      .toLowerCase()

    return combined.includes(lowerKeyword)
  })
}
