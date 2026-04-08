import { NextResponse } from 'next/server';
import { writeFile, mkdir, stat, rename } from 'fs/promises';
import { join } from 'path';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    const type = formData.get('type') as string; // 'guide', 'scene-0' 등
    const mode = formData.get('mode') as string; // 'present' or 'past'

    if (!file) {
      return NextResponse.json({ error: '파일이 없습니다.' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // 저장 경로 및 파일명 결정 규칙
    const uploadDir = join(process.cwd(), 'public', 'travelogue');
    
    // 폴더가 없으면 생성
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (e) {
      // 이미 있으면 무시
    }
    
    let filename = '';
    
    const suffix = mode === 'past' ? '_past' : '_present';

    if (type === 'guide') {
      filename = `guide_main${suffix}.png`;
    } else if (type.startsWith('scene-')) {
      const index = type.split('-')[1];
      const sceneNames = ['castle_wide', 'castle_inside', 'castle_disney', 'castle_final'];
      filename = `${sceneNames[parseInt(index)] || 'scene_' + index}${suffix}.jpg`;
    } else {
      filename = `${Date.now()}_${file.name}`;
    }

    const path = join(uploadDir, filename);

    // [추가] 자동 백업 로직: 기존 파일이 있으면 날짜를 붙여 이름을 바꿉니다.
    try {
      const stats = await stat(path);
      if (stats.isFile()) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, 19);
        const nameParts = filename.split('.');
        const ext = nameParts.pop();
        const baseName = nameParts.join('.');
        const backupPath = join(uploadDir, `${baseName}_${timestamp}.${ext}`);
        
        await rename(path, backupPath);
        console.log(`기존 파일 백업 완료: ${backupPath}`);
      }
    } catch (e) {
      // 파일이 없으면 그냥 통과
    }

    await writeFile(path, buffer);

    console.log(`파일 저장 성공: ${path}`);

    return NextResponse.json({ 
      success: true, 
      filename,
      url: `/travelogue/${filename}?v=${Date.now()}` // 캐시 방지용 버전 추가
    });

  } catch (error) {
    console.error('파일 저장 에러:', error);
    return NextResponse.json({ error: '서버 내부 에러가 발생했습니다.' }, { status: 500 });
  }
}
