"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function QuizPage() {
  const router = useRouter();
  const [categories, setCategories] = useState<any[]>([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [loading, setLoading] = useState(true);
  
  // State khusus Timer
  const SECONDS_PER_QUESTION = 15;
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_QUESTION);

  const shuffle = (array: any[]) => {
    const newArr = [...array];
    for (let i = newArr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
    }
    return newArr;
  };

  // Fungsi untuk pindah soal (dibungkus useCallback agar stabil)
  const nextQuestion = useCallback(() => {
    const nextIndex = currentIndex + 1;
    if (nextIndex < questions.length) {
      setCurrentIndex(nextIndex);
      setTimeLeft(SECONDS_PER_QUESTION); // Reset timer untuk soal baru
    } else {
      setShowResult(true);
    }
  }, [currentIndex, questions.length]);

  const handleAnswer = (selectedOption: string | null) => {
    if (selectedOption === questions[currentIndex].correct_answer) {
      setScore(score + 1);
    }
    nextQuestion();
  };

  // Di dalam QuizPage komponen
const [user, setUser] = useState("");

useEffect(() => {
  const savedUser = localStorage.getItem("tonsea_user");
  if (!savedUser) {
    router.push("/login"); // Tendang balik ke login jika belum isi nama
  } else {
    setUser(savedUser);
  }
}, [router]);

  // Effect untuk menyimpan skor ketika kuis selesai
  useEffect(() => {
    if (showResult && user && questions.length > 0) {
      const saveScore = async () => {
        try {
          const userKelas = localStorage.getItem("tonsea_user_kelas");
          await fetch('/api/scores', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              username: user,
              kelas: userKelas || null,
              score: score,
              total_questions: questions.length
            })
          });
        } catch (error) {
          console.error("Gagal menyimpan skor", error);
        }
      };
      saveScore();
    }
  }, [showResult, user, score, questions.length]);

  // Effect untuk Timer
  useEffect(() => {
    if (loading || showResult || questions.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          nextQuestion(); // Otomatis pindah soal jika waktu habis
          return SECONDS_PER_QUESTION;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, showResult, questions.length, nextQuestion]);

  useEffect(() => {
    const initDataAndCategories = async () => {
      let userKelas = localStorage.getItem("tonsea_user_kelas");
      const savedUser = localStorage.getItem("tonsea_user");
      
      if (!userKelas && savedUser) {
        try {
          const res = await fetch('/api/admin/users');
          const users = await res.json();
          const currentUser = users.find((u: any) => u.username === savedUser);
          if (currentUser && currentUser.kelas) {
            userKelas = currentUser.kelas;
            localStorage.setItem("tonsea_user_kelas", currentUser.kelas as string);
          }
        } catch (e) {
          console.error(e);
        }
      }

      try {
        let url = '/api/categories';
        if (userKelas) {
          url += `?kelas=${userKelas}`;
        }
        const res = await fetch(url);
        const data = await res.json();
        setCategories(data.data || data); // Beradaptasi dengan jika array dibungkus obj data atau array lgsg
      } catch (error) {
        console.error("Gagal memuat kategori:", error);
      } finally {
        setLoading(false);
      }
    };
    initDataAndCategories();
  }, []);

  const loadQuestions = async (categoryId: string) => {
    setLoading(true);
    try {
      let url = `/api/questions?categoryId=${categoryId}`;
      const userKelas = localStorage.getItem("tonsea_user_kelas");
      if (userKelas) {
        url += `&kelas=${userKelas}`;
      }
      const res = await fetch(url);
      const data = await res.json();
      if (data && data.length > 0) {
        const randomized = shuffle(data).map((q: any) => ({
          ...q,
          options: shuffle(q.options)
        }));
        setQuestions(randomized);
        setSelectedCategoryId(categoryId);
      } else {
        alert("Belum ada soal untuk kategori ini.");
      }
    } catch (error) {
      console.error("Gagal memuat soal", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen text-xl font-bold bg-slate-50 text-slate-500">Menyiapkan Kuis Tonsea...</div>;

  // Jika belum memilih kategori, tampilkan pilihan kategori untuk kuis
  if (!selectedCategoryId) {
    return (
      <main className="min-h-screen bg-slate-50 py-12 px-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/dashboard" className="inline-flex items-center text-blue-600 mb-8 font-bold hover:text-blue-800 transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            Kembali ke Beranda
          </Link>
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-black text-slate-800 mb-4 tracking-tight">Kuis Bahasa Tonsea</h1>
            <p className="text-lg text-slate-600 font-medium">Pilih materi yang ingin kamu uji hari ini!</p>
          </div>
          
          {categories.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => loadQuestions(cat.id.toString())}
                  className="bg-white rounded-3xl p-8 border-2 border-slate-100 shadow-sm hover:shadow-xl hover:border-blue-500 transition-all duration-300 transform hover:-translate-y-1 text-left group"
                >
                  <div className="bg-blue-50 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-blue-600 transition-colors">
                    <span className="text-2xl group-hover:text-white transition-colors">📚</span>
                  </div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">{cat.name}</h3>
                  <p className="text-sm font-medium text-slate-500 line-clamp-2">{cat.description || "Uji kemampuan di materi ini"}</p>
                </button>
              ))}
            </div>
          ) : (
            <div className="text-center p-8 bg-white rounded-2xl shadow-sm border border-slate-200">
               <p className="text-slate-500">Belum ada kategori materi yang tersedia.</p>
            </div>
          )}
        </div>
      </main>
    );
  }

  if (questions.length === 0) return <div className="p-8 text-center text-slate-500 font-medium bg-slate-50 h-screen">Belum ada soal tersedia untuk kategori ini.</div>;

  if (showResult) {
    return (
      <main className="min-h-screen bg-slate-50 py-20 px-4">
        <div className="max-w-md mx-auto p-10 bg-white rounded-3xl shadow-xl text-center border">
          <h2 className="text-3xl font-bold mb-2">Luar Biasa! 🎉</h2>
          <p className="text-gray-500 mb-6">Hasil kuis bahasa Tonsea kamu:</p>
          <div className="text-7xl font-black text-blue-600 mb-6">
            {Math.round((score / questions.length) * 100)}
          </div>
          <div className="flex justify-between bg-gray-50 p-4 rounded-2xl mb-8 text-sm font-medium">
            <div className="text-green-600">Benar: {score}</div>
            <div className="text-red-500">Salah: {questions.length - score}</div>
          </div>
          <button 
            onClick={() => window.location.reload()}
            className="w-full bg-blue-600 text-white py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 mb-4"
          >
            Main Lagi
          </button>
          <Link href="/dashboard" className="block text-gray-400 hover:text-gray-600 text-sm">Kembali ke Beranda</Link>
        </div>
      </main>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <main className="min-h-screen bg-slate-50 py-12">
      <div className="max-w-2xl mx-auto px-6">
        <div className="flex justify-between items-center mb-6">
        {/* Indikator Soal */}
        <div className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-xs font-bold uppercase tracking-widest">
          Soal {currentIndex + 1} / {questions.length}
        </div>
        
        {/* Timer Visual */}
        <div className={`flex items-center gap-2 font-mono text-xl font-bold ${timeLeft <= 5 ? 'text-red-500 animate-pulse' : 'text-gray-700'}`}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {timeLeft}s
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-100 h-3 rounded-full mb-10 overflow-hidden">
        <div 
          className="bg-blue-500 h-full transition-all duration-1000 ease-linear" 
          style={{ width: `${(timeLeft / SECONDS_PER_QUESTION) * 100}%` }}
        ></div>
      </div>

      <div className="mb-12">
        <h1 className="text-2xl md:text-4xl font-bold text-gray-800 leading-tight">
          {currentQuestion.question}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {currentQuestion.options.map((option: string, index: number) => (
          <button
            key={index}
            onClick={() => handleAnswer(option)}
            className="group w-full p-6 text-left bg-white border-2 border-gray-100 rounded-2xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 shadow-sm hover:shadow-md"
          >
            <div className="flex items-center">
              <span className="w-8 h-8 flex items-center justify-center rounded-lg bg-gray-100 group-hover:bg-blue-500 group-hover:text-white font-bold mr-4 text-sm transition-colors">
                {String.fromCharCode(65 + index)}
              </span>
              <span className="text-lg font-semibold text-gray-700 group-hover:text-blue-900">
                {option}
              </span>
            </div>
          </button>
        ))}
      </div>
      </div>
    </main>
  );
}