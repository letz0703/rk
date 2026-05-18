import fs from 'fs';
import path from 'path';

interface KnowledgeBase {
  id: string;
  category: 'Admin' | 'Visual' | 'Audio' | 'Culture';
  content: string;
  metadata: {
    tags: string[];
    legalReference?: string; // 총무.md 내 형법 제355조 등
    templates: string[];    // 상황별 대응 문구 템플릿
  };
}

interface LegalLogicPattern {
  situation: string;
  legalBasis: string[];
  logicStructure: string;
  responseTemplate: string;
}

class MarkdownLoader {
  private projectRoot: string;
  private knowledgeBase: KnowledgeBase[] = [];

  constructor(projectRoot: string = process.cwd()) {
    this.projectRoot = projectRoot;
  }

  /**
   * 프로젝트 내 모든 마크다운 파일을 스캔하여 지식 베이스 구축
   */
  async loadAllKnowledge(): Promise<KnowledgeBase[]> {
    const mdFiles = this.findMarkdownFiles();

    for (const filePath of mdFiles) {
      const knowledge = await this.parseMarkdownFile(filePath);
      if (knowledge) {
        this.knowledgeBase.push(knowledge);
      }
    }

    return this.knowledgeBase;
  }

  /**
   * 특정 카테고리의 지식 베이스만 로드
   */
  async loadByCategory(category: KnowledgeBase['category']): Promise<KnowledgeBase[]> {
    const allKnowledge = await this.loadAllKnowledge();
    return allKnowledge.filter(kb => kb.category === category);
  }

  /**
   * 법적 논리 패턴 추출 (Admin 카테고리 전용)
   */
  async extractLegalLogicPatterns(): Promise<LegalLogicPattern[]> {
    const adminKnowledge = await this.loadByCategory('Admin');
    const patterns: LegalLogicPattern[] = [];

    for (const kb of adminKnowledge) {
      const extracted = this.parseLegalContent(kb.content);
      patterns.push(...extracted);
    }

    return patterns;
  }

  /**
   * 상황별 대응 문구 생성
   */
  generateResponseTemplate(situation: string, legalBasis: string[], logicStructure: string): string {
    const templates = {
      공금인계거부: `
공용 자금을 보관하고 있는 분은 법적으로 총무로 간주되며, 회계 및 사용 책임을 지게 됩니다.

**법적 근거**: ${legalBasis.join(', ')}

**핵심 논리**: ${logicStructure}

따라서 공금 인계 없이 총무 직책을 넘긴다는 것은 성립되지 않으며,
현재 공금을 보관하고 계시므로, 해당 책임은 아직 본인께 있습니다.
      `.trim(),

      책임회피: `
${legalBasis.length > 0 ? `**관련 법령**: ${legalBasis.join(', ')}` : ''}

**논리적 근거**: ${logicStructure}

이러한 구조에서는 총무를 맡는 게 불가능하며,
참여와 동의가 전제되지 않는 한 어떠한 책임도 질 수 없습니다.
      `.trim(),

      default: `
**상황 분석**: ${situation}

**적용 원칙**: ${logicStructure}

${legalBasis.length > 0 ? `**법적 근거**: ${legalBasis.join(', ')}` : ''}

따라서 이런 요구는 부당하며, 거절하셔도 됩니다.
      `.trim()
    };

    const situationType = this.classifySituation(situation);
    return templates[situationType] || templates.default;
  }

  private findMarkdownFiles(): string[] {
    const files: string[] = [];

    const scanDirectory = (dir: string, skipObsidianConfig: boolean = false) => {
      try {
        const entries = fs.readdirSync(dir);
        for (const entry of entries) {
          const fullPath = path.join(dir, entry);
          const stat = fs.statSync(fullPath);

          if (stat.isDirectory()) {
            // Obsidian 설정 폴더 제외
            if (skipObsidianConfig && (entry === '.obsidian' || entry === '.trash')) {
              continue;
            }
            // 기타 제외 폴더들
            if (!entry.startsWith('.') && entry !== 'node_modules') {
              scanDirectory(fullPath, skipObsidianConfig);
            }
          } else if (entry.endsWith('.md')) {
            files.push(fullPath);
          }
        }
      } catch (error) {
        // 디렉토리 접근 권한 없는 경우 무시
      }
    };

    // 우선 순위 1: obsidian vault (구조화된 지식 베이스)
    const obsidianPath = path.join(this.projectRoot, 'obsidian');
    if (fs.existsSync(obsidianPath)) {
      scanDirectory(obsidianPath, true);
    }

    // 우선 순위 2: 프로젝트 루트 (기존 분산된 파일들)
    scanDirectory(this.projectRoot);

    return files;
  }

