import React, { useState, useRef, useEffect } from 'react';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  RotateCcw, 
  Compass, 
  HelpCircle,
  Copy,
  Check,
  AlertCircle
} from 'lucide-react';
import { EXPERT_PANEL } from '../data/projectData';
import { ChatMessage } from '../types';

interface LiveExpertConsultantProps {
  initialExpertId?: string;
}

export const LiveExpertConsultant: React.FC<LiveExpertConsultantProps> = ({ initialExpertId = 'general' }) => {
  const [selectedExpertId, setSelectedExpertId] = useState<string>(initialExpertId);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome-msg',
      sender: 'expert',
      expertId: 'general',
      expertName: 'المجلس الاستشاري الموحد',
      text: `أهلاً بك يا أستاذ وليد. نحن جاهزون لمناقشة مشروعك (مولّد تصاريح النقل السياحي https://waleedalsenbesy.pythonanywhere.com/).
يمكنك توجيه أي سؤال إلينا كفريق متكامل، أو اختيار خبير متخصص بعينه (العمليات السياحية، المعمارية السحابية، الأمن والخصوصية، أو تطوير الـ SaaS). كيف تحب أن نبدأ؟`,
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    }
  ]);

  const quickQuestions = [
    {
      expertId: 'systems_architect',
      question: 'كيف أحل مشكلة استهلاك الـ CPU وبطء توليد الـ PDF على PythonAnywhere؟'
    },
    {
      expertId: 'security',
      question: 'هل يسبب لي معالجة أرقام الجوازات بدون تسجيل دخول مسؤولية قانونية في مصر؟'
    },
    {
      expertId: 'product_saas',
      question: 'كيف أحول هذا المشروع لـ SaaS باشتراك شهري وأبيعه لشركات السياحة؟'
    },
    {
      expertId: 'tourism_ops',
      question: 'كيف أضيف ختم الشركة والباركود التلقائي لمرور الأكمنة والتفتيش في ثوانٍ؟'
    }
  ];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend?: string) => {
    const text = textToSend || inputMessage;
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      expertId: selectedExpertId,
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
    };

    setMessages(prev => [...prev, userMsg]);
    setInputMessage('');
    setIsLoading(true);

    try {
      const currentExpert = EXPERT_PANEL.find(e => e.id === selectedExpertId);
      const expertName = currentExpert?.name || 'المجلس الاستشاري';

      const response = await fetch('/api/expert/consult', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          expertId: selectedExpertId,
          message: text.trim(),
          history: messages.slice(-5)
        })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'فشل الاتصال بالخبير');
      }

      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: 'expert',
        expertId: selectedExpertId,
        expertName: expertName,
        text: data.reply || 'تم استلام استشارتك.',
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, botMsg]);
    } catch (err: any) {
      console.error('Chat error:', err);
      const errorMsg: ChatMessage = {
        id: `bot-err-${Date.now()}`,
        sender: 'expert',
        expertId: selectedExpertId,
        expertName: 'المجلس الاستشاري',
        text: `عذراً، حدث خطأ أثناء جلب رد الخبير. تأكد من اتصال الإنترنت ثم حاول مرة أخرى. (${err.message})`,
        timestamp: new Date().toLocaleTimeString('ar-EG', { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 flex flex-col h-[750px] shadow-2xl overflow-hidden animate-fadeIn">
      {/* Consultant Header */}
      <div className="p-4 md:p-6 bg-slate-950/80 border-b border-slate-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
            <Sparkles className="w-4 h-4" />
            <span>جلسة استشارية حية ومباشرة مدعومة بالذكاء الاصطناعي</span>
          </div>
          <h2 className="text-xl font-black text-white mt-0.5">
            استشر الخبير المتخصص في مشروعك
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            كل خبير يتحدث بناءً على خلفيته المهنية وكود موقع waleedalsenbesy.pythonanywhere.com
          </p>
        </div>

        {/* Expert Selector */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <label className="text-xs text-slate-400 font-semibold whitespace-nowrap">الخبير المستشار:</label>
          <select
            value={selectedExpertId}
            onChange={(e) => setSelectedExpertId(e.target.value)}
            className="w-full sm:w-auto bg-slate-900 border border-slate-700 text-slate-200 text-xs font-bold rounded-xl px-3 py-2 focus:ring-2 focus:ring-amber-500/50 outline-none"
          >
            <option value="general">🏛️ رئيس المجلس الاستشاري (تقييم شامل)</option>
            <option value="tourism_ops">👨‍✈️ د. أشرف الشريف (العمليات السياحية والأمنية)</option>
            <option value="systems_architect">💻 م. كريم النجار (المعمارية السحابية وبايثون)</option>
            <option value="security">🛡️ د. مريم رضوان (الأمن وحماية الجوازات)</option>
            <option value="product_saas">📈 أ. طارق عبد الرحمن (استراتيجية الـ SaaS)</option>
          </select>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-4 bg-slate-950/40">
        {messages.map((msg) => {
          const isUser = msg.sender === 'user';
          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}
            >
              {/* Avatar */}
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 text-sm font-bold shadow-md ${
                isUser 
                  ? 'bg-amber-500 text-slate-950 font-black' 
                  : 'bg-slate-800 text-amber-300 border border-slate-700'
              }`}>
                {isUser ? 'أنت' : <Bot className="w-5 h-5" />}
              </div>

              {/* Message Bubble */}
              <div className={`max-w-2xl rounded-2xl p-4 text-xs md:text-sm ${
                isUser
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 font-semibold shadow-lg shadow-amber-500/10'
                  : 'bg-slate-900 border border-slate-800 text-slate-200 shadow-md'
              }`}>
                {!isUser && (
                  <div className="flex items-center justify-between gap-3 mb-1.5 pb-1.5 border-b border-slate-800 text-[11px] text-amber-400 font-bold">
                    <span>{msg.expertName || 'الخبير'}</span>
                    <button
                      onClick={() => copyToClipboard(msg.text, msg.id)}
                      className="text-slate-400 hover:text-slate-200 p-1 transition-colors"
                      title="نسخ الإجابة"
                    >
                      {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                )}

                <div className="whitespace-pre-line leading-relaxed">
                  {msg.text}
                </div>

                <div className={`mt-2 text-[10px] text-left ${isUser ? 'text-slate-800' : 'text-slate-500'}`}>
                  {msg.timestamp}
                </div>
              </div>
            </div>
          );
        })}

        {isLoading && (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-slate-800 text-amber-400 flex items-center justify-center shrink-0 border border-slate-700 animate-pulse">
              <Bot className="w-5 h-5" />
            </div>
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping"></span>
              <span>الخبير يقوم بتحليل كود المشروع وصياغة الرد الاستشاري...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Quick Questions Bar */}
      <div className="px-4 py-2.5 bg-slate-950/90 border-t border-slate-800/80 overflow-x-auto no-scrollbar flex items-center gap-2">
        <span className="text-[11px] text-slate-400 font-bold shrink-0 flex items-center gap-1">
          <HelpCircle className="w-3.5 h-3.5 text-amber-400" />
          <span>أسئلة شائعة:</span>
        </span>
        {quickQuestions.map((q, idx) => (
          <button
            key={idx}
            onClick={() => {
              setSelectedExpertId(q.expertId);
              handleSendMessage(q.question);
            }}
            className="px-3 py-1 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700/80 text-[11px] text-slate-300 hover:text-white whitespace-nowrap transition-colors shrink-0"
          >
            {q.question}
          </button>
        ))}
      </div>

      {/* Message Input Box */}
      <div className="p-4 bg-slate-950 border-t border-slate-800">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSendMessage();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            placeholder="اكتب استشارتك أو سؤالك للخبير هنا (مثلاً: كيف أطور كود توليد الـ PDF؟)..."
            className="flex-1 bg-slate-900 border border-slate-700 text-slate-100 placeholder-slate-500 rounded-xl px-4 py-3 text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/50"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !inputMessage.trim()}
            className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 disabled:opacity-50 text-slate-950 font-bold text-xs md:text-sm flex items-center gap-1.5 shadow-md transition-all active:scale-95 shrink-0"
          >
            <Send className="w-4 h-4 rotate-180" />
            <span className="hidden sm:inline">إرسال</span>
          </button>
        </form>
      </div>
    </div>
  );
};
