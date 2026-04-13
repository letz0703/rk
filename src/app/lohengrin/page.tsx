"use client";

import React, { useState, useRef } from 'react';

const PlayIcon = ({ className = "w-5 h-5" }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>;
const BookOpenIcon = ({ className = "w-5 h-5" }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"></path><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"></path></svg>;
const HelpCircleIcon = ({ className = "w-5 h-5" }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>;
const VideoIcon = ({ className = "w-5 h-5" }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="23 7 16 12 23 17 23 7"></polygon><rect x="1" y="5" width="15" height="14" rx="2" ry="2"></rect></svg>;
const CheckCircleIcon = ({ className = "w-5 h-5" }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>;
const ArrowRightIcon = ({ className = "w-5 h-5" }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line><polyline points="12 5 19 12 12 19"></polyline></svg>;
const ChevronRightIcon = ({ className = "w-5 h-5" }) => <svg className={className} xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>;

const scriptSections = [
  {
    id: 'intro',
    title: 'Introduction: The World\'s Most Famous Irony',
    visual: 'A luxurious modern wedding hall. The bride prepares to walk down the aisle. (BGM) The grand and familiar \'Bridal Chorus\' (Dun-dun-da-dun~) begins to play.',
    narrator: '"Is there anyone in the world who doesn\'t know this song? It\'s the ultimate soundtrack for the happiest moment in life. But what if I told you that this \'blessing\' is actually a prelude to a blood-soaked tragedy? Today, we go back to the source of this music to uncover a chilling secret."',
    icon: <PlayIcon className="w-5 h-5" />
  },
  {
    id: 'dev1',
    title: 'Development 1: 1858 – The Great Media Spin',
    visual: 'Black and white historical footage or illustrations of a royal wedding in 1858.',
    narrator: '"The year was 1858. Princess Victoria, the 17-year-old eldest daughter of Queen Victoria, chose this melody for her wedding to Prince Frederick of Prussia. While history often calls her an \'art lover,\' the reality was likely simpler: she was a teenager captivated by a catchy, grand melody. The media of the time did the rest, spinning her choice into a mark of \'artistic sophistication.\' As the public blindly followed this royal trend, the \'Bridal Chorus\' became the global standard for weddings—completely ignoring the dark story behind it."',
    icon: <BookOpenIcon className="w-5 h-5" />
  },
  {
    id: 'dev2',
    title: 'Development 2: The Forbidden Question',
    visual: 'Scenes from the Duchy of Brabant. Elsa in crisis and the mysterious arrival of the Knight on a boat drawn by a swan.',
    narrator: '"The song comes from Richard Wagner\'s opera, Lohengrin. The story follows Elsa, a princess falsely accused of murder, who is saved by a mysterious knight. He offers her his hand in marriage but sets one lethal condition: \'Never ask my name or where I came from.\' Elsa agrees, but seeds of doubt are planted by her enemies. She begins to wonder: Who is this man? A savior... or a monster?"',
    icon: <HelpCircleIcon className="w-5 h-5" />
  },
  {
    id: 'climax',
    title: 'Climax: The Beginning of the End',
    visual: 'The wedding scene in the opera. The \'Bridal Chorus\' plays as the couple enters the bridal chamber.',
    narrator: '"In Act 3, the famous \'Wedding March\' finally plays as the couple is led to their bridal chamber. It is the peak of their happiness. But the moment the music stops, the tragedy begins. Unable to bear the doubt, Elsa breaks her vow and asks the forbidden question: \'What is your name?\' In that instant, the magic shatters. The knight reveals he is Lohengrin, a Knight of the Holy Grail, but because his identity is exposed, he is bound by divine law to leave forever."',
    icon: <VideoIcon className="w-5 h-5" />
  },
  {
    id: 'insight',
    title: 'Philosophical Insight: Perfection vs. Process',
    visual: 'A symbolic contrast between the divine Knight and the struggling Elsa.',
    narrator: '"Why did Elsa ask? Lohengrin gave her a \'perfect result\'—salvation and victory—much like a modern AI. But Elsa was human. She needed the \'clumsy process\' of time: talking, doubting, and building trust through shared experience. To deny a human the right to ask is to deny them their humanity. The tragedy of Lohengrin is the collision between divine perfection and the messy, essential process of human connection."',
    icon: <BookOpenIcon className="w-5 h-5" />
  },
  {
    id: 'outro',
    title: 'Outro: The King Who Lived the Dream',
    visual: 'Dramatic drone shot of Neuschwanstein Castle at sunset.',
    narrator: '"This story of tragic beauty completely consumed one man: King Ludwig II of Bavaria. Unable to face his own political failures, he retreated into this opera\'s fantasy, eventually building a real-life \'Grail Castle\' on a mountain peak. This sanctuary would later inspire the iconic Disney castle. But who was this man, and why did he seek refuge in a tragedy? In our next episode, we explore the secret life of the \'Fairy Tale King\' and the real mysteries of Neuschwanstein."',
    icon: <VideoIcon className="w-5 h-5" />
  }
];

export default function LohengrinPage() {
  const [activeSection, setActiveSection] = useState(scriptSections[0].id);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleAssessment = (targetId: string) => {
    setActiveSection(targetId);
    setQuizCompleted(true);
    setTimeout(() => {
      contentRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
  };

  const activeData = scriptSections.find(s => s.id === activeSection) || scriptSections[0];

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-200 font-sans">
      <header className="border-b border-neutral-800 bg-neutral-950/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-amber-600 flex items-center justify-center font-serif text-white font-bold tracking-tighter">
              Rx
            </div>
            <span className="font-semibold text-sm tracking-widest uppercase text-neutral-400">Rainskiss-x Tier Preview</span>
          </div>
          <nav className="text-xs font-medium text-neutral-500 uppercase tracking-wider space-x-6">
            <a href="#" className="hover:text-amber-500 transition-colors">Overview</a>
            <a href="#" className="hover:text-amber-500 transition-colors">Script</a>
            <a href="#" className="hover:text-amber-500 transition-colors">Visuals</a>
          </nav>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-12">
        <div className="mb-16 text-center space-y-4">
          <h2 className="text-amber-500 font-medium tracking-widest uppercase text-sm">Upcoming Video Project</h2>
          <h1 className="text-4xl md:text-6xl font-serif text-white leading-tight">
            Wedding March <br />
            <span className="text-neutral-500 text-3xl md:text-5xl">The Prelude to Tragedy</span>
          </h1>
          <p className="max-w-2xl mx-auto text-neutral-400 mt-6 text-lg">
            이 문서는 최종 영상 제작 전, VIP 고객님들의 이해를 돕기 위해 제공되는 인터랙티브 스크립트 리뷰 페이지입니다.
          </p>
        </div>

        {!quizCompleted ? (
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl p-8 md:p-12 mb-16 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-2 h-full bg-amber-600"></div>
            <h3 className="text-2xl font-serif text-white mb-2">어떤 시각에서 이 이야기를 보고 싶으신가요?</h3>
            <p className="text-neutral-400 mb-8">당신의 관심사에 맞는 핵심 인사이트 구간으로 바로 안내해 드립니다.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button onClick={() => handleAssessment('dev1')} className="group text-left p-6 rounded-xl border border-neutral-700 bg-neutral-950 hover:border-amber-500 hover:bg-neutral-800 transition-all duration-300">
                <div className="text-amber-500 mb-4 group-hover:scale-110 transition-transform"><BookOpenIcon /></div>
                <h4 className="text-lg font-medium text-white mb-2">역사와 대중 매체의 조작</h4>
                <p className="text-sm text-neutral-500">1858년 영국 왕실의 결혼식이 어떻게 전 세계를 속였는지 궁금하다면.</p>
              </button>
              <button onClick={() => handleAssessment('insight')} className="group text-left p-6 rounded-xl border border-neutral-700 bg-neutral-950 hover:border-amber-500 hover:bg-neutral-800 transition-all duration-300">
                <div className="text-amber-500 mb-4 group-hover:scale-110 transition-transform"><HelpCircleIcon /></div>
                <h4 className="text-lg font-medium text-white mb-2">철학과 AI 시대의 은유</h4>
                <p className="text-sm text-neutral-500">'완벽한 결과'와 '불완전한 인간의 과정'에 대한 심도 깊은 통찰을 원한다면.</p>
              </button>
              <button onClick={() => handleAssessment('climax')} className="group text-left p-6 rounded-xl border border-neutral-700 bg-neutral-950 hover:border-amber-500 hover:bg-neutral-800 transition-all duration-300">
                <div className="text-amber-500 mb-4 group-hover:scale-110 transition-transform"><VideoIcon /></div>
                <h4 className="text-lg font-medium text-white mb-2">극적인 비극의 클라이맥스</h4>
                <p className="text-sm text-neutral-500">오페라 로엔그린 속에서 가장 긴장감 넘치는 파멸의 순간을 보고 싶다면.</p>
              </button>
            </div>
          </div>
        ) : (
          <div className="flex justify-center mb-16">
            <button onClick={() => setQuizCompleted(false)} className="text-sm text-neutral-500 hover:text-amber-500 flex items-center gap-2 transition-colors">
              <CheckCircleIcon className="w-4 h-4" />
              맞춤형 추천이 완료되었습니다. (다시 선택하기)
            </button>
          </div>
        )}

        <div ref={contentRef} className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-4 sticky top-24 space-y-2">
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-widest mb-6 ml-4">Script Sequence</h3>
            {scriptSections.map((section, idx) => (
              <button key={section.id} onClick={() => setActiveSection(section.id)} className={`w-full flex items-center gap-4 px-4 py-3 rounded-lg text-left transition-all duration-300 ${activeSection === section.id ? 'bg-amber-900/20 text-amber-500 border border-amber-900/50 shadow-inner' : 'text-neutral-400 hover:bg-neutral-900 hover:text-neutral-200 border border-transparent'}`}>
                <span className={`w-6 h-6 flex items-center justify-center rounded-full text-xs ${activeSection === section.id ? 'bg-amber-600 text-white' : 'bg-neutral-800'}`}>{idx + 1}</span>
                <span className="font-medium text-sm truncate">{section.title.split(':')[0]}</span>
                {activeSection === section.id && <ChevronRightIcon className="w-4 h-4 ml-auto" />}
              </button>
            ))}
          </div>

          <div className="lg:col-span-8">
            <div className="bg-neutral-900 border border-neutral-800 rounded-2xl overflow-hidden shadow-2xl">
              <div className="bg-neutral-950 px-8 py-6 border-b border-neutral-800 flex items-center justify-between">
                <h2 className="text-xl font-serif text-white">{activeData.title}</h2>
                <div className="text-amber-600 bg-amber-600/10 p-2 rounded-full">{activeData.icon}</div>
              </div>
              <div className="p-8 space-y-10">
                <div className="relative pl-6">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-600 rounded-full"></div>
                  <h4 className="text-xs font-bold text-blue-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <VideoIcon className="w-4 h-4" /> Suggested Visuals
                  </h4>
                  <p className="text-neutral-300 font-light italic leading-relaxed text-lg">{activeData.visual}</p>
                </div>
                <div className="relative pl-6">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-600 rounded-full"></div>
                  <h4 className="text-xs font-bold text-amber-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                    <PlayIcon className="w-4 h-4" /> Narrator (English)
                  </h4>
                  <div className="bg-neutral-950/50 p-6 rounded-xl border border-neutral-800">
                    <p className="text-white text-xl font-serif leading-relaxed">{activeData.narrator}</p>
                  </div>
                </div>
              </div>
              {scriptSections.findIndex(s => s.id === activeSection) < scriptSections.length - 1 && (
                <div className="bg-neutral-950 px-8 py-4 border-t border-neutral-800 flex justify-end">
                  <button
                    onClick={() => {
                      const nextIdx = scriptSections.findIndex(s => s.id === activeSection) + 1;
                      setActiveSection(scriptSections[nextIdx].id);
                    }}
                    className="flex items-center gap-2 text-sm font-medium text-amber-500 hover:text-amber-400 transition-colors"
                  >
                    다음 씬 확인하기 <ArrowRightIcon className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
