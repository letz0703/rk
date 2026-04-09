import {GoogleSpreadsheet} from "google-spreadsheet"
import {JWT} from "google-auth-library"
import {NextResponse} from "next/server" // 응답 표준화용

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const {email, modelId, details} = body

    // 1. 서비스 계정 인증 (수정 불필요)
    const serviceAccountAuth = new JWT({
      email: process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL,
      key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
      scopes: ["https://www.googleapis.com/auth/spreadsheets"]
    })

    const doc = new GoogleSpreadsheet(
      process.env.GOOGLE_SHEET_ID!,
      serviceAccountAuth
    )

    // 2. 정보 로드 및 행 추가
    await doc.loadInfo()
    const sheet = doc.sheetsByIndex[0]

    await sheet.addRow({
      id: Date.now().toString(),
      customer_email: email,
      model_id: modelId,
      request_details: details,
      status: "pending",
      created_at: new Date().toISOString()
    })

    return NextResponse.json({success: true})
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error"
    console.error("Sheet Error:", message)
    return NextResponse.json(
      {success: false, error: "시트 기록 실패: " + message},
      {status: 500}
    )
  }
}
