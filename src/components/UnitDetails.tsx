import React, { useState } from 'react';
import { Unit, Sentence, UserProgress } from '../types';
import { AudioRecorder } from './AudioRecorder';
import { ArrowLeft, HelpCircle, Eye, EyeOff, CheckCircle, Award } from 'lucide-react';

interface UnitDetailsProps {
  unit: Unit;
  userProgress: UserProgress;
  onBack: () => void;
  onSentenceComplete: (sentenceId: string, score: number) => void;
  onEarnFood: () => void;
}

export const UnitDetails: React.FC<UnitDetailsProps> = ({
  unit,
  userProgress,
  onBack,
  onSentenceComplete,
  onEarnFood,
}) => {
  const [selectedSentence, setSelectedSentence] = useState<Sentence>(unit.sentences[0]);
  const [hideTranslations, setHideTranslations] = useState<Record<string, boolean>>({});

  const toggleTranslation = (id: string) => {
    setHideTranslations(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Helper check of speaker roleplay colors
  const getSpeakerColor = (name?: string) => {
    if (!name) return 'bg-slate-100 text-slate-700';
    const n = name.toLowerCase();
    if (n.includes('peng') || n.includes('liu')) return 'bg-blue-100 text-blue-800 border-blue-200';
    if (n.includes('peter') || n.includes('mike') || n.includes('matt')) return 'bg-indigo-100 text-indigo-800 border-indigo-200';
    if (n.includes('amy') || n.includes('sister') || n.includes('jia')) return 'bg-pink-100 text-pink-800 border-pink-200';
    return 'bg-amber-100 text-amber-800 border-amber-200';
  };

  // Sentences read in this unit
  const uniquePracticedInUnit = unit.sentences.filter(s => !!userProgress.scores[s.id]).length;

  return (
    <div id="unit_arena" className="space-y-6">
      
      {/* Header card with Unit thematic background colors */}
      <div className={`${unit.coverColor} rounded-3xl p-6 text-white shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-4 relative overflow-hidden`}>
        {/* Subtle decorative vector graphic */}
        <div className="absolute -right-8 -bottom-8 opacity-20 text-9xl">{unit.emoji}</div>
        
        <div className="space-y-2.5 z-10">
          <button 
            onClick={onBack}
            className="inline-flex items-center gap-1 bg-white/20 hover:bg-white/30 text-white rounded-full px-4 py-1.5 text-xs font-black transition-all cursor-pointer shadow-sm"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            返回课本目录
          </button>
          
          <div>
            <span className="bg-white/25 text-white/90 text-xs font-black tracking-widest px-2.5 py-1 rounded-lg uppercase">
              人教版 PEP 六年级英语
            </span>
            <h2 className="text-2xl font-black mt-2 tracking-tight flex items-center gap-2">
              <span>{unit.emoji}</span>
              <span>{unit.title}</span>
            </h2>
            <p className="text-white/80 text-sm font-semibold mt-1">
              {unit.subTitle} • 主题：{unit.topic}
            </p>
          </div>
        </div>

        {/* Action unit metrics */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 min-w-44 border border-white/20 text-center z-10">
          <div className="text-[10px] text-white/70 font-semibold uppercase tracking-wider">单元跟读进度</div>
          <div className="text-2xl font-black mt-1">
            {uniquePracticedInUnit} <span className="text-sm font-normal">/ {unit.sentences.length} 句</span>
          </div>
          <div className="text-xs text-yellow-200 font-bold mt-1.5 flex items-center justify-center gap-1">
            <Award className="w-3.5 h-3.5" />
            完成度 {Math.round((uniquePracticedInUnit / unit.sentences.length) * 100)}%
          </div>
        </div>
      </div>

      {/* Main split learning screens */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left component: Interactive Sentence Dialogue Cards List */}
        <div className="lg:col-span-7 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-black text-slate-800 tracking-wider uppercase">课文英文对话与句子</h3>
            <span className="text-xs text-slate-500 font-medium">点击句子可快速高亮进行听说训练</span>
          </div>

          <div className="space-y-3.5 max-h-[500px] overflow-y-auto pr-1">
            {unit.sentences.map((sent) => {
              const isSelected = selectedSentence.id === sent.id;
              const hasScore = userProgress.scores[sent.id] || null;
              const isTransHidden = !!hideTranslations[sent.id];

              return (
                <div
                  key={sent.id}
                  onClick={() => setSelectedSentence(sent)}
                  className={`border-3 p-4 rounded-2xl transition-all duration-200 cursor-pointer text-left relative overflow-hidden ${
                    isSelected 
                      ? 'border-blue-500 bg-blue-50/45 shadow' 
                      : 'border-slate-100 bg-white hover:border-slate-200 hover:shadow-xs'
                  }`}
                >
                  {/* Decorative tick badge */}
                  {hasScore && (
                    <div className="absolute top-0 right-0 bg-emerald-500 text-white pl-2.5 pr-2.5 pb-1 pt-1 rounded-bl-xl text-[10px] font-black flex items-center gap-0.5">
                      <CheckCircle className="w-3 h-3" />
                      最高 {hasScore} 星 ⭐
                    </div>
                  )}

                  {/* Character Avatar badge */}
                  {sent.charName && (
                    <div className="flex items-center gap-1.5 mb-2">
                      <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${getSpeakerColor(sent.charName)}`}>
                        🗣️ {sent.charName}
                      </span>
                    </div>
                  )}

                  {/* English Text display */}
                  <div className="text-base font-black text-slate-900 tracking-wide font-sans leading-relaxed">
                    {sent.english}
                  </div>

                  {/* Translation block with toggleable eye */}
                  <div className={`mt-2 flex items-center justify-between text-xs font-semibold ${isTransHidden ? 'text-slate-300' : 'text-slate-500'}`}>
                    <p className="flex-1 italic">
                      {isTransHidden ? "（中文释义已隐藏）" : sent.chinese}
                    </p>
                    
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTranslation(sent.id);
                      }}
                      className="p-1 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100 ml-2 transition-all cursor-pointer"
                      title={isTransHidden ? "显示翻译" : "隐藏翻译"}
                    >
                      {isTransHidden ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Bottom motivational pet notice */}
          <div className="bg-orange-50 border border-orange-200 rounded-2xl p-4 flex items-center gap-3">
            <span className="text-3xl">🐱</span>
            <div>
              <h4 className="text-xs font-black text-orange-850">小动物的食物奖励提示</h4>
              <p className="text-xs text-orange-700 font-semibold mt-0.5">
                只要你读过新句子（无论获得几颗星），猫咪都会立刻获得 1 块可口的食物饼干 🍪 喔！
              </p>
            </div>
          </div>
        </div>

        {/* Right component: Focus Speech Pronunciation Module */}
        <div id="practice_focus_arena" className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between px-1">
            <h3 className="text-sm font-black text-slate-800 tracking-wider uppercase">核心发音评估</h3>
          </div>

          <div className="bg-white border-3 border-slate-100 rounded-3xl p-5 shadow-sm space-y-5">
            <div className="text-center space-y-2">
              <span className="inline-block bg-blue-50 text-blue-700 text-[10px] font-black tracking-widest px-3 py-1 rounded-full uppercase">
                正在训练的句子
              </span>
              
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {selectedSentence.charName && (
                  <span className="text-slate-400 text-xs font-bold block mb-1">
                    角色发言: {selectedSentence.charName}
                  </span>
                )}
                
                <h4 className="text-lg font-black text-slate-900 leading-relaxed font-sans">
                  {selectedSentence.english}
                </h4>
                
                <p className="text-xs text-slate-500 font-semibold mt-1.5">
                  {selectedSentence.chinese}
                </p>
              </div>

              {/* Real components evaluation */}
              <AudioRecorder 
                key={selectedSentence.id}
                sentence={selectedSentence}
                onEvaluationComplete={(score) => onSentenceComplete(selectedSentence.id, score)}
                onRequestPetFood={onEarnFood}
              />
            </div>
          </div>

          {/* Quick instructions widget */}
          <div className="bg-blue-50/50 border border-blue-100 rounded-2xl p-4 space-y-2">
            <h4 className="text-xs font-black text-blue-900 flex items-center gap-1">
              <HelpCircle className="w-3.5 h-3.5" />
              跟读打分小帮手：
            </h4>
            <ul className="text-xs text-blue-800 font-medium space-y-1 list-disc list-inside">
              <li>点击【点读原音】按钮听标准人声读法。</li>
              <li>点击【开始跟读】后，大声把屏幕上的英语读出来吧！</li>
              <li>获得 3 颗星以上即代表你的英语说得很清晰啦！加油冲刺 5 星 🚀</li>
            </ul>
          </div>
        </div>

      </div>

    </div>
  );
};
