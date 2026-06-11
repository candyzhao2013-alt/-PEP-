import React, { useState, useEffect } from 'react';
import { PetState } from '../types';
import { Sparkles, Trophy, Flame, Heart } from 'lucide-react';

interface PetCompanionProps {
  pet: PetState;
  onFeed: () => void;
  dailyGoal: number;
  todayCompletedCount: number;
}

export const PetCompanion: React.FC<PetCompanionProps> = ({
  pet,
  onFeed,
  dailyGoal,
  todayCompletedCount,
}) => {
  const [bubbleText, setBubbleText] = useState<string>('');
  const [animatingFeed, setAnimatingFeed] = useState(false);

  // Active dialogues based on pet states
  const randomSpeeches = [
    "你读得真好，我为你感到骄傲！⭐",
    "今天学习感觉怎么样？我们一起大声读英语！",
    "这个语句很有趣，跟我一起来挑战吧！",
    "再来一句，我就能开启新的等级装饰了哦！🚀",
    "今天你比昨天更熟练了，太棒啦！🔥",
    "小宠物为你摇尾巴，赶紧继续读课文吧！🐾",
  ];

  // React to status changes
  useEffect(() => {
    if (todayCompletedCount === 0) {
      setBubbleText("我有点饿了，等你来陪我读课文哦 🐾");
    } else if (todayCompletedCount >= dailyGoal) {
      setBubbleText("哇！今日目标达成了！你太优秀了，我们都升级啦！🏆✨");
    } else {
      const idx = Math.floor(Math.random() * randomSpeeches.length);
      setBubbleText(randomSpeeches[idx]);
    }
  }, [todayCompletedCount, pet.level, dailyGoal]);

  const handleFeedBtn = () => {
    if (pet.foodCount <= 0) {
      setBubbleText("零食不够啦！快去【点击麦克风跟读】赚取零食吧 🍪");
      return;
    }
    setAnimatingFeed(true);
    setBubbleText("嚼嚼嚼... 🍪 真香！我吃饱了，力量满满！💪");
    onFeed();
    setTimeout(() => {
      setAnimatingFeed(false);
      setBubbleText("你读得真好，我吃得饱饱的！我们一起加油！✨🐈");
    }, 1800);
  };

  // Get current decorative item based on level
  const getBadgeAndAccessory = (level: number) => {
    if (level >= 6) return { name: "超级英雄披风", badge: "🦸‍♂️", color: "from-rose-500 to-red-600" };
    if (level >= 5) return { name: "科幻极光目镜", badge: "🥽", color: "from-cyan-400 to-indigo-600" };
    if (level >= 4) return { name: "尊贵金色皇冠", badge: "👑", color: "from-amber-400 to-yellow-600" };
    if (level >= 3) return { name: "冒险家草帽", badge: "🤠", color: "from-amber-700 to-amber-900" };
    if (level >= 2) return { name: "酷酷太阳镜", badge: "😎", color: "from-slate-700 to-slate-900" };
    return { name: "基础款小项圈", badge: "🏅", color: "from-blue-500 to-indigo-500" };
  };

  const decoration = getBadgeAndAccessory(pet.level);

  // Experience threshold
  const expNeeded = pet.level * 100;
  const expProgress = Math.min(100, (pet.exp / expNeeded) * 100);

  // Daily goal progress percentage
  const goalProgress = Math.min(100, (todayCompletedCount / dailyGoal) * 100);

  return (
    <div id="pet_dashboard" className="bg-white rounded-3xl p-6 border-4 border-amber-200 shadow-md relative overflow-hidden">
      {/* Decorative background grid patterns for younger boys */}
      <div className="absolute top-0 right-0 w-24 h-24 bg-amber-50 rounded-full -mr-10 -mt-10 -z-10" />
      <div className="absolute bottom-0 left-0 w-32 h-16 bg-blue-50 rounded-full -ml-10 -mb-10 -z-10 opacity-70" />

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        {/* Left Side: Animated SVG Cat Pet Mascot */}
        <div className="col-span-1 md:col-span-5 flex flex-col items-center relative">
          <div className="relative w-40 h-40 flex items-center justify-center">
            {/* Pulsing light rings behind our pet */}
            <div className={`absolute inset-2 bg-amber-100 rounded-full -z-10 ${animatingFeed ? 'animate-ping duration-1000' : 'animate-pulse'}`} />
            
            {/* SVG Cat Character */}
            <svg viewBox="0 0 200 200" className="w-36 h-36 drop-shadow-lg select-none">
              {/* Ears */}
              <path d="M 50,70 L 30,20 L 75,45 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="5" />
              <path d="M 150,70 L 170,20 L 125,45 Z" fill="#FBBF24" stroke="#D97706" strokeWidth="5" />
              {/* Inner Ears */}
              <path d="M 55,60 L 40,35 L 70,45 Z" fill="#FCA5A5" />
              <path d="M 145,60 L 160,35 L 130,45 Z" fill="#FCA5A5" />

              {/* Tail */}
              <path 
                d="M 150,150 Q 185,120 170,90 Q 155,60 175,45" 
                fill="none" 
                stroke="#FBBF24" 
                strokeWidth="12" 
                strokeLinecap="round" 
                className={`origin-bottom ${animatingFeed ? 'animate-bounce' : 'animate-pulse'}`}
              />

              {/* Body */}
              <ellipse cx="100" cy="140" rx="60" ry="40" fill="#FBBF24" stroke="#D97706" strokeWidth="6" />

              {/* Head */}
              <circle cx="100" cy="95" r="50" fill="#FBBF24" stroke="#D97706" strokeWidth="6" />

              {/* White Muzzle / Cheeks */}
              <circle cx="85" cy="112" r="14" fill="#FFFFFF" />
              <circle cx="115" cy="112" r="14" fill="#FFFFFF" />
              
              {/* Nose */}
              <polygon points="95,106 105,106 100,111" fill="#EF4444" stroke="#EF4444" strokeWidth="1" />

              {/* Mouth */}
              <path d="M 90,111 Q 100,118 100,112 Q 100,118 110,111" fill="none" stroke="#78350F" strokeWidth="3" strokeLinecap="round" />

              {/* Rosy blush cheeks */}
              <circle cx="65" cy="108" r="7" fill="#FCA5A5" opacity="0.8" />
              <circle cx="135" cy="108" r="7" fill="#FCA5A5" opacity="0.8" />

              {/* Whiskers */}
              <line x1="45" y1="102" x2="25" y2="98" stroke="#78350F" strokeWidth="2" />
              <line x1="45" y1="110" x2="20" y2="112" stroke="#78350F" strokeWidth="2" />
              
              <line x1="155" y1="102" x2="175" y2="98" stroke="#78350F" strokeWidth="2" />
              <line x1="155" y1="110" x2="180" y2="112" stroke="#78350F" strokeWidth="2" />

              {/* Eyes */}
              {animatingFeed ? (
                // Happy closed crescent eyes while eating
                <>
                  <path d="M 68,95 Q 78,85 88,95" fill="none" stroke="#78350F" strokeWidth="4.5" strokeLinecap="round" />
                  <path d="M 112,95 Q 122,85 132,95" fill="none" stroke="#78350F" strokeWidth="4.5" strokeLinecap="round" />
                </>
              ) : (
                // Large sparkly cute boy-anime explorer eyes
                <>
                  <circle cx="78" cy="94" r="11" fill="#1E293B" />
                  <circle cx="75" cy="90" r="3.5" fill="#FFFFFF" /> {/* Highlighting light */}
                  <circle cx="81" cy="96" r="1.5" fill="#FFFFFF" />

                  <circle cx="122" cy="94" r="11" fill="#1E293B" />
                  <circle cx="119" cy="90" r="3.5" fill="#FFFFFF" /> {/* Highlighting light */}
                  <circle cx="125" cy="96" r="1.5" fill="#FFFFFF" />
                </>
              )}

              {/* SVG Level Decoration rendering overlays! */}
              {pet.level >= 2 && (
                /* Cool sunglasses */
                <g opacity="0.95" id="sunglasses_accessory">
                  <rect x="58" y="85" width="34" height="15" rx="5" fill="#1E293B" />
                  <rect x="108" y="85" width="34" height="15" rx="5" fill="#1E293B" />
                  <line x1="92" y1="92" x2="108" y2="92" stroke="#1E293B" strokeWidth="4" />
                  {/* Glass reflective stroke */}
                  <line x1="62" y1="88" x2="72" y2="93" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
                  <line x1="112" y1="88" x2="122" y2="93" stroke="#94A3B8" strokeWidth="2" strokeLinecap="round" />
                </g>
              )}
              {pet.level >= 3 && pet.level < 4 && (
                /* Explorer Straw Hat */
                <g id="explorer_hat_accessory">
                  <path d="M 40,55 Q 100,20 160,55" fill="#B45309" stroke="#78350F" strokeWidth="4" />
                  <ellipse cx="100" cy="50" rx="35" ry="12" fill="#D97706" />
                  <rect x="75" y="46" width="50" height="6" fill="#DC2626" /> {/* red band */}
                </g>
              )}
              {pet.level >= 4 && pet.level < 5 && (
                /* Crown */
                <g id="crown_accessory">
                  <polygon points="68,52 62,32 82,42 100,20 118,42 138,32 132,52" fill="#FBBF24" stroke="#D97706" strokeWidth="3.5" />
                  <circle cx="100" cy="20" r="3.5" fill="#EF4444" />
                  <circle cx="62" cy="32" r="2.5" fill="#3B82F6" />
                  <circle cx="138" cy="32" r="2.5" fill="#10B981" />
                </g>
              )}
              {pet.level >= 5 && pet.level < 6 && (
                /* Cyber Sci-Fi Visor */
                <g id="sci-fi_visor_accessory" opacity="0.9">
                  <polygon points="55,83 145,83 140,103 60,103" fill="#06B6D4" stroke="#0891B2" strokeWidth="3" />
                  <polyline points="55,83 100,98 145,83" fill="none" stroke="#FFFFFF" strokeWidth="2.5" opacity="0.6" />
                </g>
              )}
              {pet.level >= 6 && (
                /* Crown AND Cape overlay together! */
                <>
                  <polygon points="68,52 62,32 82,42 100,20 118,42 138,32 132,52" fill="#EF4444" stroke="#991B1B" strokeWidth="3.5" />
                  <circle cx="100" cy="20" r="3.5" fill="#FBBF24" />
                  {/* Superhero shoulders */}
                  <path d="M 52,145 L 35,175 L 65,155 Z" fill="#EF4444" />
                  <path d="M 148,145 L 165,175 L 135,155 Z" fill="#EF4444" />
                </>
              )}
            </svg>

            {/* Float cookie animation when eating */}
            {animatingFeed && (
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-3xl animate-bounce">
                🍪
              </div>
            )}
          </div>

          <div className="mt-2 flex items-center gap-1.5 bg-yellow-100 border border-yellow-200 px-3 py-1 rounded-full">
            <span className="text-xl" role="img" aria-label="accessory-badge">{decoration.badge}</span>
            <span className="text-xs font-bold text-amber-800">已解锁: {decoration.name}</span>
          </div>
        </div>

        {/* Right Side: Interactive Dialogue Box & Progress Bar */}
        <div className="col-span-1 md:col-span-7 flex flex-col justify-between h-full">
          <div>
            {/* Speech bubble */}
            <div className="relative bg-amber-50 border-3 border-amber-300 rounded-2xl p-4 mb-4">
              <div className="absolute left-6 -bottom-3 w-4 h-4 bg-amber-50 border-b-3 border-r-3 border-amber-300 rotate-45 transform" />
              <div className="flex items-start gap-2">
                <span className="text-2xl mt-1 select-none">🐱</span>
                <div>
                  <h4 className="text-xs font-black tracking-wider text-amber-800 uppercase">
                    小猫咪 “芒果” 的悄悄话 :
                  </h4>
                  <p className="text-sm font-semibold text-slate-700 leading-relaxed mt-1">
                    {bubbleText}
                  </p>
                </div>
              </div>
            </div>

            {/* Pet Status Stats: level & cookie count */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              <div className="bg-gradient-to-r from-amber-500 to-amber-600 rounded-2xl p-3 text-white flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 p-1.5 rounded-xl">
                    <Trophy className="w-5 h-5 text-yellow-200" />
                  </div>
                  <div>
                    <div className="text-[10px] text-yellow-100 font-bold uppercase tracking-wider">宠物等级</div>
                    <div className="text-lg font-black tracking-tight">Lv. {pet.level}</div>
                  </div>
                </div>
                <div className="text-2xl font-black opacity-30 select-none">🎖️</div>
              </div>

              <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-3 text-white flex items-center justify-between shadow-sm">
                <div className="flex items-center gap-2">
                  <div className="bg-white/20 p-1.5 rounded-xl">
                    <Flame className="w-5 h-5 text-orange-200" />
                  </div>
                  <div>
                    <div className="text-[10px] text-blue-100 font-bold uppercase tracking-wider">赚取的饼干</div>
                    <div className="text-lg font-black tracking-tight">{pet.foodCount} 块</div>
                  </div>
                </div>
                <button
                  onClick={handleFeedBtn}
                  className="bg-white hover:bg-yellow-100 text-blue-600 font-black text-xs px-3 py-1.5 rounded-xl shadow transition-transform active:scale-95 flex items-center gap-1 cursor-pointer"
                >
                  🍖 喂食
                </button>
              </div>
            </div>

            {/* EXP Bar to next level */}
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-3.5 mb-4">
              <div className="flex items-center justify-between text-xs font-bold text-slate-500 mb-1.5">
                <span className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                  成长值 EXP
                </span>
                <span>{pet.exp} / {expNeeded}</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-amber-400 to-amber-500 h-full rounded-full transition-all duration-500 ease-out" 
                  style={{ width: `${expProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Today's Daily Challenge Task Goal */}
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200/50 rounded-2xl p-4">
            <div className="flex items-center justify-between mb-2">
              <div>
                <span className="bg-orange-100 text-orange-700 text-[10px] font-black tracking-widest px-2 py-0.5 rounded-md uppercase mr-2">
                  每日任务
                </span>
                <span className="text-xs font-bold text-slate-700">跟读 5 句课文升级</span>
              </div>
              <span className="text-xs font-bold text-orange-600 flex items-center gap-0.5">
                <Sparkles className="w-3.5 h-3.5" />
                {todayCompletedCount >= dailyGoal ? "今日任务已达成！" : `还差 ${Math.max(0, dailyGoal - todayCompletedCount)} 句`}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex-1 bg-slate-200 rounded-full h-2.5 overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-orange-400 to-orange-500 h-full rounded-full transition-all duration-500"
                  style={{ width: `${goalProgress}%` }}
                />
              </div>
              <span className="text-sm font-black text-slate-800 min-w-10 text-right">
                {todayCompletedCount}/{dailyGoal} 句
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
