import { useState, useEffect } from 'react';
import { PetState, UserProgress, Unit } from './types';
import { pepperUnits } from './data/courseData';
import { PetCompanion } from './components/PetCompanion';
import { UnitList } from './components/UnitList';
import { UnitDetails } from './components/UnitDetails';
import { BookOpen, RefreshCw, Sparkles, GraduationCap, Flame, Star, Award } from 'lucide-react';

export default function App() {
  const [selectedUnit, setSelectedUnit] = useState<Unit | null>(null);

  // 1. Initialize user progress list from local storage
  const [userProgress, setUserProgress] = useState<UserProgress>(() => {
    const saved = localStorage.getItem('pep_6_progress');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse progress config", e);
      }
    }
    return {
      scores: {},
      completedCountToday: 0,
      lastDate: new Date().toISOString().split('T')[0]
    };
  });

  // 2. Initialize pet Companion state from local storage
  const [pet, setPet] = useState<PetState>(() => {
    const saved = localStorage.getItem('pep_6_pet');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error("Failed to parse pet config", e);
      }
    }
    return {
      level: 1,
      foodCount: 5, // give boys 5 starting cookies for fun!
      exp: 0,
      name: "小芒果",
      avatar: 'happy',
      accessory: 'basic',
      lastActiveDate: new Date().toISOString().split('T')[0],
      dailyPractices: []
    };
  });

  const [levelUpAlert, setLevelUpAlert] = useState<string | null>(null);

  // Sync state changes with localStorage
  useEffect(() => {
    localStorage.setItem('pep_6_progress', JSON.stringify(userProgress));
  }, [userProgress]);

  useEffect(() => {
    localStorage.setItem('pep_6_pet', JSON.stringify(pet));
  }, [pet]);

  // Check and Reset daily status if a new day begins
  useEffect(() => {
    const todayStr = new Date().toISOString().split('T')[0];
    
    // Check if the date has changed relative to the pet's last logged date
    if (pet.lastActiveDate !== todayStr) {
      setPet(prev => ({
        ...prev,
        lastActiveDate: todayStr,
        dailyPractices: [], // clean unique sentence list for new level ups today!
        avatar: prev.dailyPractices.length === 0 ? 'hungry' : 'happy'
      }));

      setUserProgress(prev => ({
        ...prev,
        lastDate: todayStr,
        completedCountToday: 0
      }));
    }
  }, [pet.lastActiveDate]);

  // Handle feed action
  const handleFeedPet = () => {
    if (pet.foodCount <= 0) return;

    setPet(prev => {
      const nextExp = prev.exp + 20;
      const expNeeded = prev.level * 100;
      let nextLevel = prev.level;
      let finalExp = nextExp;
      let unlockedDecoration = false;

      if (nextExp >= expNeeded) {
        nextLevel = prev.level + 1;
        finalExp = nextExp - expNeeded;
        unlockedDecoration = true;
      }

      if (unlockedDecoration) {
        const rewards = [
          "酷酷太阳镜 😎",
          "冒险家草帽 🤠",
          "尊贵金色皇冠 👑",
          "科幻极光目镜 🥽",
          "超级英雄披风 🦸‍♂️"
        ];
        const ornament = rewards[Math.min(rewards.length - 1, nextLevel - 2)] || "基础款小项圈";
        setLevelUpAlert(`🎉 恭喜！你的小宠物超级成长啦！升到了 Lv. ${nextLevel}，并解锁了新头饰：【${ornament}】！🐾`);
      }

      return {
        ...prev,
        foodCount: prev.foodCount - 1,
        exp: finalExp,
        level: nextLevel,
        avatar: 'eating'
      };
    });

    // Reset status back to happy after a while
    setTimeout(() => {
      setPet(prev => ({
        ...prev,
        avatar: 'happy'
      }));
    }, 2000);
  };

  // Handle follow-read scoring completion
  const handleSentenceComplete = (sentenceId: string, score: number) => {
    setUserProgress(prev => {
      const updatedScores = { ...prev.scores };
      const previousBest = updatedScores[sentenceId] || 0;
      
      // Keep only their highest score
      if (score > previousBest) {
        updatedScores[sentenceId] = score;
      }

      return {
        ...prev,
        scores: updatedScores
      };
    });

    // Pet Breeding incentive logic:
    // "每次完成一个句子的跟读（无论几星），宠物获得 1 颗食物。" -> we increment pet food values!
    // "每日完成 5 个不同句子的跟读，宠物升 1 级，并解锁新的宠物表情或装饰。"
    setPet(prev => {
      const hasCompletedToday = prev.dailyPractices.includes(sentenceId);
      const nextDailyList = hasCompletedToday 
        ? prev.dailyPractices 
        : [...prev.dailyPractices, sentenceId];

      let levelBonus = 0;
      let alertMsg: string | null = null;

      // When the count of unique daily practices hits exactly 5
      if (!hasCompletedToday && nextDailyList.length === 5) {
        levelBonus = 1;
        const rewards = [
          "酷酷太阳镜 😎",
          "冒险家草帽 🤠",
          "尊贵金色皇冠 👑",
          "科幻极光目镜 🥽",
          "超级英雄披风 🦸‍♂️"
        ];
        const ornament = rewards[Math.min(rewards.length - 1, (prev.level + 1) - 2)] || "基础款小项圈";
        alertMsg = `🏆 太厉害了！你完成了今日的 5 句朗读目标！“小芒果” 跟着你升到了 Lv. ${prev.level + 1}，快去帮它换上新装饰【${ornament}】吧！⭐🐈`;
      }

      if (alertMsg) {
        setLevelUpAlert(alertMsg);
      }

      return {
        ...prev,
        foodCount: prev.foodCount + 1, // +1 food treats for every record!
        dailyPractices: nextDailyList,
        level: prev.level + levelBonus,
        avatar: 'excited'
      };
    });
  };

  const handleEarnFood = () => {
    // Called when user speaks a sentence so can receive cookie feedback asynchronously
  };

  const handleResetProgress = () => {
    if (window.confirm("确定要重新开始吗？这会重置你的发音星级、宠物等级和食物饼干噢。")) {
      setUserProgress({
        scores: {},
        completedCountToday: 0,
        lastDate: new Date().toISOString().split('T')[0]
      });
      setPet({
        level: 1,
        foodCount: 5,
        exp: 0,
        name: "小芒果",
        avatar: 'happy',
        accessory: 'basic',
        lastActiveDate: new Date().toISOString().split('T')[0],
        dailyPractices: []
      });
      setLevelUpAlert("🎒 重置成功，让我们跟着“小芒果”重新开启神奇课文点读之旅吧！");
    }
  };

  // Filter greetings corresponding to current user hours
  const getDailyGreeting = () => {
    const hours = new Date().getHours();
    if (hours < 12) return "早上好，朝气蓬勃的英语小侦探！🕵️‍♂️";
    if (hours < 18) return "下午好，元气满满的英语小学者！🚀";
    return "晚上好，专心致志的英语之星！🌌";
  };

  return (
    <div className="min-h-screen bg-slate-100/70 py-6 px-4 md:px-8 font-sans transition-colors duration-300">
      
      {/* Container wrapper responsive desktop center config */}
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Navigation top bar branding component */}
        <header className="bg-white rounded-3xl p-5 border-3 border-amber-300 shadow-sm flex flex-col sm:flex-row justify-between items-center gap-4 relative overflow-hidden">
          <div className="flex items-center gap-3">
            <div className="bg-amber-400 p-2.5 rounded-2xl text-amber-950 shadow-sm flex items-center justify-center animate-bounce">
              <GraduationCap className="w-7 h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-slate-800 tracking-tight">人教PEP六年级英语趣点读</h1>
                <span className="bg-blue-100 text-blue-700 text-[10px] font-black px-2 py-0.5 rounded-md">五年级级/六年级男生专属版</span>
              </div>
              <p className="text-xs text-slate-500 font-bold mt-0.5">
                {getDailyGreeting()} 开心阅读，健康养成 ✨
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleResetProgress}
              className="flex items-center gap-1.5 bg-slate-50 hover:bg-red-50 text-slate-500 hover:text-red-650 px-4 py-2 rounded-2xl text-xs font-black transition-all cursor-pointer border border-slate-200/50"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              清空进度重练
            </button>
            
            <div className="bg-orange-100 text-orange-850 px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-1.5">
              <Flame className="w-4 h-4 text-orange-600 animate-pulse" />
              今日跟读: {pet.dailyPractices.length}/5 句
            </div>
          </div>
        </header>

        {/* Level Up reward alerts banner */}
        {levelUpAlert && (
          <div className="bg-gradient-to-r from-yellow-400/90 via-amber-400 to-orange-400 text-slate-900 font-black text-sm p-4 rounded-3xl text-center shadow-lg border-3 border-white animate-bounce flex items-center justify-between gap-3 relative">
            <span className="flex-1 text-center">{levelUpAlert}</span>
            <button 
              onClick={() => setLevelUpAlert(null)}
              className="bg-slate-900 border border-slate-700/50 hover:bg-slate-800 text-white font-black text-xs px-3.5 py-1.5 rounded-xl cursor-pointer"
            >
              太棒啦！
            </button>
          </div>
        )}

        {/* Persistent Cute Pet breeding Dashboard */}
        <PetCompanion 
          pet={pet}
          onFeed={handleFeedPet}
          dailyGoal={5}
          todayCompletedCount={pet.dailyPractices.length}
        />

        {/* Display routing panels */}
        {selectedUnit ? (
          <UnitDetails 
            unit={selectedUnit}
            userProgress={userProgress}
            onBack={() => setSelectedUnit(null)}
            onSentenceComplete={handleSentenceComplete}
            onEarnFood={handleEarnFood}
          />
        ) : (
          <UnitList 
            units={pepperUnits}
            userProgress={userProgress}
            onSelectUnit={(unit) => setSelectedUnit(unit)}
          />
        )}

        {/* Humble human-safe footer credits */}
        <footer className="text-center font-bold text-slate-400 text-[10px] py-4">
          人教版 PEP 英语六年级上册课本配套多媒体点读与趣跟读系统 • 支持本地离线运行
        </footer>

      </div>

    </div>
  );
}
