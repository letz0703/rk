import { NextRequest, NextResponse } from "next/server";

const YT_BASE = "https://www.googleapis.com/youtube/v3";
const API_KEY = process.env.YOUTUBE_API_KEY;

export async function GET(req: NextRequest) {
  if (!API_KEY) {
    return NextResponse.json({ error: "YouTube API 키가 서버에 설정되지 않았습니다." }, { status: 500 });
  }

  const { searchParams } = req.nextUrl;
  const endpoint = searchParams.get("endpoint"); // search | videos | channels
  const query = searchParams.get("q") ?? "";
  const ids = searchParams.get("ids") ?? "";

  let url = "";

  const hl = searchParams.get("hl") ?? "ko";

  const regionCode = searchParams.get("regionCode") ?? "KR";
  const relevanceLanguage = searchParams.get("relevanceLanguage") ?? "ko";

  if (endpoint === "search") {
    url = `${YT_BASE}/search?part=id&type=video&q=${encodeURIComponent(query)}&maxResults=50&regionCode=${regionCode}&relevanceLanguage=${relevanceLanguage}&key=${API_KEY}`;
  } else if (endpoint === "videos") {
    url = `${YT_BASE}/videos?part=statistics,snippet,localizations&id=${ids}&hl=${hl}&key=${API_KEY}`;
  } else if (endpoint === "channels") {
    url = `${YT_BASE}/channels?part=statistics&id=${ids}&key=${API_KEY}`;
  } else {
    return NextResponse.json({ error: "잘못된 endpoint" }, { status: 400 });
  }

  const res = await fetch(url);
  const data = await res.json();
  return NextResponse.json(data);
}
