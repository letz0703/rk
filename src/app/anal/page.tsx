"use client";

import { useState, useMemo } from "react";

// ─── Types ───────────────────────────────────────────────────────────────────

type Lang = "ko" | "en" | "ja";
type SortKey = "rank" | "score" | "viewCount" | "subscriberCount";
type SortDir = "asc" | "desc";

interface VideoRow {
  rank: number;
  score: number;
  channelTitle: string;
  title: string;
  videoId: string;
  viewCount: number;
  subscriberCount: number;
}

// ─── Constants ───────────────────────────────────────────────────────────────

const MIN_VIEWS = 10_000;
const LANG_LABELS: Record<Lang, string> = { ko: "한국어", en: "English", ja: "日本語" };
const LANG_PLACEHOLDER: Record<Lang, string> = {
  ko: "예) 이정현, 먹방, 시니어",
  en: "e.g. lee jung hyun, mukbang, senior",
  ja: "例) イ・ジョンヒョン, 料理, シニア",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return n.toLocaleString("ko-KR");
}

async function ytFetch(endpoint: string, params: Record<string, string>) {
  const qs = new URLSearchParams({ endpoint, ...params });
  const res = await fetch(`/api/yt-search?${qs}`);
  const data = await res.json();
  if (data.error) throw new Error(typeof data.error === "string" ? data.error : data.error.message);
  return data;
}

