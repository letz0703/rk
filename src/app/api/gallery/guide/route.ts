import { NextResponse } from 'next/server';
import { readdir } from 'fs/promises';
import { join } from 'path';

export async function GET() {
  try {
    const uploadDir = join(process.cwd(), 'public', 'travelogue');
    
    // 폴더 내 모든 파일 읽기
    const files = await readdir(uploadDir);
    
    // 'guide_main'으로 시작하는 파일만 필터링 (최신본 + 백업본)
    const guideImages = files
      .filter(file => file.startsWith('guide_main'))
      .map(file => {
        let era = 'Unknown';
        if (file.includes('_present')) era = 'Present';
        else if (file.includes('_past')) era = 'Historical';
        
        return {
          filename: file,
          url: `/travelogue/${file}`,
          era,
          timestamp: file.includes('_') ? file.split('_').filter(p => !['present', 'past', 'main'].includes(p)).join('_').split('.')[0] : 'Current'
        };
      })
      // 최신 파일이 먼저 오도록 정렬 (알파벳 역순이 날짜 역순이 됨)
      .sort((a, b) => b.filename.localeCompare(a.filename));

    return NextResponse.json({ success: true, images: guideImages });
  } catch (error) {
    console.error('갤러리 목록 읽기 에러:', error);
    return NextResponse.json({ images: [] }); // 폴더가 없거나 파일이 없으면 빈 배열 반환
  }
}
