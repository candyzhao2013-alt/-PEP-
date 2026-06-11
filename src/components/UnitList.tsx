import React from 'react';
import { Unit, UserProgress } from '../types';
import { Sparkles, Trophy, BookOpen, Star, CirclePlay } from 'lucide-react';

interface UnitListProps {
  units: Unit[];
  userProgress: UserProgress;
  onSelectUnit: (unit: Unit) => void;
}

export const UnitList: React.FC<UnitListProps> = ({
  units,
  userProgress,
  onSelectUnit,
}) => {
  // Helper calculations for user scores
  const getUnitProgress = (unit: Unit) => {
    let completedSentencesCount = 0;
    let earnedStarsSum = 0;

    unit.sentences.forEach(s => {
      const score = userProgress.scores[s.id];
      if (score) {
        completedSentencesCount++;
        earnedStarsSum += score;
      }
    });

    return {
      completedSentencesCount,
      earnedStarsSum,
      totalLength: unit.sentences.length
    };
  };

  return (
    <div id="unit_catalog" className="space-y-6">
      
      {/* Dynamic Title and header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 pb-4 gap-3">
        <div>
          <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-blue-600" />
            人教版 PEP 六年级英语 A/B 上册课文闯关
          </h2>
          <p className="text-xs text-slate-500 font-semibold mt-1">
            选择任意单元，开始你的英语点读与跟读大冒险吧！
          </p>
        </div>
        
        {/* Total stats */}
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200/50 rounded-2xl px-4 py-2.5 flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span className="text-xs font-black text-indigo-900">
            全书总累计星级: {' '}
            <span className="text-sm font-black text-blue-600">
              {Object.keys(userProgress.scores).reduce((acc, key) => acc + (userProgress.scores[key] || 0), 0)} ⭐
            </span>
          </span>
        </div>
      </div>

      {/* Grid Menu of game chapters */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {units.map((unit, index) => {
          const { completedSentencesCount, earnedStarsSum, totalLength } = getUnitProgress(unit);
          const percentCompleted = Math.round((completedSentencesCount / totalLength) * 100);

          return (
            <div
              key={unit.id}
              onClick={() => onSelectUnit(unit)}
              className="bg-white rounded-3xl border-3 border-slate-150 overflow-hidden hover:border-blue-400 hover:shadow-md transition-all duration-300 flex flex-col justify-between cursor-pointer group active:scale-98"
            >
              {/* Unit colored cover header card */}
              <div className={`${unit.coverColor} p-5 text-white relative`}>
                {/* Floating bubbles styling */}
                <div className="absolute top-2 right-2 opacity-10 text-6xl select-none font-bold">
                  {unit.emoji}
                </div>
                
                <div className="space-y-1">
                  <div className="bg-white/20 inline-block px-2 py-0.5 rounded-md text-[10px] font-black uppercase tracking-widest">
                    第 {index + 1} 关 • CHAPTER
                  </div>
                  <h3 className="text-lg font-black leading-tight tracking-tight flex items-center gap-1.5 pt-1">
                    <span>{unit.emoji}</span>
                    <span>{unit.title}</span>
                  </h3>
                  <p className="text-xs text-white/80 font-bold">
                    {unit.subTitle}
                  </p>
                </div>
              </div>

              {/* Course Progress statistics info */}
              <div className="p-5 space-y-4 flex-1 flex flex-col justify-between bg-slate-50/50">
                <div className="space-y-3">
                  {/* Topic focus */}
                  <div className="text-xs font-semibold text-slate-500">
                    <span className="font-bold text-slate-800">核心话题:</span>{" "}
                    "{unit.topic}"
                  </div>

                  {/* Level Progress stars */}
                  <div className="flex items-center justify-between text-xs font-bold text-slate-500">
                    <span>已朗读句子</span>
                    <span className="text-slate-800 font-extrabold">
                      {completedSentencesCount} / {totalLength} 句
                    </span>
                  </div>

                  {/* Progress bar line */}
                  <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        percentCompleted === 100 ? 'bg-emerald-500' : 'bg-blue-500'
                      }`}
                      style={{ width: `${percentCompleted}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 pt-3.5 mt-2.5">
                  <div className="flex items-center gap-1 text-slate-500">
                    <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
                    <span className="text-xs font-bold">
                      得分: <span className="font-black text-slate-800">{earnedStarsSum}</span> 星
                    </span>
                  </div>

                  <span className="text-xs font-black text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-all">
                    进入学习 
                    <CirclePlay className="w-4 h-4" />
                  </span>
                </div>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
};