  private async parseMarkdownFile(filePath: string): Promise<KnowledgeBase | null> {
    try {
      const content = fs.readFileSync(filePath, 'utf-8');
      const fileName = path.basename(filePath, '.md');
      const category = this.determineCategory(filePath, content);

      if (!category) return null;

      const metadata = this.extractMetadata(content, category);

      return {
        id: this.generateId(filePath),
        category,
        content,
        metadata
      };
    } catch (error) {
      console.error(`Error parsing ${filePath}:`, error);
      return null;
    }
  }

  private determineCategory(filePath: string, content: string): KnowledgeBase['category'] | null {
    const fileName = path.basename(filePath, '.md');

    // Admin 카테고리 - 빌라 관련은 제외 (Gemini 지침)
    if (['공금', '총무', '후원'].includes(fileName) ||
        (content.includes('법적') || content.includes('형법') || content.includes('횡령')) &&
        !content.includes('빌라') && !content.includes('아파트') && !content.includes('입주민')) {
      return 'Admin';
    }

    // Visual 카테고리
    if (fileName.includes('ep') || content.includes('Flow') ||
        content.includes('Grok') || content.includes('Soul-Sync') ||
        filePath.includes('xclass') || content.includes('rim light')) {
      return 'Visual';
    }

    // Audio 카테고리
    if (filePath.includes('music') || filePath.includes('suno') ||
        fileName.includes('1970') || fileName.includes('1990') ||
        content.includes('Suno') || content.includes('BPM')) {
      return 'Audio';
    }

    // Culture 카테고리 - 댄스, 나이트클럽, 의상 역사
    if (content.includes('댄스') || content.includes('의상') ||
        content.includes('나이트클럽') || content.includes('물랑') ||
        content.includes('Belle Époque') || content.includes('Serpentine') ||
        content.includes('Figure-8') || content.includes('Pivot Spin') ||
        filePath.includes('notebooklm') || content.includes('nightclub') ||
        content.includes('cabaret')) {
      return 'Culture';
    }

    return null;
  }

