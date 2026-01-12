import React, { useState, useEffect } from 'react';
import { Copy, Plus, Search, Filter, Trash2, Zap, Check, ExternalLink, X, Table, Settings, Loader2, RefreshCw } from 'lucide-react';

// --- Components ---

const Header = ({ onAdd, onOpenSettings, totalPrompts, loading, onRefresh }) => (
  <header className="bg-slate-900/80 backdrop-blur-md border-b border-slate-700 sticky top-0 z-20">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
      <div className="flex items-center gap-2">
        <div className="bg-gradient-to-r from-cyan-500 to-blue-600 p-2 rounded-lg">
          <Zap className="text-white w-5 h-5" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Prompt Vault</h1>
          <p className="text-xs text-slate-400 flex items-center gap-1">
            {loading ? <Loader2 className="w-3 h-3 animate-spin" /> : `${totalPrompts} รายการ`}
            {!loading && <span className="text-slate-600">|</span>}
            {!loading && <span className="text-green-400">Online</span>}
          </p>
        </div>
      </div>
      <div className="flex gap-2 sm:gap-3">
        <button
          onClick={onRefresh}
          disabled={loading}
          className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
          title="รีเฟรชข้อมูล"
        >
          <RefreshCw className={`w-5 h-5 ${loading ? 'animate-spin' : ''}`} />
        </button>
        <button
          onClick={onOpenSettings}
          className="p-2 text-slate-400 hover:text-white transition-colors rounded-lg hover:bg-slate-800"
          title="ตั้งค่าการเชื่อมต่อ"
        >
          <Settings className="w-5 h-5" />
        </button>
        <button
          onClick={onAdd}
          disabled={loading}
          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:text-slate-400 text-white px-4 py-2 rounded-lg font-medium transition-all shadow-lg shadow-blue-600/20 active:scale-95"
        >
          <Plus className="w-4 h-4" /> <span className="hidden sm:inline">เพิ่ม Prompt</span>
        </button>
      </div>
    </div>
  </header>
);

const PromptCard = ({ prompt, onClick }) => {
  const getQualityColor = (tier) => {
    switch (tier) {
      case 'S': return 'border-amber-400/50 bg-amber-900/10 text-amber-400';
      case 'A': return 'border-purple-400/50 bg-purple-900/10 text-purple-400';
      default: return 'border-slate-600/50 bg-slate-800/50 text-slate-400';
    }
  };

  return (
    <div 
      onClick={() => onClick(prompt)}
      className="group relative bg-slate-800 rounded-xl border border-slate-700 hover:border-blue-500/50 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-1 overflow-hidden flex flex-col h-full"
    >
      <div className={`absolute top-3 right-3 px-2 py-0.5 rounded text-xs font-bold border ${getQualityColor(prompt.quality)}`}>
        {prompt.quality}-Tier
      </div>

      <div className="p-5 flex-1">
        <div className="flex items-center gap-2 mb-3">
          <span className="bg-slate-700 text-slate-300 text-[10px] px-2 py-1 rounded-full uppercase tracking-wider">
            {prompt.category}
          </span>
        </div>
        <h3 className="text-lg font-semibold text-white mb-2 line-clamp-1 group-hover:text-blue-400 transition-colors">
          {prompt.title}
        </h3>
        <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed mb-4">
          {prompt.content}
        </p>
      </div>

      <div className="p-4 bg-slate-900/50 border-t border-slate-700 flex justify-between items-center text-xs text-slate-500">
        <span>คลิกเพื่อดูรายละเอียด</span>
        <Zap className="w-3 h-3 text-slate-600 group-hover:text-blue-400 transition-colors" />
      </div>
    </div>
  );
};

const DetailModal = ({ prompt, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !prompt) return null;

  const copyToClipboard = () => {
    const textArea = document.createElement("textarea");
    textArea.value = prompt.content;
    textArea.style.position = "fixed";
    textArea.style.left = "-999999px";
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Unable to copy', err);
    }
    document.body.removeChild(textArea);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200" onClick={onClose}>
      <div className="bg-slate-900 w-full max-w-2xl rounded-2xl border border-slate-700 shadow-2xl overflow-hidden relative flex flex-col max-h-[90vh]" onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b border-slate-700 flex justify-between items-start bg-slate-800/50">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className={`px-2 py-0.5 rounded text-xs font-bold border ${prompt.quality === 'S' ? 'text-amber-400 border-amber-400/50' : 'text-slate-400 border-slate-600'}`}>
                {prompt.quality}-Tier
              </span>
              <span className="text-slate-400 text-sm">{prompt.category}</span>
            </div>
            <h2 className="text-2xl font-bold text-white leading-tight">{prompt.title}</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto custom-scrollbar">
          <div className="bg-slate-950 rounded-xl p-4 border border-slate-800 font-mono text-sm leading-relaxed text-slate-300 whitespace-pre-wrap">
            {prompt.content}
          </div>
        </div>
        <div className="p-6 border-t border-slate-700 bg-slate-800/50 flex justify-end">
          <button
            onClick={copyToClipboard}
            className={`flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg ${
              copied ? 'bg-green-600 text-white shadow-green-600/20' : 'bg-white text-slate-900 hover:bg-slate-200'
            }`}
          >
            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            {copied ? 'คัดลอกเรียบร้อย' : 'คัดลอก Prompt'}
          </button>
        </div>
      </div>
    </div>
  );
};

