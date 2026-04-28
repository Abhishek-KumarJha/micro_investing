"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function Questionnaire() {
  const router = useRouter();
  const [step, setStep] = useState(0);

  const questions = [
    {
      q: "What is your primary goal for investing?",
      options: ["Preserve capital", "Steady growth", "Maximum returns"]
    },
    {
      q: "How would you react if your portfolio lost 20% in a month?",
      options: ["Sell everything", "Hold and wait", "Buy more"]
    },
    {
      q: "What is your investment timeline?",
      options: ["< 1 year", "1-5 years", "5+ years"]
    }
  ];

  const handleNext = () => {
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      // Submit and redirect
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-slate-900 relative">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
      
      <div className="glassmorphism w-full max-w-2xl p-10 rounded-3xl relative z-10 border border-slate-700">
        <div className="mb-8 flex justify-between items-center">
          <h2 className="text-sm font-medium text-slate-400 tracking-wider uppercase">Risk Assessment</h2>
          <span className="text-emerald-400 font-medium">{step + 1} / {questions.length}</span>
        </div>

        <h1 className="text-3xl font-bold text-white mb-8 leading-tight">
          {questions[step].q}
        </h1>

        <div className="space-y-4 mb-10">
          {questions[step].options.map((opt, idx) => (
            <button
              key={idx}
              onClick={handleNext}
              className="w-full text-left p-6 rounded-2xl bg-slate-800/50 hover:bg-slate-700 text-slate-200 hover:text-white transition-all border border-slate-700/50 hover:border-emerald-500/50 text-lg group"
            >
              <span className="inline-block w-8 text-slate-500 group-hover:text-emerald-400 transition-colors">
                {String.fromCharCode(65 + idx)}.
              </span>
              {opt}
            </button>
          ))}
        </div>

        <div className="h-1 w-full bg-slate-800 rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-emerald-400 to-blue-500 transition-all duration-500"
            style={{ width: `${((step + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>
    </div>
  );
}
