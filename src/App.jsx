import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';


const DigitalHealthMonitor = () => {
  const [showSidebar, setShowSidebar] = useState(true);
  const [page, setPage] = useState('dashboard');
  const [screen, setScreen] = useState(6);
  const [sleep, setSleep] = useState(7);
  const [work, setWork] = useState(5);
  const [stress, setStress] = useState(3);
  const [mood, setMood] = useState(3);
  const [history, setHistory] = useState([]);
  const [lastCheck, setLastCheck] = useState(null);
  const [welcomed, setWelcomed] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [habits, setHabits] = useState({
    water: false,
    outdoor: false,
    breaks: false,
    bedtime: false,
    posture: false,
    notify: false,
    mindful: false,
    exercise: false
  });

  const handleWelcome = () => {
  speak(
    "Hi! I’m your Digital Health Assistant. I’ll help you track screen habits, predict burnout, and guide you toward healthier routines. Let’s begin.",
    true
  );
  setWelcomed(true);
  setShowWelcome(false);
};


  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      
      const msg = new SpeechSynthesisUtterance();
      msg.text = text;
      msg.rate = 0.85;
      msg.pitch = 1.3;
      msg.volume = 1.0;
      msg.lang = 'en-US';
      
      const voices = window.speechSynthesis.getVoices();
      
      if (voices.length > 0) {
        const preferredVoiceNames = [
          'Google US English Female',
          'Microsoft Zira',
          'Samantha',
          'Karen',
          'Victoria',
          'Fiona',
          'Moira',
          'Tessa',
          'Ava',
          'Google UK English Female',
          'Microsoft Jenny Online',
          'Microsoft Aria Online'
        ];
        
        let selectedVoice = null;
        for (const name of preferredVoiceNames) {
          selectedVoice = voices.find(voice => voice.name.includes(name));
          if (selectedVoice) break;
        }
        
        if (!selectedVoice) {
          selectedVoice = voices.find(v => 
            v.lang.startsWith('en') && 
            (v.name.toLowerCase().includes('female') || 
             v.name.toLowerCase().includes('woman') ||
             (!v.name.toLowerCase().includes('male') && v.name.toLowerCase().includes('f')))
          );
        }
        
        if (!selectedVoice) {
          selectedVoice = voices.find(v => 
            v.lang.startsWith('en') && 
            !v.name.toLowerCase().includes('male')
          );
        }
        
        if (selectedVoice) {
          msg.voice = selectedVoice;
          console.log('Speaking with voice:', selectedVoice.name);
        }
      }
      
      window.speechSynthesis.speak(msg);
    } else {
      console.log('Speech synthesis not supported');
    }
  };

  const toggleHabit = (key) => {
    setHabits(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const calculateBurnout = () => {
    let burnout = 0;
    if (screen > 8) burnout += 25;
    else if (screen > 6) burnout += 15;
    if (sleep < 6) burnout += 25;
    else if (sleep < 7) burnout += 15;
    if (work > 8) burnout += 15;
    else if (work > 6) burnout += 10;
    if (stress >= 4) burnout += 15;
    else if (stress >= 3) burnout += 8;
    if (mood <= 2) burnout += 15;
    else if (mood <= 3) burnout += 8;
    
    const habitsFollowed = Object.values(habits).filter(Boolean).length;
    burnout += (8 - habitsFollowed) * 4;
    return Math.min(burnout, 100);
  };

  const getHealthPredictions = (burnout, habitsCount) => {
    const predictions = { immediate_risks: [], long_term_outcomes: [], recovery_plan: [], category: '' };
    
    if (burnout <= 30) {
      predictions.category = 'excellent';
      predictions.immediate_risks = [
        "✓ Optimal cognitive function and mental clarity",
        "✓ Strong immune system response",
        "✓ Balanced hormone levels",
        "✓ Low risk of digital eye strain"
      ];
      predictions.long_term_outcomes = [
        "➜ Reduced risk of chronic diseases by 40%",
        "➜ Maintained neuroplasticity and brain health",
        "➜ 25% lower risk of cardiovascular issues",
        "➜ Sustained productivity and work efficiency",
        "➜ Better emotional regulation and stress management"
      ];
      predictions.recovery_plan = [
        "Continue your current healthy habits",
        "Maintain 7-8 hours of sleep nightly",
        "Keep screen time under 6 hours daily",
        "Practice the 20-20-20 rule for eye health",
        "Stay hydrated with 8 glasses of water daily"
      ];
    } else if (burnout <= 60) {
      predictions.category = 'warning';
      predictions.immediate_risks = [
        "⚠ Increased cortisol (stress hormone) levels",
        "⚠ Mild cognitive fatigue and reduced focus",
        "⚠ Digital eye strain and potential headaches",
        "⚠ Disrupted circadian rhythm affecting sleep quality"
      ];
      if (screen > 8) predictions.immediate_risks.push("⚠ Computer Vision Syndrome developing");
      if (sleep < 7) predictions.immediate_risks.push("⚠ Sleep debt accumulation (memory impairment)");
      
      predictions.long_term_outcomes = [
        "➜ 30% increased risk of anxiety disorders if continued",
        "➜ Potential development of metabolic syndrome within 2-3 years",
        "➜ 20% higher risk of depression",
        "➜ Increased likelihood of developing myopia (nearsightedness)",
        "➜ Weakened immune system - 15% more susceptible to illness",
        "➜ Risk of chronic fatigue syndrome if habits persist"
      ];
      predictions.recovery_plan = [
        `PRIORITY: Reduce screen time from ${screen}h to 6h daily (-${screen-6}h reduction)`,
        `Increase sleep from ${sleep}h to 7-8h (+${Math.max(0, 7-sleep)}h increase)`,
        "Take 15-minute breaks every 2 hours of screen use",
        "Practice eye exercises: 20-20-20 rule",
        "Add 30 minutes of outdoor activity daily for Vitamin D",
        "Limit caffeine after 2 PM to improve sleep quality",
        `Adopt ${8-habitsCount} more healthy habits from the list`
      ];
    } else {
      predictions.category = 'critical';
      predictions.immediate_risks = [
        "🚨 SEVERE: Chronic stress with elevated cortisol",
        "🚨 Significant cognitive impairment and brain fog",
        "🚨 High risk of burnout syndrome",
        "🚨 Weakened immune system - prone to infections",
        "🚨 Digital eye strain causing persistent headaches",
        "🚨 Disrupted sleep architecture affecting REM cycles"
      ];
      if (screen > 10) predictions.immediate_risks.push("🚨 CRITICAL: Screen addiction indicators present");
      if (sleep < 6) predictions.immediate_risks.push("🚨 CRITICAL: Severe sleep deprivation affecting all body systems");
      if (stress >= 4) predictions.immediate_risks.push("🚨 CRITICAL: Chronic stress affecting heart health");
      
      predictions.long_term_outcomes = [
        "➜ 60% increased risk of cardiovascular disease within 5 years",
        "➜ High probability of developing clinical depression (45% risk)",
        "➜ 50% increased risk of Type 2 diabetes due to stress hormones",
        "➜ Permanent vision damage if Computer Vision Syndrome persists",
        "➜ Accelerated cognitive decline and memory problems",
        "➜ 40% higher risk of hypertension (high blood pressure)",
        "➜ Chronic insomnia development - long-term sleep disorders",
        "➜ Weakened bone density from sedentary lifestyle",
        "➜ Increased risk of obesity and metabolic disorders",
        "➜ Higher susceptibility to autoimmune diseases"
      ];
      predictions.recovery_plan = [
        `URGENT: Immediate screen time reduction from ${screen}h to 4h daily`,
        `URGENT: Increase sleep to 8h minimum from current ${sleep}h`,
        "Consult healthcare provider for comprehensive health screening",
        "Implement strict digital detox: 1 full day per week screen-free",
        "Blue light blocking glasses mandatory for all screen time",
        "Schedule eye examination with optometrist within 2 weeks",
        "Take 10-minute breaks every hour without exception",
        "Begin cognitive behavioral therapy (CBT) for stress management",
        "Add minimum 45 minutes daily physical activity",
        "Practice mindfulness meditation 15 minutes twice daily",
        "Eliminate screens 2 hours before bedtime",
        "Consider vitamin D and B-complex supplementation (consult doctor)",
        `Adopt all ${8-habitsCount} missing healthy habits immediately`
      ];
    }
    return predictions;
  };

  const generateAnalysis = () => {
    const burnout = calculateBurnout();
    const habitsFollowed = Object.values(habits).filter(Boolean).length;
    const today = new Date().toISOString().split('T')[0];
    
    setHistory(prev => [...prev, { Date: today, Burnout: burnout, Screen: screen, Sleep: sleep, Work: work }]);
    setLastCheck({ burnout, screen, sleep, work, habits: habitsFollowed, stress, mood });

    const message = burnout <= 30 
      ? `Great news! Your score is ${burnout} percent. You're doing amazing!`
      : burnout <= 60
      ? `Your score is ${burnout} percent. Time to make some healthy changes!`
      : `Alert! Your score is ${burnout} percent. Please take care of yourself right away.`;
    
    speak(message);
  };

  const HabitCard = ({ habitKey, icon, label }) => {
    const active = habits[habitKey];
    return (
      <div 
        className={`habit-card ${active ? 'habit-active' : ''}`}
        onClick={() => toggleHabit(habitKey)}
      >
        <span className="habit-icon">{icon}</span>
        <div className="habit-label" dangerouslySetInnerHTML={{ __html: label }} />
        <div style={{ marginTop: '10px', opacity: 0.8 }}>
          {active ? '✅ Selected' : 'Tap to select'}
        </div>
      </div>
    );
  };

  const GaugeChart = ({ value }) => {
    const size = 300;
    const strokeWidth = 30;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * Math.PI * 1.5;
    const progress = (value / 100) * circumference;
    
    const getColor = () => {
      if (value <= 30) return '#22c55e';
      if (value <= 60) return '#facc15';
      return '#ef4444';
    };

    return (
      <div style={{ position: 'relative', width: size, height: size, margin: '0 auto' }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-225deg)' }}>
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke="#2d1b4e"
            strokeWidth={strokeWidth}
            strokeDasharray={`${circumference} ${circumference}`}
            strokeLinecap="round"
          />
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            fill="none"
            stroke={getColor()}
            strokeWidth={strokeWidth}
            strokeDasharray={`${progress} ${circumference}`}
            strokeLinecap="round"
            style={{ transition: 'stroke-dasharray 1s ease' }}
          />
        </svg>
        <div style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '72px', fontWeight: 700, color: 'white' }}>{value}%</div>
          <div style={{ fontSize: '20px', color: 'rgba(255,255,255,0.8)', marginTop: '8px' }}>
            Burnout Score
          </div>
        </div>
      </div>
    );
  };

  const BodyMap = () => {
    const burnout = calculateBurnout();
    
    const brainRisk = (burnout > 60 || stress >= 4 || sleep < 6) ? "high" : (burnout > 30 || stress >= 3) ? "medium" : "low";
    const eyesRisk = (screen > 10 || burnout > 60) ? "high" : (screen > 8) ? "medium" : "low";
    const heartRisk = (burnout > 60 || stress >= 4) ? "high" : (burnout > 30 || stress >= 3) ? "medium" : "low";
    const stomachRisk = (burnout > 60 || stress >= 4) ? "high" : (stress >= 3) ? "medium" : "low";
    const spineRisk = (screen > 10 || work > 8 || !habits.posture) ? "high" : (screen > 6) ? "medium" : "low";
    const handsRisk = (screen > 10 || work > 8) ? "high" : (screen > 8) ? "medium" : "low";

    const labels = [];

    if (brainRisk !== "low") {
      labels.push({
        risk: brainRisk,
        text: brainRisk === "high" ? "🧠 Brain: Cognitive impairment, brain fog" : "🧠 Brain: Mental fatigue"
      });
    }
    if (eyesRisk !== "low") {
      labels.push({
        risk: eyesRisk,
        text: eyesRisk === "high" ? "👁️ Eyes: Computer vision syndrome" : "👁️ Eyes: Digital eye strain"
      });
    }
    if (heartRisk !== "low") {
      labels.push({
        risk: heartRisk,
        text: heartRisk === "high" ? "❤️ Heart: Cardiovascular stress" : "❤️ Heart: Elevated stress"
      });
    }
    if (stomachRisk !== "low") {
      labels.push({
        risk: stomachRisk,
        text: stomachRisk === "high" ? "🫃 Digestive: Stress disorders" : "🫃 Digestive: Stress affecting"
      });
    }
    if (spineRisk !== "low") {
      labels.push({
        risk: spineRisk,
        text: spineRisk === "high" ? "🦴 Spine: Chronic back pain" : "🦴 Spine: Poor posture"
      });
    }
    if (handsRisk !== "low") {
      labels.push({
        risk: handsRisk,
        text: handsRisk === "high" ? "✋ Hands: Carpal tunnel, RSI" : "✋ Hands: Repetitive strain"
      });
    }

    return (
      <div className="body-container">
        <div className="human-body">
          <div className="scan-line"></div>
          <div className="body-part head"></div>
          <div className="organ brain"></div>
          {brainRisk !== "low" && <div className={`risk-indicator risk-${brainRisk}`} style={{ top: '25px', left: '50%', transform: 'translateX(-50%)' }}></div>}
          
          <div className="organ eyes">
            <div className="eye"></div>
            <div className="eye"></div>
          </div>
          {eyesRisk !== "low" && <div className={`risk-indicator risk-${eyesRisk}`} style={{ top: '40px', left: '50%', transform: 'translateX(-50%)' }}></div>}
          
          <div className="body-part neck"></div>
          <div className="body-part torso"></div>
          
          <div className="organ spine">
            {[10, 35, 60, 85, 110, 135, 160].map((top, i) => (
              <div key={i} className="vertebra" style={{ top: `${top}px` }}></div>
            ))}
          </div>
          {spineRisk !== "low" && <div className={`risk-indicator risk-${spineRisk}`} style={{ top: '240px', left: '50%', transform: 'translateX(-50%)' }}></div>}
          
          <div className="organ lungs">
            <div className="lung"></div>
            <div className="lung"></div>
          </div>
          
          <div className="organ heart"></div>
          {heartRisk !== "low" && <div className={`risk-indicator risk-${heartRisk}`} style={{ top: '195px', left: '50%', transform: 'translateX(-50%)' }}></div>}
          
          <div className="organ stomach"></div>
          {stomachRisk !== "low" && <div className={`risk-indicator risk-${stomachRisk}`} style={{ top: '275px', left: '50%', transform: 'translateX(-50%)' }}></div>}
          
          <div className="body-part arm left"></div>
          <div className="body-part arm right"></div>
          <div className="organ hand left"></div>
          <div className="organ hand right"></div>
          {handsRisk !== "low" && (
            <>
              <div className={`risk-indicator risk-${handsRisk}`} style={{ top: '330px', left: '15px' }}></div>
              <div className={`risk-indicator risk-${handsRisk}`} style={{ top: '330px', right: '15px' }}></div>
            </>
          )}
          
          <div className="body-part leg left"></div>
          <div className="body-part leg right"></div>
        </div>
        
        <div className="labels-container">
          {labels.map((label, i) => (
            <div key={i} className={`risk-label label-${label.risk}`}>
              {label.text}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const renderDashboard = () => {
    const burnout = calculateBurnout();
    const habitsFollowed = Object.values(habits).filter(Boolean).length;
    const predictions = lastCheck ? getHealthPredictions(lastCheck.burnout, lastCheck.habits) : null;

    return (
      <>
        <div className="glass">
          <h2 className="section-title"><span>⏰</span> Daily Time Tracking</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px', marginBottom: '24px' }}>
          <div className="usage-card">
            <span className="usage-icon">📱</span>
            <div className="usage-label">Screen Time</div>
            <input 
              type="range" 
              min="0" 
              max="16" 
              value={screen} 
              onChange={(e) => setScreen(Number(e.target.value))}
              style={{ width: '100%', marginBottom: '16px' }}
            />
            <div className="usage-value">{screen}</div>
            <p style={{ fontSize: '18px', marginTop: '8px', opacity: 0.8 }}>hours</p>
            {screen > 8 && <p style={{ color: '#ef4444', fontSize: '16px', marginTop: '12px', fontWeight: 600 }}>⚠️ Exceeds recommendation</p>}
            {screen <= 6 && <p style={{ color: '#22c55e', fontSize: '16px', marginTop: '12px', fontWeight: 600 }}>✅ Optimal level</p>}
          </div>

          <div className="usage-card">
            <span className="usage-icon">😴</span>
            <div className="usage-label">Sleep Duration</div>
            <input 
              type="range" 
              min="0" 
              max="12" 
              value={sleep} 
              onChange={(e) => setSleep(Number(e.target.value))}
              style={{ width: '100%', marginBottom: '16px' }}
            />
            <div className="usage-value">{sleep}</div>
            <p style={{ fontSize: '18px', marginTop: '8px', opacity: 0.8 }}>hours</p>
            {sleep < 7 && <p style={{ color: '#ef4444', fontSize: '16px', marginTop: '12px', fontWeight: 600 }}>⚠️ Insufficient sleep</p>}
            {sleep >= 7 && <p style={{ color: '#22c55e', fontSize: '16px', marginTop: '12px', fontWeight: 600 }}>✅ Adequate rest</p>}
          </div>

          <div className="usage-card">
            <span className="usage-icon">📚</span>
            <div className="usage-label">Work/Study</div>
            <input 
              type="range" 
              min="0" 
              max="12" 
              value={work} 
              onChange={(e) => setWork(Number(e.target.value))}
              style={{ width: '100%', marginBottom: '16px' }}
            />
            <div className="usage-value">{work}</div>
            <p style={{ fontSize: '18px', marginTop: '8px', opacity: 0.8 }}>hours</p>
            {work > 8 && <p style={{ color: '#facc15', fontSize: '16px', marginTop: '12px', fontWeight: 600 }}>⚠️ Consider breaks</p>}
          </div>
        </div>

        <div className="glass">
          <h2 className="section-title"><span>💊</span> Health Habits Checklist</h2>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px' }}>
          <HabitCard habitKey="water" icon="💧" label="Adequate<br>Hydration" />
          <HabitCard habitKey="outdoor" icon="🌿" label="Outdoor<br>Activity" />
          <HabitCard habitKey="breaks" icon="👀" label="20-20-20<br>Eye Rule" />
          <HabitCard habitKey="bedtime" icon="🌙" label="Screen-Free<br>Before Bed" />
          <HabitCard habitKey="posture" icon="🧍" label="Proper<br>Posture" />
          <HabitCard habitKey="notify" icon="🔕" label="Managed<br>Notifications" />
          <HabitCard habitKey="mindful" icon="🧠" label="Mindful<br>Device Use" />
          <HabitCard habitKey="exercise" icon="🏃" label="Physical<br>Exercise" />
        </div>

        <div className="glass">
          <h2 className="section-title"><span>🧘‍♀️</span> Psychological Assessment</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '32px' }}>
            <div>
              <p style={{ fontSize: '22px', fontWeight: 600, textAlign: 'center', marginBottom: '16px' }}>Stress Level</p>
              <input 
                type="range" 
                min="1" 
                max="5" 
                value={stress} 
                onChange={(e) => setStress(Number(e.target.value))}
                style={{ width: '100%' }}
              />
              <p style={{ textAlign: 'center', marginTop: '8px' }}>{stress} - {['', 'Minimal', 'Low', 'Moderate', 'High', 'Severe'][stress]}</p>
            </div>
            <div>
              <p style={{ fontSize: '22px', fontWeight: 600, textAlign: 'center', marginBottom: '16px' }}>Mood Quality</p>
              <input 
                type="range" 
                min="1" 
                max="5" 
                value={mood} 
                onChange={(e) => setMood(Number(e.target.value))}
                style={{ width: '100%' }}
              />
              <p style={{ textAlign: 'center', marginTop: '8px' }}>{mood} - {['', 'Poor', 'Fair', 'Good', 'Very Good', 'Excellent'][mood]}</p>
            </div>
          </div>
        </div>

        <button className="analyze-button" onClick={generateAnalysis}>
          🏥 Generate Health Analysis & Predictions
        </button>

        {lastCheck && (
          <>
            <div className="glass" style={{ marginTop: '24px' }}>
              <GaugeChart value={lastCheck.burnout} />
            </div>
            <p style={{
  textAlign: 'center',
  marginTop: '16px',
  fontSize: '14px',
  opacity: 0.85
}}>
  Burnout Score is calculated using screen time, sleep, work hours,
  stress, mood, and daily habits based on health research thresholds.
  This is an early warning indicator, not a medical diagnosis.
</p>

            <div className="glass">
              <h2 className="section-title">🫀 Health Impact Body Map</h2>
              <div style={{
  display: 'flex',
  justifyContent: 'center',
  gap: '20px',
  marginTop: '20px',
  flexWrap: 'wrap',
  fontSize: '14px'
}}>
  <span>🔴 High Risk – Immediate attention needed</span>
  <span>🟡 Medium Risk – Improve habits</span>
  <span>🟢 Low Risk – Healthy condition</span>
</div>

              <BodyMap />
              <div style={{ display: 'flex', justifyContent: 'center', gap: '40px', marginTop: '30px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="risk-indicator risk-high" style={{ position: 'relative' }}></div>
                  <span style={{ fontSize: '16px', fontWeight: 600 }}>High Risk</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="risk-indicator risk-medium" style={{ position: 'relative' }}></div>
                  <span style={{ fontSize: '16px', fontWeight: 600 }}>Medium Risk</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div className="risk-indicator risk-low" style={{ position: 'relative' }}></div>
                  <span style={{ fontSize: '16px', fontWeight: 600 }}>Low Risk</span>
                </div>
              </div>
            </div>

            <div className={`health-${predictions.category}`}>
              <h2 style={{ 
                color: predictions.category === 'excellent' ? '#22c55e' : predictions.category === 'warning' ? '#facc15' : '#ef4444',
                fontSize: '32px',
                marginBottom: '24px'
              }}>
                {predictions.category === 'excellent' ? '✅ Excellent Health Status' : 
                 predictions.category === 'warning' ? '⚠️ Moderate Risk - Action Required' : 
                 '🚨 CRITICAL - Immediate Intervention Required'}
              </h2>

              <h3 style={{ marginTop: '24px', fontSize: '24px', marginBottom: '16px' }}>
                {predictions.category === 'excellent' ? 'Current Health Indicators:' : 'Immediate Health Risks:'}
              </h3>
              {predictions.immediate_risks.map((risk, i) => (
                <div key={i} className={`health-outcome outcome-${predictions.category}`}>{risk}</div>
              ))}

              <h3 style={{ marginTop: '24px', fontSize: '24px', marginBottom: '16px' }}>
                {predictions.category === 'excellent' ? 'Long-Term Health Benefits:' : 
                 predictions.category === 'warning' ? 'Potential Long-Term Consequences:' : 
                 'Serious Long-Term Health Consequences:'}
              </h3>
              {predictions.long_term_outcomes.map((outcome, i) => (
                <div key={i} className={`health-outcome outcome-${predictions.category}`}>{outcome}</div>
              ))}

              <h3 style={{ marginTop: '24px', fontSize: '24px', marginBottom: '16px' }}>
                {predictions.category === 'excellent' ? 'Maintenance Recommendations:' : 
                 predictions.category === 'warning' ? 'Recovery Action Plan:' : 
                 'Urgent Recovery Protocol:'}
              </h3>
              {predictions.recovery_plan.map((plan, i) => (
                <div key={i} className={`health-outcome outcome-${predictions.category}`}>{plan}</div>
              ))}
            </div>
          </>
        )}
      </>
    );
  };

  const renderAnalytics = () => {
    if (history.length === 0) {
      return (
        <div className="glass">
          <h2 className="section-title">📊 Your Wellness Journey</h2>
          <p style={{ textAlign: 'center', fontSize: '18px', opacity: 0.8 }}>
            📊 No data yet. Start tracking your wellness on the Dashboard!
          </p>
        </div>
      );
    }

    const avgBurnout = history.reduce((sum, h) => sum + h.Burnout, 0) / history.length;
    const avgScreen = history.reduce((sum, h) => sum + h.Screen, 0) / history.length;
    const avgSleep = history.reduce((sum, h) => sum + h.Sleep, 0) / history.length;

    return (
      <div className="glass">
        <h2 className="section-title">📊 Your Wellness Journey</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px', marginBottom: '32px' }}>
          <div className="metric-card">
            <div className="metric-value">{avgBurnout.toFixed(1)}%</div>
            <div className="metric-label">Avg Burnout</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">{avgScreen.toFixed(1)}h</div>
            <div className="metric-label">Avg Screen Time</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">{avgSleep.toFixed(1)}h</div>
            <div className="metric-label">Avg Sleep</div>
          </div>
          <div className="metric-card">
            <div className="metric-value">{history.length}</div>
            <div className="metric-label">Days Tracked</div>
          </div>
        </div>

        <ResponsiveContainer width="100%" height={400}>
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="Date" stroke="white" />
            <YAxis stroke="white" />
            <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(168,85,247,0.5)' }} />
            <Legend />
            <Line type="monotone" dataKey="Burnout" stroke="#a855f7" strokeWidth={4} dot={{ fill: '#ec4899', r: 6 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  const renderUsageTrends = () => {
    if (history.length < 3) {
      return (
        <div className="glass">
          <h2 className="section-title">📈 Your Daily Usage Flow</h2>
          <p style={{ textAlign: 'center', fontSize: '18px', opacity: 0.8 }}>
            📈 Need at least 3 days of data to show trends. Keep tracking!
          </p>
        </div>
      );
    }

    return (
      <div className="glass">
        <h2 className="section-title">📈 Your Daily Usage Flow</h2>
        <ResponsiveContainer width="100%" height={450}>
          <LineChart data={history}>
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis dataKey="Date" stroke="white" />
            <YAxis stroke="white" label={{ value: 'Hours', angle: -90, position: 'insideLeft', fill: 'white' }} />
            <Tooltip contentStyle={{ background: 'rgba(0,0,0,0.8)', border: '1px solid rgba(168,85,247,0.5)' }} />
            <Legend wrapperStyle={{ paddingTop: '20px' }} />
            <Line type="monotone" dataKey="Screen" stroke="#ef4444" strokeWidth={3} dot={{ fill: '#ef4444', r: 5 }} name="Screen Time" />
            <Line type="monotone" dataKey="Sleep" stroke="#22c55e" strokeWidth={3} dot={{ fill: '#22c55e', r: 5 }} name="Sleep Time" />
            <Line type="monotone" dataKey="Work" stroke="#facc15" strokeWidth={3} dot={{ fill: '#facc15', r: 5 }} name="Work/Study" />
          </LineChart>
        </ResponsiveContainer>
      </div>
    );
  };

  return (
    <div className="app-container">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap');
        
        * {
          font-family: 'Poppins', sans-serif;
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }
        
        #menu-toggle {
          display: none;
          margin-bottom: 16px;
        }

        @media (max-width: 768px) {
          #menu-toggle {
            display: block;
          }
        }

        html, body, #root {
          width: 100%;
          height: 100%;
          margin: 0;
          padding: 0;
          overflow-x: hidden;
        }
        
        .app-container {
          background: linear-gradient(135deg, #1a0b2e 0%, #2d1b4e 50%, #1a0b2e 100%);
          min-height: 100vh;
          width: 100%;
          color: white;
          padding: 20px;
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 24px;
        }

        @media (max-width: 1024px) {
          .app-container {
            grid-template-columns: 1fr;
          }
        }
        
        .main-content {
          width: 100%;
          max-width: 100%;
          overflow-x: hidden;
          padding-right: 10px;
        }
        
        .glass {
          background: rgba(255,255,255,0.09);
          border-radius: 24px;
          padding: 32px;
          margin-bottom: 24px;
          box-shadow: 0 16px 48px rgba(0,0,0,0.5);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.1);
          width: 100%;
        }
        
        .ai {
          width: 150px;
          height: 150px;
          border-radius: 50%;
          background: linear-gradient(135deg, #a855f7, #ec4899, #f97316);
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 64px;
          animation: pulse 3s infinite;
          margin: auto;
          box-shadow: 0 0 40px rgba(168, 85, 247, 0.5);
        }
        
        @keyframes pulse {
          0%, 100% {
            transform: scale(1);
            box-shadow: 0 0 40px rgba(168, 85, 247, 0.5);
          }
          50% {
            transform: scale(1.1);
            box-shadow: 0 0 60px rgba(236, 72, 153, 0.6);
          }
        }
        
        .habit-card {
          background: linear-gradient(135deg, rgba(168,85,247,0.1), rgba(236,72,153,0.1));
          border-radius: 20px;
          padding: 24px;
          margin: 10px 0;
          border: 2px solid rgba(168, 85, 247, 0.3);
          transition: all 0.4s ease;
          text-align: center;
          cursor: pointer;
        }
        
        .habit-card:hover {
          border-color: rgba(168, 85, 247, 0.8);
          transform: translateY(-4px) scale(1.02);
          box-shadow: 0 12px 32px rgba(168, 85, 247, 0.3);
        }
        
        .habit-active {
          border-color: #22c55e !important;
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.35), rgba(22, 163, 74, 0.35));
          box-shadow: 0 0 30px rgba(34, 197, 94, 0.7);
          transform: scale(1.05);
        }
        
        .habit-icon {
          font-size: 56px;
          display: block;
          margin-bottom: 12px;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
        }
        
        .habit-label {
          font-size: 16px;
          font-weight: 600;
          color: white;
          line-height: 1.4;
        }
        
        .usage-card {
          background: linear-gradient(135deg, rgba(168,85,247,0.15), rgba(236,72,153,0.15));
          border-radius: 20px;
          padding: 28px;
          margin: 16px 0;
          border: 2px solid rgba(168, 85, 247, 0.4);
          text-align: center;
          transition: all 0.3s ease;
        }
        
        .usage-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(168, 85, 247, 0.3);
        }
        
        .usage-icon {
          font-size: 64px;
          display: block;
          margin-bottom: 16px;
          filter: drop-shadow(0 4px 8px rgba(0,0,0,0.3));
        }
        
        .usage-label {
          font-size: 22px;
          font-weight: 700;
          margin-bottom: 16px;
          background: linear-gradient(135deg, #a855f7, #ec4899);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .usage-value {
          font-size: 72px;
          font-weight: 700;
          color: #a855f7;
          text-shadow: 0 2px 8px rgba(168, 85, 247, 0.4);
        }
        
        .analyze-button {
          background: linear-gradient(135deg, #a855f7, #ec4899);
          border: none;
          color: white;
          border-radius: 20px;
          padding: 20px 40px;
          font-weight: 700;
          font-size: 20px;
          width: 100%;
          transition: all 0.3s ease;
          box-shadow: 0 8px 24px rgba(168, 85, 247, 0.4);
          cursor: pointer;
          margin: 24px 0;
        }
        
        .analyze-button:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 32px rgba(168, 85, 247, 0.6);
        }
        
        .health-excellent {
          background: linear-gradient(135deg, rgba(34, 197, 94, 0.25), rgba(22, 163, 74, 0.25));
          border-radius: 24px;
          padding: 36px;
          margin: 24px 0;
          border: 2px solid rgba(34, 197, 94, 0.5);
          font-size: 18px;
          line-height: 1.8;
        }
        
        .health-warning {
          background: linear-gradient(135deg, rgba(250, 204, 21, 0.25), rgba(234, 179, 8, 0.25));
          border-radius: 24px;
          padding: 36px;
          margin: 24px 0;
          border: 2px solid rgba(250, 204, 21, 0.5);
          font-size: 18px;
          line-height: 1.8;
        }
        
        .health-critical {
          background: linear-gradient(135deg, rgba(239, 68, 68, 0.25), rgba(220, 38, 38, 0.25));
          border-radius: 24px;
          padding: 36px;
          margin: 24px 0;
          border: 2px solid rgba(239, 68, 68, 0.5);
          font-size: 18px;
          line-height: 1.8;
        }
        
        .metric-card {
          background: rgba(255,255,255,0.06);
          border-radius: 16px;
          padding: 20px;
          text-align: center;
          border: 1px solid rgba(255,255,255,0.1);
        }
        
        .metric-value {
          font-size: 48px;
          font-weight: 700;
          color: #a855f7;
        }
        
        .metric-label {
          font-size: 16px;
          color: rgba(255,255,255,0.8);
          margin-top: 8px;
          font-weight: 500;
        }
        
        .section-title {
          font-size: 32px;
          font-weight: 700;
          text-align: center;
          margin-bottom: 28px;
          color: white !important;
        }
        
        .section-title span {
          margin-right: 12px;
        }
        
        .health-outcome {
          font-size: 18px;
          padding: 20px;
          margin: 12px 0;
          border-radius: 16px;
          border-left: 5px solid;
          line-height: 1.6;
        }
        
        .outcome-excellent {
          background: rgba(34, 197, 94, 0.15);
          border-color: #22c55e;
        }
        
        .outcome-warning {
          background: rgba(250, 204, 21, 0.15);
          border-color: #facc15;
        }
        
        .outcome-critical {
          background: rgba(239, 68, 68, 0.15);
          border-color: #ef4444;
        }
        
        .body-container {
          position: relative;
          width: 100%;
          max-width: 1000px;
          margin: 40px auto;
          min-height: 700px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
          gap: 60px;
        }
        
        .human-body {
          position: relative;
          width: 200px;
          height: 700px;
          flex-shrink: 0;
        }
        
        .labels-container {
          position: relative;
          flex: 1;
          max-width: 450px;
          padding: 20px 0;
          display: flex;
          flex-direction: column;
          gap: 12px;
        }
        
        .body-part.head {
          position: absolute;
          width: 80px;
          height: 80px;
          background: radial-gradient(circle, #2d1b4e, #1a0b2e);
          border-radius: 50%;
          top: 0;
          left: 50%;
          transform: translateX(-50%);
          border: 3px solid rgba(255,255,255,0.2);
        }
        
        .organ.brain {
          position: absolute;
          width: 60px;
          height: 50px;
          background: linear-gradient(135deg, #e91e63, #f06292);
          border-radius: 50% 50% 40% 40%;
          top: 15px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
        }
        
        .organ.eyes {
          position: absolute;
          top: 35px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 15px;
          z-index: 3;
        }
        
        .eye {
          width: 18px;
          height: 18px;
          background: linear-gradient(135deg, #64b5f6, #42a5f5);
          border-radius: 50%;
          position: relative;
        }
        
        .eye::after {
          content: '';
          position: absolute;
          width: 8px;
          height: 8px;
          background: #1a0b2e;
          border-radius: 50%;
          top: 5px;
          left: 5px;
        }
        
        .body-part.neck {
          position: absolute;
          width: 40px;
          height: 60px;
          background: linear-gradient(180deg, #2d1b4e, #3d2b5e);
          top: 75px;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 0 0 10px 10px;
        }
        
        .body-part.torso {
          position: absolute;
          width: 140px;
          height: 220px;
          background: linear-gradient(180deg, #3d2b5e, #2d1b4e, #1a0b2e);
          border-radius: 50px 50px 20px 20px;
          top: 130px;
          left: 50%;
          transform: translateX(-50%);
          border: 3px solid rgba(255,255,255,0.2);
        }
        
        .organ.heart {
          position: absolute;
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #ef5350, #e53935);
          top: 170px;
          left: 50%;
          transform: translateX(-50%) rotate(45deg);
          border-radius: 50% 50% 0 0;
          z-index: 2;
        }
        
        .heart::before, .heart::after {
          content: '';
          position: absolute;
          width: 50px;
          height: 50px;
          background: linear-gradient(135deg, #ef5350, #e53935);
          border-radius: 50%;
        }
        
        .heart::before {
          left: -25px;
        }
        
        .heart::after {
          top: -25px;
        }
        
        .organ.lungs {
          position: absolute;
          top: 165px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 20px;
          z-index: 1;
        }
        
        .lung {
          width: 35px;
          height: 70px;
          background: linear-gradient(135deg, #ab47bc, #8e24aa);
          border-radius: 50% 50% 40% 40%;
        }
        
        .organ.stomach {
          position: absolute;
          width: 55px;
          height: 60px;
          background: linear-gradient(135deg, #ff9800, #f57c00);
          border-radius: 40% 40% 50% 50%;
          top: 250px;
          left: 50%;
          transform: translateX(-50%);
          z-index: 2;
        }
        
        .organ.spine {
          position: absolute;
          width: 12px;
          height: 200px;
          background: linear-gradient(180deg, #78909c, #546e7a, #455a64);
          top: 140px;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 6px;
          z-index: 0;
        }
        
        .vertebra {
          position: absolute;
          width: 18px;
          height: 8px;
          background: #607d8b;
          left: -3px;
          border-radius: 4px;
        }
        
        .body-part.arm {
          position: absolute;
          width: 30px;
          height: 180px;
          background: linear-gradient(180deg, #3d2b5e, #2d1b4e);
          border-radius: 15px;
          top: 140px;
        }
        
        .arm.left {
          left: -10px;
          transform: rotate(-10deg);
        }
        
        .arm.right {
          right: -10px;
          transform: rotate(10deg);
        }
        
        .organ.hand {
          position: absolute;
          width: 35px;
          height: 40px;
          background: linear-gradient(135deg, #26c6da, #00acc1);
          border-radius: 50% 50% 50% 50% / 40% 40% 60% 60%;
          top: 315px;
        }
        
        .hand.left {
          left: -15px;
        }
        
        .hand.right {
          right: -15px;
        }
        
        .body-part.leg {
          position: absolute;
          width: 40px;
          height: 240px;
          background: linear-gradient(180deg, #2d1b4e, #1a0b2e);
          border-radius: 20px 20px 15px 15px;
          top: 340px;
        }
        
        .leg.left {
          left: 45px;
        }
        
        .leg.right {
          right: 45px;
        }
        
        .risk-indicator {
          position: absolute;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          animation: pulse-risk 2s infinite;
          z-index: 10;
        }
        
        .risk-high {
          background: radial-gradient(circle, #ff1744, #f44336);
          box-shadow: 0 0 20px #ff1744, 0 0 40px #f44336;
        }
        
        .risk-medium {
          background: radial-gradient(circle, #ffc107, #ff9800);
          box-shadow: 0 0 20px #ffc107, 0 0 40px #ff9800;
        }
        
        .risk-low {
          background: radial-gradient(circle, #4caf50, #66bb6a);
          box-shadow: 0 0 20px #4caf50, 0 0 30px #66bb6a;
        }
        
        @keyframes pulse-risk {
          0%, 100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.3);
            opacity: 0.7;
          }
        }
        
        .risk-label {
          position: relative;
          background: rgba(0,0,0,0.85);
          color: white;
          padding: 14px 20px;
          border-radius: 12px;
          font-size: 15px;
          font-weight: 600;
          border: 2px solid;
          animation: fadeInLabel 0.5s ease;
          line-height: 1.4;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }
        
        @keyframes fadeInLabel {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        
        .label-high {
          border-color: #ff1744;
          box-shadow: 0 4px 20px rgba(255, 23, 68, 0.4);
        }
        
        .label-medium {
          border-color: #ffc107;
          box-shadow: 0 4px 20px rgba(255, 193, 7, 0.4);
        }
        
        .label-low {
          border-color: #4caf50;
          box-shadow: 0 4px 20px rgba(76, 175, 80, 0.4);
        }
        
        .body-part, .organ {
          animation: bodyGlow 3s infinite alternate;
        }
        
        @keyframes bodyGlow {
          from {
            filter: brightness(1) drop-shadow(0 0 10px rgba(168, 85, 247, 0.3));
          }
          to {
            filter: brightness(1.1) drop-shadow(0 0 20px rgba(236, 72, 153, 0.5));
          }
        }
        
        .scan-line {
          position: absolute;
          width: 100%;
          height: 3px;
          background: linear-gradient(90deg, transparent, #a855f7, #ec4899, #a855f7, transparent);
          top: 0;
          animation: scan 4s linear infinite;
          z-index: 20;
          opacity: 0.7;
        }
        
        @keyframes scan {
          0% { top: 0; }
          100% { top: 100%; }
        }
        
        .sidebar {
          background: rgba(255,255,255,0.09);
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3);
          backdrop-filter: blur(16px);
          border: 1px solid rgba(255,255,255,0.1);
          height: fit-content;
          position: sticky;
          top: 20px;
          max-height: calc(100vh - 40px);
          overflow-y: auto;
        }
        
        .nav-button {
          background: rgba(168, 85, 247, 0.2);
          border: 2px solid rgba(168, 85, 247, 0.3);
          color: white;
          padding: 12px 20px;
          margin: 8px 0;
          border-radius: 12px;
          width: 100%;
          cursor: pointer;
          font-size: 16px;
          font-weight: 600;
          transition: all 0.3s ease;
        }
        
        .nav-button:hover {
          background: rgba(168, 85, 247, 0.4);
          border-color: rgba(168, 85, 247, 0.6);
          transform: translateX(4px);
        }
        
        .nav-button.active {
          background: linear-gradient(135deg, #a855f7, #ec4899);
          border-color: transparent;
          box-shadow: 0 4px 16px rgba(168, 85, 247, 0.5);
        }
        
        input[type="range"] {
          -webkit-appearance: none;
          width: 100%;
          height: 8px;
          border-radius: 5px;
          background: rgba(255,255,255,0.2);
          outline: none;
        }
        
        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #a855f7, #ec4899);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(168, 85, 247, 0.5);
        }
        
        input[type="range"]::-moz-range-thumb {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: linear-gradient(135deg, #a855f7, #ec4899);
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(168, 85, 247, 0.5);
          border: none;
        }
        
        @media (max-width: 1200px) {
          .app-container {
            grid-template-columns: 260px 1fr;
            gap: 20px;
          }
          
          .body-container {
            flex-direction: column;
            align-items: center;
          }
          
          .labels-container {
            width: 100%;
            max-width: 600px;
          }
        }
        
        @media (max-width: 1024px) {
          .app-container {
            grid-template-columns: 1fr;
            padding: 15px;
          }
          
          .sidebar {
            position: relative;
            top: 0;
            margin-bottom: 20px;
            max-height: none;
          }
          
          .main-content {
            padding-right: 0;
          }
        }
        
        @media (max-width: 768px) {
          .app-container {
            padding: 10px;
          }
          
          .glass {
            padding: 20px;
          }
          
          .usage-value {
            font-size: 56px;
          }
          
          .section-title {
            font-size: 24px;
          }
          
          .body-container {
            min-height: 700px;
          }
          
          .risk-label {
            font-size: 14px;
            padding: 12px 16px;
          }
          
          .ai {
            width: 120px;
            height: 120px;
            font-size: 48px;
          }
          
          .habit-card {
            padding: 16px;
          }
          
          .habit-icon {
            font-size: 40px;
          }
          
          .usage-icon {
            font-size: 48px;
          }
        }
        
        @media (max-width: 480px) {
          .app-container {
            padding: 8px;
          }
          
          .glass {
            padding: 16px;
            border-radius: 16px;
          }
          
          .section-title {
            font-size: 20px;
          }
          
          .usage-value {
            font-size: 48px;
          }
          
          .usage-label {
            font-size: 18px;
          }
          
          .metric-value {
            font-size: 36px;
          }
          
          .analyze-button {
            padding: 16px 32px;
            font-size: 18px;
          }
          
          .health-outcome {
            font-size: 16px;
            padding: 16px;
          }
          
          .ai {
            width: 100px;
            height: 100px;
            font-size: 40px;
          }
          
          h1 {
            font-size: 28px !important;
          }
          
          .body-container {
            min-height: 600px;
          }
          
          .human-body {
            transform: scale(0.8);
          }
          
          .risk-label {
            font-size: 12px;
            padding: 10px 14px;
          }
        }
        
        @media (min-width: 1920px) {
          .app-container {
            max-width: 1920px;
            margin: 0 auto;
          }
        }
        
        ::-webkit-scrollbar {
          width: 10px;
        }
        
        ::-webkit-scrollbar-track {
          background: rgba(0,0,0,0.2);
        }
        
        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #a855f7, #ec4899);
          border-radius: 5px;
        }
        
        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #9333ea, #db2777);
        }
      `}</style>
      {showSidebar && (
      <div className="sidebar">
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
          <h1 style={{ fontSize: '48px', margin: '0' }}>🏥</h1>
          <h2 style={{ margin: '10px 0', fontSize: '20px' }}>AI-Assisted Digital Burnout & Wellness Monitor</h2>
          <p style={{ opacity: 0.7, fontSize: '13px' }}>Professional Wellness Tracking</p>
        </div>
        <hr style={{ border: 'none', borderTop: '1px solid rgba(255,255,255,0.2)', margin: '20px 0' }} />
        <p style={{ fontSize: '16px', fontWeight: 600, marginBottom: '16px' }}>📍 Navigation</p>
        <button 
          className={`nav-button ${page === 'dashboard' ? 'active' : ''}`}
          onClick={() => setPage('dashboard')}
        >
          🏠 Dashboard
        </button>
        <button 
          className={`nav-button ${page === 'analytics' ? 'active' : ''}`}
          onClick={() => setPage('analytics')}
        >
          📊 Analytics
        </button>
        <button 
          className={`nav-button ${page === 'trends' ? 'active' : ''}`}
          onClick={() => setPage('trends')}
        >
          📈 Usage Trends
        </button>
      </div>
      )}

      <div className="main-content">
        <button
          className="nav-button"
          id="menu-toggle"
          onClick={() => setShowSidebar(!showSidebar)}
        >
          ☰ Menu
        </button>

        {showWelcome && (
          <div className="glass" style={{ textAlign: 'center', background: 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(236,72,153,0.2))', border: '2px solid rgba(168,85,247,0.5)' }}>
            <h2 style={{ fontSize: '28px', marginBottom: '16px' }}>👋 Welcome!</h2>
            <p style={{ fontSize: '18px', marginBottom: '20px', opacity: 0.9 }}>
              Click below to activate voice guidance and start your wellness journey
            </p>
            <button 
              onClick={handleWelcome}
              style={{
                background: 'linear-gradient(135deg, #a855f7, #ec4899)',
                border: 'none',
                color: 'white',
                borderRadius: '16px',
                padding: '16px 32px',
                fontSize: '18px',
                fontWeight: 600,
                cursor: 'pointer',
                boxShadow: '0 8px 24px rgba(168, 85, 247, 0.4)',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
              onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            >
              🔊 Start with Voice Guidance
            </button>
          </div>
        )}
        
        <div className="glass" style={{ textAlign: 'center' }}>
          <div className="ai">🏥</div>
          <h1 style={{ marginTop: '20px', fontSize: '42px' }}>Digital Health Monitor</h1>
          <p style={{ opacity: 0.9, fontSize: '20px', marginTop: '12px' }}>
            Professional wellness tracking and health predictions
          </p>
        </div>

        {page === 'dashboard' && renderDashboard()}
        {page === 'analytics' && renderAnalytics()}
        {page === 'trends' && renderUsageTrends()}
      </div>
    </div>
  );
};

export default DigitalHealthMonitor;