const AddModal = ({ isOpen, onClose, onSave, isSaving }) => {
  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onSave({
      title: formData.get('title'),
      content: formData.get('content'),
      category: formData.get('category'),
      quality: formData.get('quality'),
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-slate-800 w-full max-w-lg rounded-2xl border border-slate-700 shadow-2xl overflow-hidden">
        <div className="p-6 border-b border-slate-700 flex justify-between items-center">
          <h2 className="text-xl font-bold text-white">เพิ่ม Prompt ใหม่</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white"><X className="w-5 h-5"/></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">หัวข้อ</label>
            <input name="title" required className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none" placeholder="ตั้งชื่อ Prompt..." />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">หมวดหมู่</label>
              <select name="category" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none">
                <option value="General">ทั่วไป</option>
                <option value="Marketing">การตลาด</option>
                <option value="Coding">เขียนโปรแกรม</option>
                <option value="Creative">งานสร้างสรรค์</option>
                <option value="Academic">วิชาการ</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-400 mb-1">ระดับคุณภาพ</label>
              <select name="quality" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white outline-none">
                <option value="B">B - ทั่วไป</option>
                <option value="A">A - ดีมาก</option>
                <option value="S">S - สุดยอด</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-400 mb-1">เนื้อหา Prompt</label>
            <textarea name="content" required rows="5" className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2.5 text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none font-mono text-sm" placeholder="ใส่ Prompt ที่ต้องการเก็บไว้ที่นี่..."></textarea>
          </div>
          <div className="pt-2">
            <button 
              type="submit" 
              disabled={isSaving}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 text-white rounded-lg font-bold shadow-lg shadow-blue-600/20 transition-all active:scale-[0.98] flex justify-center items-center gap-2"
            >
              {isSaving && <Loader2 className="w-4 h-4 animate-spin" />}
              {isSaving ? 'กำลังบันทึกลง Sheet...' : 'บันทึกข้อมูล'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const SettingsModal = ({ isOpen, onClose, currentUrl, onSave }) => {
  if (!isOpen) return null;
  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(e.target.url.value);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-slate-800 w-full max-w-md rounded-2xl border border-slate-700 p-6 shadow-2xl">
        <h3 className="text-xl font-bold text-white mb-4">ตั้งค่าการเชื่อมต่อ</h3>
        <p className="text-slate-400 text-sm mb-4">
          กรุณานำ <strong>Web App URL</strong> จาก Google Apps Script มาวางที่นี่เพื่อเชื่อมต่อกับ Sheet ของคุณ
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            name="url" 
            defaultValue={currentUrl} 
            placeholder="https://script.google.com/macros/s/..." 
            className="w-full bg-slate-900 border border-slate-700 rounded-lg p-3 text-white focus:ring-2 focus:ring-blue-500 outline-none text-xs"
          />
          <div className="flex justify-end gap-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-300 hover:text-white">ยกเลิก</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">บันทึก</button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- Main App ---

const App = () => {
  const [prompts, setPrompts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [scriptUrl, setScriptUrl] = useState('');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [selectedPrompt, setSelectedPrompt] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterQuality, setFilterQuality] = useState('All');

  useEffect(() => {
    const storedUrl = localStorage.getItem('google_script_url');
    if (storedUrl) {
      setScriptUrl(storedUrl);
      fetchPrompts(storedUrl);
    } else {
      setIsSettingsOpen(true);
    }
  }, []);

  // ฟังก์ชันช่วยดึงค่าแบบไม่สนตัวพิมพ์เล็ก/ใหญ่ (Case-insensitive)
  const getValue = (obj, potentialKeys, defaultValue) => {
    const foundKey = Object.keys(obj).find(k => 
      potentialKeys.includes(k.toLowerCase())
    );
    return foundKey ? obj[foundKey] : defaultValue;
  };

  const fetchPrompts = async (url) => {
    if (!url) return;
    setLoading(true);
    try {
      // เพิ่ม ?t=... เพื่อป้องกันการ Cache ข้อมูล
      const response = await fetch(`${url}?t=${Date.now()}`);
      const data = await response.json();
      
      // การแปลงข้อมูลแบบยืดหยุ่น (รองรับชื่อ column หลากหลาย)
      const formatted = data.map(item => ({
        id: getValue(item, ['id'], Date.now()),
        title: getValue(item, ['title', 'header', 'topic', 'หัวข้อ', 'name'], 'Untitled'),
        content: getValue(item, ['content', 'description', 'body', 'เนื้อหา', 'prompt'], ''),
        category: getValue(item, ['category', 'cat', 'หมวดหมู่', 'group'], 'General'),
        quality: getValue(item, ['quality', 'tier', 'rank', 'ระดับ', 'grade'], 'B')
      })).reverse();
      
      setPrompts(formatted);
    } catch (error) {
      console.error("Error fetching prompts:", error);
      // ไม่แสดง alert ถี่เกินไป ให้ดูที่สถานะ Online/Loading แทน
    } finally {
      setLoading(false);
    }
  };

  const handleSaveSettings = (url) => {
    localStorage.setItem('google_script_url', url);
    setScriptUrl(url);
    setIsSettingsOpen(false);
    fetchPrompts(url);
  };

  const addPrompt = async (data) => {
    if (!scriptUrl) {
      alert("กรุณาตั้งค่า Web App URL ก่อน");
      setIsSettingsOpen(true);
      return;
    }

    setSaving(true);
    const newPrompt = { id: Date.now(), ...data };
    
    // UI Update ทันที (Optimistic)
    setPrompts([newPrompt, ...prompts]);
    setIsModalOpen(false);

    try {
      await fetch(scriptUrl, {
        method: 'POST',
        body: JSON.stringify(newPrompt),
        mode: 'no-cors' 
      });
      // รอสักครู่แล้วดึงข้อมูลใหม่
      setTimeout(() => fetchPrompts(scriptUrl), 1500);
      
    } catch (error) {
      console.error("Error saving:", error);
      alert("เกิดข้อผิดพลาดในการบันทึก");
    } finally {
      setSaving(false);
    }
  };

  const filteredPrompts = prompts.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.content.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesQuality = filterQuality === 'All' || p.quality === filterQuality;
    return matchesSearch && matchesQuality;
  });

  return (
    <div className="min-h-screen bg-slate-950 font-sans text-slate-200">
      <Header 
        onAdd={() => setIsModalOpen(true)} 
        onOpenSettings={() => setIsSettingsOpen(true)}
        totalPrompts={prompts.length}
        loading={loading}
        onRefresh={() => fetchPrompts(scriptUrl)}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Search & Filter */}
        <div className="flex flex-col sm:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-5 h-5" />
            <input 
              type="text" 
              placeholder="ค้นหา Prompt..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-4 text-white focus:ring-2 focus:ring-blue-500 outline-none transition-all shadow-sm"
            />
          </div>
          <div className="flex gap-2">
            <div className="relative">
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
              <select 
                value={filterQuality}
                onChange={(e) => setFilterQuality(e.target.value)}
                className="appearance-none bg-slate-900 border border-slate-700 rounded-xl py-3 pl-10 pr-10 text-white focus:ring-2 focus:ring-blue-500 outline-none cursor-pointer"
              >
                <option value="All">ทุกระดับ</option>
                <option value="S">S - ระดับเทพ</option>
                <option value="A">A - ดีมาก</option>
                <option value="B">B - ทั่วไป</option>
              </select>
            </div>
          </div>
        </div>

        {/* Grid */}
        {!scriptUrl ? (
           <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
            <h3 className="text-xl font-bold text-white mb-2">ยังไม่ได้เชื่อมต่อ Database</h3>
            <p className="text-slate-400 mb-4">กรุณากดปุ่มตั้งค่าเพื่อใส่ URL ของ Google Apps Script</p>
            <button onClick={() => setIsSettingsOpen(true)} className="px-4 py-2 bg-blue-600 rounded-lg text-white">ตั้งค่าตอนนี้</button>
           </div>
        ) : filteredPrompts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPrompts.map(prompt => (
              <PromptCard 
                key={prompt.id} 
                prompt={prompt} 
                onClick={setSelectedPrompt}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-slate-900/50 rounded-2xl border border-slate-800 border-dashed">
            {loading ? (
              <div className="flex flex-col items-center">
                <Loader2 className="w-8 h-8 animate-spin text-blue-500 mb-2"/>
                <p className="text-slate-400">กำลังโหลดข้อมูล...</p>
              </div>
            ) : (
              <>
                <Search className="w-8 h-8 text-slate-500 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-white mb-2">ไม่พบ Prompt</h3>
                <p className="text-slate-500 text-sm mt-2">
                  (ตรวจสอบ Google Sheet ว่ามีแถวหัวข้อ <strong>Title, Content...</strong> ในบรรทัดแรกหรือไม่)
                </p>
              </>
            )}
          </div>
        )}
      </main>

      <AddModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={addPrompt}
        isSaving={saving} 
      />

      <DetailModal 
        prompt={selectedPrompt} 
        isOpen={!!selectedPrompt} 
        onClose={() => setSelectedPrompt(null)} 
      />

      <SettingsModal 
        isOpen={isSettingsOpen} 
        onClose={() => setIsSettingsOpen(false)} 
        currentUrl={scriptUrl} 
        onSave={handleSaveSettings} 
      />
    </div>
  );
};

export default App;
