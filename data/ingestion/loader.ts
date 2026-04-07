import { RecursiveCharacterTextSplitter } from '@langchain/textsplitters';
import fs from 'fs';
import path from 'path';

// 임시 1972 데이터소스
const SAMPLE_1972_DATA = `
1972년은 한국 사회에 있어 격동의 시기였다. 특히 여성의 사회 진출이 본격적으로 논의되기 시작하면서도 가부장제의 벽은 쉽게 무너지지 않았다. 
당시 '사슴아가씨' 등의 인기 라디오 및 TV 프로그램은 여성 청취자들에게 큰 사랑을 받았으며, 커피 요금 인상과 금밀수 등 경제적 불안정 속에서도 시민들은 삶의 애환을 달랬다.
치맛바람으로 불리는 학구열은 당시 어머니들의 강력한 자녀 교육 의지를 보여주었으며, 여성 정책은 아직 태동기에 불과하여 법여성학의 본격적인 발아는 수년 뒤에나 이루어질 예정이었다.
`;

export async function getSplitDocuments1972() {
  const textSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  });

  // 향후 fs.readFileSync를 활용한 외부 md 연동 지점
  // const filePath = path.join(process.cwd(), 'data/ingestion/source.txt');
  // const text = fs.readFileSync(filePath, 'utf-8');

  const docs = await textSplitter.createDocuments([SAMPLE_1972_DATA], [{ source: '1972-archive' }]);
  return docs;
}