  private extractMetadata(content: string, category: KnowledgeBase['category']): KnowledgeBase['metadata'] {
    const metadata: KnowledgeBase['metadata'] = {
      tags: [],
      templates: []
    };

    if (category === 'Admin') {
      // 법적 근거 추출
      const legalMatches = content.match(/형법[^\n]*조|민법[^\n]*조|공동주택관리법[^\n]*/g);
      if (legalMatches) {
        metadata.legalReference = legalMatches.join(', ');
      }

      // 태그 추출
      const tags = [];
      if (content.includes('공금')) tags.push('공금관리');
      if (content.includes('총무')) tags.push('총무직');
      if (content.includes('횡령')) tags.push('횡령방지');
      if (content.includes('인계')) tags.push('업무인계');
      metadata.tags = tags;

      // 템플릿 추출 (따옴표로 둘러싸인 문구들)
      const templateMatches = content.match(/"[^"]{20,}"/g);
      if (templateMatches) {
        metadata.templates = templateMatches.map(t => t.slice(1, -1));
      }
    }

    if (category === 'Culture') {
      // 댄스 동작 용어 추출
      const danceTerms: string[] = [];
      const terms = ['Figure-8 Motion', 'Pivot Spin', 'Weight Rocking', 'Butterfly Pattern',
                    'Crouching Curtsy', 'Grand Battement', 'Shuffle Step', 'Serpentine'];

      terms.forEach(term => {
        if (content.includes(term)) danceTerms.push(term);
      });

      // 시대별 태그
      const tags = [];
      if (content.includes('1890') || content.includes('물랑')) tags.push('1890s-Belle-Époque');
      if (content.includes('1920') || content.includes('Charleston')) tags.push('1920s-Jazz-Age');
      if (content.includes('1950')) tags.push('1950s-Rock-Roll');
      if (content.includes('1970') || content.includes('Disco')) tags.push('1970s-Disco');
      if (content.includes('1980')) tags.push('1980s-Breakdance');
      if (content.includes('1990') || content.includes('Hip-hop')) tags.push('1990s-Hip-Hop');

      metadata.tags = [...tags, ...danceTerms];

      // Grok Aurora 프롬프트 템플릿 추출
      const sceneMatches = content.match(/\[Scene_\d+\][^\[]+/g);
      if (sceneMatches) {
        metadata.templates = sceneMatches.map(scene => scene.trim());
      }
    }

    if (category === 'Visual') {
      // Flow/Grok/Soul-Sync 태그
      const tags = [];
      if (content.includes('Flow')) tags.push('Flow-Soft');
      if (content.includes('Grok')) tags.push('Grok-Hard');
      if (content.includes('Soul-Sync')) tags.push('Soul-Sync-Special');
      metadata.tags = tags;

      // 프롬프트 템플릿 추출
      const promptMatches = content.match(/\[Flow\][^\[]+|\[Grok\][^\[]+|\[Soul-Sync\][^\[]+/g);
      if (promptMatches) {
        metadata.templates = promptMatches.map(p => p.trim());
      }
    }

    if (category === 'Audio') {
      // 시대별 음악 태그
      const tags = [];
      if (content.includes('1970') || content.includes('seventies')) tags.push('1970s-Music');
      if (content.includes('1990') || content.includes('nineties')) tags.push('1990s-Music');
      if (content.includes('Suno')) tags.push('Suno-Generation');
      if (content.includes('BPM')) tags.push('BPM-Specified');
      metadata.tags = tags;

      // Suno 프롬프트 추출
      const sunoMatches = content.match(/"[^"]*BPM[^"]*"/g);
      if (sunoMatches) {
        metadata.templates = sunoMatches.map(s => s.slice(1, -1));
      }
    }

    return metadata;
  }

  private parseLegalContent(content: string): LegalLogicPattern[] {
    const patterns: LegalLogicPattern[] = [];

    // 공금 보관자 = 실질 책임자 패턴
    if (content.includes('공금') && content.includes('보관')) {
      patterns.push({
        situation: '공금 인계 거부',
        legalBasis: ['공동주택관리법', '민법 제750조~제760조'],
        logicStructure: '공금 보관자 = 실질 책임자 = 회계 및 민원 책임 귀속',
        responseTemplate: this.generateResponseTemplate(
          '공금 인계 거부',
          ['공동주택관리법', '민법 제750조~제760조'],
          '공금 보관자 = 실질 책임자'
        )
      });
    }

    // 총무직 강요 방지 패턴
    if (content.includes('총무는') && content.includes('자발적')) {
      patterns.push({
        situation: '총무직 강요',
        legalBasis: ['민법 계약 자유의 원칙'],
        logicStructure: '총무는 자발적 수락 직책이며, 강요할 수 없음',
        responseTemplate: this.generateResponseTemplate(
          '총무직 강요',
          ['민법 계약 자유의 원칙'],
          '총무는 자발적 수락 직책'
        )
      });
    }

    return patterns;
  }

  private classifySituation(situation: string): '공금인계거부' | '책임회피' | 'default' {
    if (situation.includes('공금') && (situation.includes('인계') || situation.includes('넘기'))) {
      return '공금인계거부';
    }
    if (situation.includes('책임') || situation.includes('총무')) {
      return '책임회피';
    }
    return 'default';
  }

  private generateId(filePath: string): string {
    return path.relative(this.projectRoot, filePath).replace(/[/\\]/g, '_').replace('.md', '');
  }

  /**
   * 특정 상황에 대한 대응 문구 검색
   */
  async findResponseForSituation(situation: string): Promise<string | null> {
    const legalPatterns = await this.extractLegalLogicPatterns();

    for (const pattern of legalPatterns) {
      if (situation.toLowerCase().includes(pattern.situation.toLowerCase().split(' ')[0])) {
        return pattern.responseTemplate;
      }
    }

    return null;
  }
}

// 싱글톤 인스턴스
export const markdownLoader = new MarkdownLoader();

// 편의 함수들
export async function loadAdminKnowledge(): Promise<KnowledgeBase[]> {
  return markdownLoader.loadByCategory('Admin');
}

export async function generateLegalResponse(situation: string): Promise<string | null> {
  return markdownLoader.findResponseForSituation(situation);
}

export async function getAllKnowledge(): Promise<KnowledgeBase[]> {
  return markdownLoader.loadAllKnowledge();
}
