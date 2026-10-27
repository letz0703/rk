// obsidian/04_Products/{slug}.md → Firebase Realtime DB `shop-products/{slug}`
//
// /shop 은 obsidian md 를 읽지 않는다. 목록은 fbSubscribeProducts, 상세는 fbGetProduct —
// 둘 다 Firebase 가 진실값이다(src/api/shopFirebase.ts 참조). md 는 /oz 작업실 전용이므로
// md 만 만들면 /shop 에는 "상품을 찾을 수 없습니다" 가 뜬다. 이 스크립트가 그 간극을 메운다.
//
// 사용:
//   node scripts/shop-publish.mjs <slug>              등록 (이미 있으면 중단)
//   node scripts/shop-publish.mjs <slug> --dry        쓰지 않고 파싱 결과만 출력
//   node scripts/shop-publish.mjs <slug> --force      기존 상품 덮어쓰기(createdAt 보존)
//   node scripts/shop-publish.mjs <slug> --status off 등록하되 비전시로

import {cert, initializeApp} from "firebase-admin/app"
import {getDatabase} from "firebase-admin/database"
import fs from "fs"
import path from "path"

const ROOT = process.cwd()
const args = process.argv.slice(2)
const slug = args.find(a => !a.startsWith("--"))
const dry = args.includes("--dry")
const force = args.includes("--force")
const statusArg = args.includes("--status") ? args[args.indexOf("--status") + 1] : "on"

if (!slug) {
  console.error("사용법: node scripts/shop-publish.mjs <slug> [--dry] [--force] [--status on|off]")
  process.exit(1)
}
if (statusArg !== "on" && statusArg !== "off") {
  console.error("--status 는 on 또는 off")
  process.exit(1)
}

const mdPath = path.join(ROOT, "obsidian/04_Products", `${slug}.md`)
if (!fs.existsSync(mdPath)) {
  console.error(`md 없음: ${mdPath}`)
  process.exit(1)
}
const md = fs.readFileSync(mdPath, "utf8")

const fmMatch = md.match(/^---\n([\s\S]*?)\n---/)
if (!fmMatch) {
  console.error("frontmatter 없음")
  process.exit(1)
}
const meta = Object.fromEntries(
  fmMatch[1]
    .split("\n")
    .filter(l => l.includes(":"))
    .map(l => {
      const i = l.indexOf(":")
      return [l.slice(0, i).trim(), l.slice(i + 1).trim()]
    })
)

const section = name => {
  const m = md.match(new RegExp(`## ${name}\\n([\\s\\S]*?)(?=\\n## |$)`))
  return m ? m[1].trim() : ""
}
const pick = (block, label) => {
  const m = block.match(new RegExp(`### ${label}\\n([\\s\\S]*?)(?=\\n### |$)`))
  return m ? m[1].trim() : ""
}

const promptsBlock = section("Prompts")
const modelBlock = section("Model Prompt")

const product = {
  slug,
  title: meta.title,
  category: meta.category,
  price: Number(meta.price),
  premiumPrice: Number(meta.premiumPrice),
  status: statusArg,
  previewImage: meta.image,
  gallery: [meta.image],
  description: section("Description"),
  prompts: {
    soft: pick(promptsBlock, "Soft \\(Flow\\)"),
    hard: pick(promptsBlock, "Hard \\(Grok\\)"),
    softModel: pick(modelBlock, "Soft \\(Flow\\)"),
    hardModel: pick(modelBlock, "Hard \\(Grok\\)")
  }
}

// 검증 — 빈 채로 올리면 /shop 에서 빈 카드가 된다
const problems = []
if (!product.title) problems.push("title")
if (!product.category) problems.push("category")
if (!Number.isFinite(product.price)) problems.push("price")
if (!Number.isFinite(product.premiumPrice)) problems.push("premiumPrice")
if (!product.description) problems.push("description")
if (!product.previewImage || product.previewImage === "PLACEHOLDER") {
  problems.push("image (PLACEHOLDER — 이미지를 public/shop/ 에 넣고 frontmatter image 를 채울 것)")
}
for (const [k, v] of Object.entries(product.prompts)) if (!v) problems.push(`prompts.${k}`)

if (problems.length) {
  console.error("빈 필드:", problems.join(", "))
  process.exit(1)
}

// 로컬 public 경로면 파일 존재까지 확인 — 없으면 매대에 깨진 이미지가 걸린다
if (product.previewImage.startsWith("/shop/")) {
  const imgPath = path.join(ROOT, "public", product.previewImage)
  if (!fs.existsSync(imgPath)) {
    console.error(`이미지 파일 없음: ${imgPath}`)
    process.exit(1)
  }
}

console.log(`slug: ${slug}`)
console.log(`title: ${product.title}`)
console.log(`category: ${product.category} / price: ${product.price} / premium: ${product.premiumPrice}`)
console.log(`status: ${product.status}`)
console.log(`previewImage: ${product.previewImage}`)
console.log(`description: ${product.description.length}자`)
console.log(
  "prompts: " +
    Object.entries(product.prompts)
      .map(([k, v]) => `${k}=${v.length}`)
      .join(" ")
)

if (dry) {
  console.log("\n--dry — 쓰지 않고 종료")
  process.exit(0)
}

const env = fs.readFileSync(path.join(ROOT, ".env"), "utf8")
const saMatch = env.match(/FIREBASE_SERVICE_ACCOUNT='([\s\S]*?)'\n/)
const urlMatch = env.match(/NEXT_PUBLIC_FIREBASE_DATABASE_URL=(.*)/)
if (!saMatch || !urlMatch) {
  console.error(".env 에 FIREBASE_SERVICE_ACCOUNT 또는 NEXT_PUBLIC_FIREBASE_DATABASE_URL 없음")
  process.exit(1)
}

initializeApp({credential: cert(JSON.parse(saMatch[1])), databaseURL: urlMatch[1].trim()})
const db = getDatabase()
const node = db.ref(`shop-products/${slug}`)

const existing = await node.get()
if (existing.exists() && !force) {
  console.error(`\n이미 등록됨. 덮어쓰려면 --force`)
  process.exit(1)
}

const now = Date.now()
const createdAt = existing.exists() ? existing.val().createdAt || now : now
await node.set({...product, createdAt, updatedAt: now})

const back = (await node.get()).val()
console.log(`\n${existing.exists() ? "덮어쓰기" : "등록"} 완료 — /shop/${slug}`)
console.log(`읽기 확인: title=${back.title} status=${back.status} prompts=${Object.keys(back.prompts).length}개`)
process.exit(0)
