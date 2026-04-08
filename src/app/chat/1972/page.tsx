import { Metadata } from 'next';
import ChatInterface from '../../components/ChatInterface';

export const metadata: Metadata = {
  title: "1972 Persona Chat",
  description: "Experience 1972 Women's Affair DB & AI Character Service"
}

export default function Chat1972Page() {
  return (
    <div className="bg-gray-100 min-h-screen">
      <ChatInterface />
    </div>
  );
}
