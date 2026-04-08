import { FaissStore } from '@langchain/community/vectorstores/faiss';
import { GoogleGenerativeAIEmbeddings } from '@langchain/google-genai';
import { getSplitDocuments1972 } from '../data/ingestion/loader';
import path from 'path';

let vectorStore: FaissStore | null = null;
const VECTOR_STORE_PATH = path.join(process.cwd(), 'vectorstore', 'faiss_db');

export async function initOrLoadVectorStore() {
  if (vectorStore) return vectorStore;

  // embeddings 모델 초기화 (API 키는 .env에 GOOGLE_API_KEY 로 존재해야 함)
  const embeddings = new GoogleGenerativeAIEmbeddings({
    model: 'text-embedding-004', // 또는 권장 임베딩 모델
  });

  try {
    // 로컬에 인덱스가 있으면 로드 시도
    vectorStore = await FaissStore.load(VECTOR_STORE_PATH, embeddings);
    console.log('✅ Loaded existing FAISS vector store');
  } catch (err) {
    console.log('🚀 Index not found, creating a new FAISS vector store from 1972 docs...');
    const docs = await getSplitDocuments1972();
    vectorStore = await FaissStore.fromDocuments(docs, embeddings);
    await vectorStore.save(VECTOR_STORE_PATH);
    console.log('✅ Created & Saved RAG Vector Store to:', VECTOR_STORE_PATH);
  }

  return vectorStore;
}

export async function search1972Knowledge(query: string, k: number = 3) {
  const store = await initOrLoadVectorStore();
  const results = await store.similaritySearch(query, k);
  return results.map(r => r.pageContent).join('\\n\\n');
}