async function translateKeyword(keyword: string, targetLang: Lang): Promise<string> {
  const res = await fetch("/api/yt-translate", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ titles: [keyword], targetLang }),
  });
  const data = await res.json();
  return data.translated?.[0] ?? keyword;
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function YtAnalyzerPage() {
  const [keyword, setKeyword] = useState("");
  const [searchedKeyword, setSearchedKeyword] = useState(""); // 실제로 사용된 검색어
  const [rows, setRows] = useState<VideoRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [translatingKeyword, setTranslatingKeyword] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("rank");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [lang, setLang] = useState<Lang>("ko");

  // ── Sort ─────────────────────────────────────────────────────────────────

  const sortedRows = useMemo(() => {
    return [...rows].sort((a, b) => {
      const mul = sortDir === "asc" ? 1 : -1;
      return (a[sortKey] - b[sortKey]) * mul;
    });
  }, [rows, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir(key === "rank" ? "asc" : "desc");
    }
  }

  function SortIcon({ col }: { col: SortKey }) {
    if (sortKey !== col) return <span className="text-gray-600 ml-1">↕</span>;
    return <span className="text-red-400 ml-1">{sortDir === "asc" ? "↑" : "↓"}</span>;
  }

  // ── Language switch: 입력창 키워드 즉시 번역 ─────────────────────────────

  async function switchLang(newLang: Lang) {
    setLang(newLang);
    if (!keyword.trim() || newLang === lang) return;
    setTranslatingKeyword(true);
    try {
      const translated = await translateKeyword(keyword.trim(), newLang);
      setKeyword(translated);
    } finally {
      setTranslatingKeyword(false);
    }
  }

  // ── Core analysis ────────────────────────────────────────────────────────

  async function runAnalysis() {
    if (!keyword.trim()) {
      setError("Please enter a search keyword.");
      return;
    }
    setError("");
    setRows([]);
    setLoading(true);

    try {
      // 1. YouTube 검색 (키워드는 이미 버튼 클릭 시 번역됨)
      const searchQuery = keyword.trim();
      setSearchedKeyword(searchQuery);
      setProgress(`Searching "${searchQuery}"…`);
      const searchData = await ytFetch("search", { q: searchQuery });

      const videoIds: string[] = (searchData.items ?? [])
        .map((item: { id: { videoId: string } }) => item.id.videoId)
        .filter(Boolean);

      if (videoIds.length === 0) {
        setError("No results found.");
        return;
      }

      const idStr = videoIds.join(",");

      // 3. videos → stats + titles
      setProgress(`Fetching video stats… (${videoIds.length} videos)`);

      interface VideoItem {
        id: string;
        snippet: { channelId: string; channelTitle: string; title: string };
        statistics: { viewCount?: string };
      }

      const videosData = await ytFetch("videos", { ids: idStr });
      const videoItems: VideoItem[] = videosData.items ?? [];

      const filtered = videoItems.filter(
        (v) => parseInt(v.statistics.viewCount ?? "0", 10) >= MIN_VIEWS
      );

      const channelIds = [...new Set(filtered.map((v) => v.snippet.channelId))];

      // 4. channels → subscriberCount
      setProgress(`Fetching channel info… (${channelIds.length} channels)`);
      const channelsData = await ytFetch("channels", { ids: channelIds.join(",") });

      const subMap: Record<string, number> = {};
      for (const ch of channelsData.items ?? []) {
        const sub = parseInt(ch.statistics.subscriberCount ?? "0", 10);
        subMap[ch.id] = sub > 0 ? sub : 1;
      }

      // 5. 바이럴 지수 계산 & 정렬
      const result: VideoRow[] = filtered
        .map((v) => {
          const views = parseInt(v.statistics.viewCount ?? "0", 10);
          const subs = subMap[v.snippet.channelId] ?? 1;
          return {
            rank: 0,
            score: views / subs,
            channelTitle: v.snippet.channelTitle,
            title: v.snippet.title,
            videoId: v.id,
            viewCount: views,
            subscriberCount: subs === 1 ? 0 : subs,
          };
        })
        .sort((a, b) => b.score - a.score)
        .map((row, i) => ({ ...row, rank: i + 1 }));

      setRows(result);
      setProgress("");
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "An unknown error occurred.";
      setError(msg);
      setProgress("");
    } finally {
      setLoading(false);
    }
  }

  // ── CSV Download ─────────────────────────────────────────────────────────

  function downloadCSV() {
    const header = "Rank,Viral Score,Channel,Title,Views,Subscribers,Link";
    const body = sortedRows
      .map((r) => {
        const title = r.title.replace(/,/g, "");
        const link = `https://youtu.be/${r.videoId}`;
        const subs = r.subscriberCount === 0 ? "hidden" : r.subscriberCount;
        return `${r.rank},${r.score.toFixed(2)},${r.channelTitle},${title},${r.viewCount},${subs},${link}`;
      })
      .join("\n");

    const BOM = "\uFEFF";
    const blob = new Blob([BOM + header + "\n" + body], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `viral-analysis_${searchedKeyword || keyword}_${lang}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-[#0f0f0f] text-white px-4 py-10">
      <div className="max-w-5xl mx-auto space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            📈 YouTube Viral Pattern Analyzer
          </h1>
          <p className="mt-1 text-sm text-gray-400">
            Find videos with abnormally high views relative to subscriber count.
          </p>
        </div>

        {/* Input Panel */}
        <div className="bg-[#1a1a1a] rounded-2xl p-6 space-y-4 border border-white/10">

          {/* 언어 선택 */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">
              Search Market
            </label>
            <div className="flex items-center gap-1 bg-[#262626] border border-white/10 rounded-lg p-1 w-fit">
              {(["ko", "en", "ja"] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => switchLang(l)}
                  disabled={translatingKeyword}
                  className={`px-4 py-1.5 rounded text-xs font-semibold transition ${
                    lang === l
                      ? "bg-red-600 text-white"
                      : "text-gray-400 hover:text-white disabled:opacity-40"
                  }`}
                >
                  {LANG_LABELS[l]}
                </button>
              ))}
              {translatingKeyword && (
                <span className="text-xs text-yellow-400 animate-pulse px-2">번역 중…</span>
              )}
            </div>
            <p className="text-xs text-gray-600 pt-0.5">
              키워드를 자동으로 해당 언어로 번역 후 검색합니다
            </p>
          </div>

          {/* 검색어 */}
          <div className="space-y-1">
            <label className="text-xs text-gray-400 font-medium uppercase tracking-wider">
              Search Keyword
            </label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              placeholder={LANG_PLACEHOLDER[lang]}
              onKeyDown={(e) => e.key === "Enter" && !loading && !translatingKeyword && runAnalysis()}
              disabled={translatingKeyword}
              className="w-full bg-[#262626] border border-white/10 rounded-lg px-3 py-2 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-red-500 transition disabled:opacity-60"
            />
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <button
              onClick={runAnalysis}
              disabled={loading}
              className="px-6 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-lg text-sm font-semibold transition"
            >
              {loading ? "Analyzing…" : "Run Analysis"}
            </button>

            {rows.length > 0 && (
              <button
                onClick={downloadCSV}
                className="px-6 py-2 bg-[#262626] hover:bg-[#333] border border-white/10 rounded-lg text-sm font-semibold transition"
              >
                ⬇ Export CSV
              </button>
            )}

            {progress && (
              <span className="text-sm text-yellow-400 animate-pulse">{progress}</span>
            )}
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-900/20 border border-red-800/40 rounded-lg px-3 py-2">
              ⚠ {error}
            </p>
          )}
        </div>

        {/* Results Table */}
        {rows.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-400">
                <span className="text-white font-semibold">{rows.length}</span> videos analyzed
              </p>
              {searchedKeyword && searchedKeyword !== keyword && (
                <p className="text-xs text-gray-500">
                  Searched as: <span className="text-gray-300">&ldquo;{searchedKeyword}&rdquo;</span>
                </p>
              )}
            </div>

            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-[#1a1a1a] text-gray-400 text-xs uppercase tracking-wider select-none">
                    <th
                      className="px-4 py-3 text-center w-12 cursor-pointer hover:text-white transition"
                      onClick={() => handleSort("rank")}
                    >
                      Rank<SortIcon col="rank" />
                    </th>
                    <th
                      className="px-4 py-3 text-right w-28 cursor-pointer hover:text-white transition"
                      onClick={() => handleSort("score")}
                    >
                      Viral Score<SortIcon col="score" />
                    </th>
                    <th className="px-4 py-3 text-left">Channel</th>
                    <th className="px-4 py-3 text-left">Title</th>
                    <th
                      className="px-4 py-3 text-right w-28 cursor-pointer hover:text-white transition"
                      onClick={() => handleSort("viewCount")}
                    >
                      Views<SortIcon col="viewCount" />
                    </th>
                    <th
                      className="px-4 py-3 text-right w-28 cursor-pointer hover:text-white transition"
                      onClick={() => handleSort("subscriberCount")}
                    >
                      Subscribers<SortIcon col="subscriberCount" />
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {sortedRows.map((row, i) => (
                    <tr
                      key={row.videoId}
                      className={`border-t border-white/5 hover:bg-white/5 transition ${
                        i < 3 ? "bg-yellow-900/10" : "bg-[#111]"
                      }`}
                    >
                      <td className="px-4 py-3 text-center font-bold text-gray-400">
                        {row.rank <= 3 ? (
                          <span className="text-yellow-400">{["🥇","🥈","🥉"][row.rank - 1]}</span>
                        ) : (
                          row.rank
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-mono font-bold text-red-400">
                        {row.score >= 1000
                          ? `${(row.score / 1000).toFixed(1)}K`
                          : row.score.toFixed(2)}
                      </td>
                      <td className="px-4 py-3 text-gray-300 max-w-[140px] truncate">
                        {row.channelTitle}
                      </td>
                      <td className="px-4 py-3 max-w-xs">
                        <a
                          href={`https://youtu.be/${row.videoId}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-400 hover:text-blue-300 hover:underline line-clamp-2 leading-snug"
                        >
                          {row.title}
                        </a>
                      </td>
                      <td className="px-4 py-3 text-right text-gray-300 font-mono">
                        {fmt(row.viewCount)}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-500 font-mono">
                        {row.subscriberCount === 0 ? (
                          <span className="text-gray-600 text-xs">hidden</span>
                        ) : (
                          fmt(row.subscriberCount)
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
