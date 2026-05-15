import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import { Zap, Trophy, LogOut, ShieldCheck, User, Plus, Trash2, LayoutDashboard, Settings, Mail, Check, X, Edit2, Save, XCircle, Sparkles, Crown, Star, Gift } from "lucide-react";

// Firebase Imports
import { db, auth } from './firebaseConfig';
import { onAuthStateChanged, signOut, signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth";
import {
  collection, onSnapshot, query, orderBy,
  doc, updateDoc, addDoc, serverTimestamp, deleteDoc, setDoc
} from "firebase/firestore";

// ==========================================
// 1. LOGIN / SIGNUP PAGE
// ==========================================
function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        await signInWithEmailAndPassword(auth, email, password);
      } else {
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        await setDoc(doc(db, "users", userCredential.user.uid), {
          email: email,
          totalPoints: 0,
          completedTasks: [],
          createdAt: serverTimestamp()
        });
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDFCF6] via-yellow-50 to-[#FFF9E5] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-20 left-10 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-20 right-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>

      <div className="max-w-md w-full relative z-10">
        <div className="text-center mb-8 animate-slideDown">
          <div className="w-24 h-24 bg-gradient-to-br from-[#2C2C31] to-black rounded-3xl flex items-center justify-center mx-auto mb-4 shadow-2xl animate-bounceIn">
            <Zap className="text-yellow-400" size={48} fill="currentColor" />
          </div>
          <h1 className="text-6xl font-black text-[#2C2C31] tracking-tighter bg-gradient-to-r from-yellow-600 to-black bg-clip-text text-transparent">REWARD X</h1>
          <p className="text-slate-500 font-bold mt-2 animate-pulse-subtle">Complete tasks. Earn rewards.</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-[3rem] border-[3px] border-yellow-400 p-8 shadow-2xl animate-fadeInUp hover:shadow-yellow-200 transition-all duration-500">
          <div className="flex gap-2 mb-8 bg-slate-100 p-1 rounded-2xl">
            <button
              onClick={() => setIsLogin(true)}
              className={`flex-1 py-3 rounded-xl font-black uppercase tracking-wider transition-all duration-300 transform ${isLogin ? 'bg-yellow-400 text-black shadow-md scale-105' : 'text-slate-500 hover:scale-105'}`}
            >
              Sign In
            </button>
            <button
              onClick={() => setIsLogin(false)}
              className={`flex-1 py-3 rounded-xl font-black uppercase tracking-wider transition-all duration-300 transform ${!isLogin ? 'bg-yellow-400 text-black shadow-md scale-105' : 'text-slate-500 hover:scale-105'}`}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="group">
              <label className="block text-xs font-black text-slate-600 mb-2 uppercase tracking-widest group-hover:text-yellow-600 transition-colors">Email</label>
              <div className="flex items-center gap-3 p-4 rounded-2xl border-2 border-slate-100 focus-within:border-yellow-400 transition-all duration-300 group-hover:shadow-lg">
                <Mail size={18} className="text-slate-400 group-focus-within:text-yellow-500 transition-colors" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 outline-none font-bold text-slate-700 bg-transparent"
                  placeholder="your@email.com"
                  required
                />
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-black text-slate-600 mb-2 uppercase tracking-widest group-hover:text-yellow-600 transition-colors">Password</label>
              <div className="flex items-center gap-3 p-4 rounded-2xl border-2 border-slate-100 focus-within:border-yellow-400 transition-all duration-300 group-hover:shadow-lg">
                <User size={18} className="text-slate-400 group-focus-within:text-yellow-500 transition-colors" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="flex-1 outline-none font-bold text-slate-700 bg-transparent"
                  placeholder="••••••••"
                  required
                  minLength={6}
                />
              </div>
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-200 text-red-600 p-3 rounded-xl text-sm font-bold animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-black to-gray-800 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:from-yellow-400 hover:to-yellow-500 hover:text-black transition-all duration-300 hover:scale-105 active:scale-95 shadow-md disabled:opacity-50 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <span className="relative z-10">{loading ? <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mx-auto"></div> : (isLogin ? '🚀 Sign In' : '✨ Create Account')}</span>
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-yellow-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 2. NAVIGATION COMPONENT
// ==========================================
function Navbar({ user, isAdmin }) {
  return (
    <nav className="px-8 py-5 bg-white/90 backdrop-blur-md border-b-[3px] border-yellow-400 sticky top-0 z-50 flex justify-between items-center shadow-xl animate-slideDown">
      <div className="font-black text-2xl tracking-tighter flex items-center gap-2 cursor-pointer group">
        <div className="w-12 h-12 bg-gradient-to-br from-[#2C2C31] to-black rounded-xl flex items-center justify-center shadow-lg group-hover:rotate-180 transition-transform duration-500">
          <Zap className="text-yellow-400" size={24} fill="currentColor" />
        </div>
        <span className="text-[#2C2C31] group-hover:text-yellow-600 transition-colors duration-300">REWARD X</span>
      </div>

      <div className="flex items-center gap-6">
        <div className="hidden md:flex gap-8 mr-6 border-r-2 border-yellow-100 pr-10">
          <Link to="/" className="text-[11px] font-black uppercase text-[#2C2C31] hover:text-yellow-500 transition-all hover:scale-110 flex items-center gap-2 group">
            <LayoutDashboard size={14} className="group-hover:rotate-12 transition-transform" /> Dashboard
          </Link>
          {isAdmin && (
            <Link to="/admin" className="flex items-center gap-2 text-[11px] font-black uppercase text-white bg-gradient-to-r from-blue-600 to-blue-700 px-5 py-2.5 rounded-full border-2 border-blue-800 hover:from-blue-700 hover:to-blue-800 hover:shadow-lg transition-all hover:scale-110 animate-pulse-subtle shadow-md">
              <ShieldCheck size={14} /> Admin Panel
            </Link>
          )}
        </div>
        <button
          onClick={() => signOut(auth)}
          className="bg-gradient-to-r from-red-500 to-red-600 text-white px-6 py-3 rounded-2xl font-black text-[11px] uppercase flex items-center gap-2 hover:from-black hover:to-black hover:shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95"
        >
          <LogOut size={16} /> Sign Out
        </button>
      </div>
    </nav>
  );
}

// ==========================================
// 3. USER DASHBOARD (With Oval Shapes & Sequential Task Numbers)
// ==========================================
function UserDashboard({ user, isAdmin }) {
  const [tasks, setTasks] = useState([]);
  const [points, setPoints] = useState(0);
  const [completedTasks, setCompletedTasks] = useState([]);

  useEffect(() => {
    const userDocRef = doc(db, "users", user.uid);
    const unsubUser = onSnapshot(userDocRef, (docSnap) => {
      if (docSnap.exists()) {
        setPoints(docSnap.data().totalPoints || 0);
        setCompletedTasks(docSnap.data().completedTasks || []);
      }
    });

    const q = query(collection(db, "tasks"), orderBy("createdAt", "asc"));
    const unsubTasks = onSnapshot(q, (snap) => {
      setTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => { unsubUser(); unsubTasks(); };
  }, [user.uid]);

  const completeTask = async (taskId, taskPoints) => {
    if (completedTasks.includes(taskId)) return;
    const userDocRef = doc(db, "users", user.uid);
    await updateDoc(userDocRef, {
      totalPoints: points + taskPoints,
      completedTasks: [...completedTasks, taskId]
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#FDFCF6] via-white to-yellow-50 relative overflow-hidden">
      {/* Oval Shapes like Admin Panel */}
      <div className="absolute top-20 -left-20 w-96 h-96 bg-yellow-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
      <div className="absolute bottom-20 -right-20 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-yellow-100 via-pink-100 to-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-pulse"></div>

      <div className="max-w-7xl mx-auto px-6 py-10 space-y-10 relative z-10">
        {/* Hello Section with Oval */}
        <header className="relative overflow-hidden bg-white/80 backdrop-blur-sm p-10 rounded-[3rem] border-[3px] border-yellow-400 shadow-2xl animate-fadeInDown group hover:shadow-yellow-200 transition-all duration-500">
          <div className="absolute -top-32 -right-32 w-64 h-64 bg-gradient-to-br from-yellow-300 to-orange-300 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-700"></div>
          <div className="absolute -bottom-32 -left-32 w-64 h-64 bg-gradient-to-tr from-blue-300 to-purple-300 rounded-full opacity-20 group-hover:scale-150 transition-transform duration-700"></div>

          <div className="flex flex-col md:flex-row justify-between items-center relative z-10">
            <div className="animate-fadeInLeft">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-2xl flex items-center justify-center animate-bounceIn">
                  <Crown className="text-white" size={32} fill="currentColor" />
                </div>
                <h2 className="text-5xl font-black text-[#2C2C31] tracking-tight">Hello {user.email?.split('@')[0]}! 👋</h2>
              </div>
              <p className="text-slate-500 font-bold text-lg ml-20">{user.email}</p>
              {isAdmin && (
                <span className="inline-block mt-2 ml-20 bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-1.5 rounded-full text-xs font-black uppercase shadow-lg animate-pulse-subtle">
                  <ShieldCheck size={12} className="inline mr-1" /> Admin Access
                </span>
              )}
            </div>

            <div className="bg-gradient-to-br from-[#FFF9E5] via-yellow-100 to-yellow-200 px-12 py-6 rounded-[2.5rem] text-center border-2 border-yellow-500 shadow-xl z-10 mt-6 md:mt-0 hover:shadow-2xl transition-all duration-500 hover:scale-110 animate-bounceIn relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-400 opacity-0 group-hover:opacity-20 transition-opacity duration-500"></div>
              <p className="text-[10px] font-black text-yellow-800 uppercase tracking-widest mb-1">Total Balance</p>
              <div className="flex items-center gap-3 justify-center">
                <Trophy className="text-yellow-700 animate-spin-slow" size={32} />
                <span className="text-6xl font-black text-[#2C2C31] tracking-tighter">{points}</span>
              </div>
              <Sparkles className="absolute top-2 right-2 text-yellow-500 animate-pulse" size={16} />
            </div>
          </div>
        </header>

        {/* Tasks Grid with Sequential Numbers */}
        <div className="grid md:grid-cols-3 gap-8 pt-8">
          {tasks.map((task, index) => {
            const taskNumber = index + 1;
            return (
              <div
                key={task.id}
                className="bg-white/90 backdrop-blur-sm p-10 pt-14 rounded-[3rem] border-[3px] border-yellow-400 flex flex-col justify-between hover:shadow-2xl transition-all duration-500 hover:scale-105 hover:border-yellow-500 relative group animate-fadeInUp"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className="absolute -top-5 left-1/2 -translate-x-1/2">
                  <div className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-5 py-2 rounded-full border-2 border-yellow-600 shadow-lg font-black text-sm flex items-center gap-2 animate-pulse-subtle">
                    <Star size={14} fill="currentColor" />
                    Mission #{taskNumber}
                    <Star size={14} fill="currentColor" />
                  </div>
                </div>

                <div className="flex justify-between items-start mb-8">
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-2xl flex items-center justify-center text-yellow-600 border-2 border-yellow-300 group-hover:scale-110 transition-all duration-300 group-hover:shadow-lg group-hover:rotate-12">
                    <Zap size={28} fill="currentColor" />
                  </div>
                  <span className={`px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-wider transition-all duration-300 ${completedTasks.includes(task.id) ? 'bg-green-100 text-green-700 border-2 border-green-300' : 'bg-gradient-to-r from-green-400 to-green-500 text-white border-2 border-green-600 animate-pulse-subtle shadow-md'}`}>
                    {completedTasks.includes(task.id) ? "✓ Claimed" : "Active"}
                  </span>
                </div>

                <div className="flex-1">
                  <h3 className="text-2xl font-black mb-3 text-[#2C2C31] uppercase tracking-tight leading-tight break-words group-hover:text-yellow-600 transition-colors duration-300">
                    {task.title}
                  </h3>
                  <p className="text-5xl font-black text-orange-500 mb-10 group-hover:scale-110 origin-left transition-transform duration-300 flex items-center gap-2">
                    +{task.points} <span className="text-sm text-slate-400 font-bold">PTS</span>
                    <Gift size={24} className="text-green-500 animate-bounce" />
                  </p>
                </div>

                <button
                  disabled={completedTasks.includes(task.id)}
                  onClick={() => completeTask(task.id, task.points)}
                  className={`w-full py-5 rounded-[1.5rem] font-black text-sm uppercase tracking-widest transition-all duration-300 active:scale-95 relative overflow-hidden group ${completedTasks.includes(task.id) ? 'bg-slate-100 text-slate-400 cursor-not-allowed' : 'bg-gradient-to-r from-gray-900 to-black text-white hover:from-yellow-500 hover:to-orange-500 hover:text-black shadow-lg hover:shadow-xl'}`}
                >
                  <span className="relative z-10">
                    {completedTasks.includes(task.id) ? "✓ Mission Complete" : "Complete Mission →"}
                  </span>
                  {!completedTasks.includes(task.id) && (
                    <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                  )}
                </button>
              </div>
            );
          })}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-20 animate-fadeIn">
            <div className="w-32 h-32 bg-gradient-to-br from-yellow-100 to-yellow-200 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
              <Zap size={64} className="text-yellow-500" />
            </div>
            <p className="text-slate-400 font-bold text-2xl">No missions available yet</p>
            <p className="text-slate-300 mt-2">Check back soon for new rewards!</p>
          </div>
        )}
      </div>
    </div>
  );
}

// ==========================================
// 4. ADMIN PANEL (With Edit + Email Limit Max 5)
// ==========================================
function AdminPanel() {
  const [newTask, setNewTask] = useState({ title: '', points: 0 });
  const [adminTasks, setAdminTasks] = useState([]);
  const [adminEmails, setAdminEmails] = useState([]);
  const [newAdminEmail, setNewAdminEmail] = useState('');
  const [showEmailForm, setShowEmailForm] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [editTitle, setEditTitle] = useState('');
  const [editPoints, setEditPoints] = useState('');

  useEffect(() => {
    const adminConfigRef = doc(db, "config", "admins");
    const unsubAdmin = onSnapshot(adminConfigRef, (docSnap) => {
      if (docSnap.exists()) {
        setAdminEmails(docSnap.data().emails || []);
      }
    });

    const q = query(collection(db, "tasks"), orderBy("createdAt", "asc"));
    const unsubTasks = onSnapshot(q, (snap) => {
      setAdminTasks(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    });

    return () => { unsubAdmin(); unsubTasks(); };
  }, []);

  const handleAddTask = async (e) => {
    e.preventDefault();
    if (!newTask.title || newTask.points <= 0) return;
    await addDoc(collection(db, "tasks"), {
      ...newTask,
      points: Number(newTask.points),
      createdAt: serverTimestamp()
    });
    setNewTask({ title: '', points: 0 });
  };

  const deleteTask = async (id) => {
    if (window.confirm('Are you sure you want to delete this mission?')) {
      await deleteDoc(doc(db, "tasks", id));
    }
  };

  const startEdit = (task) => {
    setEditingTask(task.id);
    setEditTitle(task.title);
    setEditPoints(task.points);
  };

  const saveEdit = async (id) => {
    if (!editTitle || editPoints <= 0) return;
    const taskRef = doc(db, "tasks", id);
    await updateDoc(taskRef, {
      title: editTitle,
      points: Number(editPoints)
    });
    setEditingTask(null);
    setEditTitle('');
    setEditPoints('');
  };

  const cancelEdit = () => {
    setEditingTask(null);
    setEditTitle('');
    setEditPoints('');
  };

  const addAdminEmail = async () => {
    if (!newAdminEmail || !newAdminEmail.includes('@')) return;
    if (adminEmails.length >= 5) {
      alert('Maximum 5 admin emails allowed!');
      return;
    }
    if (adminEmails.includes(newAdminEmail)) {
      alert('Email already exists!');
      return;
    }
    const adminConfigRef = doc(db, "config", "admins");
    const newEmails = [...adminEmails, newAdminEmail];
    await setDoc(adminConfigRef, { emails: newEmails });
    setNewAdminEmail('');
    setShowEmailForm(false);
  };

  const removeAdminEmail = async (email) => {
    const adminConfigRef = doc(db, "config", "admins");
    const newEmails = adminEmails.filter(e => e !== email);
    await setDoc(adminConfigRef, { emails: newEmails });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 p-8 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-pulse delay-1000"></div>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        {/* Admin Header */}
        <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-10 rounded-[3rem] border-[3px] border-blue-800 shadow-2xl text-white animate-fadeInDown relative overflow-hidden group">
          <div className="absolute -top-20 -right-20 w-48 h-48 bg-white rounded-full opacity-10 group-hover:scale-150 transition-transform duration-700"></div>
          <div className="absolute -bottom-20 -left-20 w-48 h-48 bg-yellow-300 rounded-full opacity-10 group-hover:scale-150 transition-transform duration-700"></div>
          <div className="flex items-center gap-4 mb-3 relative z-10">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center animate-spin-slow backdrop-blur-sm">
              <ShieldCheck size={36} />
            </div>
            <h1 className="text-5xl font-black tracking-tight">Admin Panel</h1>
          </div>
          <p className="text-blue-100 font-bold text-lg relative z-10">Manage missions, rewards & admin access</p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Create Task Section */}
          <div className="bg-white/90 backdrop-blur-sm p-10 rounded-[3rem] border-[3px] border-yellow-400 shadow-xl animate-fadeInUp hover:shadow-2xl transition-all duration-500 relative group">
            <div className="absolute -top-4 -right-4 w-24 h-24 bg-yellow-200 rounded-full opacity-50 blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
            <h2 className="text-3xl font-black mb-8 flex items-center gap-3 text-[#2C2C31]">
              <div className="w-12 h-12 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center animate-bounce">
                <Plus className="text-white" size={24} />
              </div>
              Create Mission
            </h2>
            <form onSubmit={handleAddTask} className="space-y-6">
              <div className="group/input">
                <label className="block text-xs font-black text-slate-600 mb-2 uppercase tracking-widest group-hover/input:text-yellow-600 transition-colors">Mission Name</label>
                <input
                  type="text"
                  placeholder="e.g. Follow on Instagram"
                  className="w-full p-5 rounded-2xl border-2 border-slate-100 focus:border-yellow-400 focus:shadow-lg outline-none font-bold transition-all duration-300"
                  value={newTask.title}
                  onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                />
              </div>
              <div className="group/input">
                <label className="block text-xs font-black text-slate-600 mb-2 uppercase tracking-widest group-hover/input:text-yellow-600 transition-colors">Points</label>
                <input
                  type="number"
                  placeholder="100"
                  className="w-full p-5 rounded-2xl border-2 border-slate-100 focus:border-yellow-400 focus:shadow-lg outline-none font-bold transition-all duration-300"
                  value={newTask.points}
                  onChange={(e) => setNewTask({ ...newTask, points: e.target.value })}
                  min="1"
                />
              </div>
              <button className="w-full bg-gradient-to-r from-black to-gray-800 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:from-yellow-400 hover:to-orange-500 hover:text-black transition-all duration-300 hover:scale-105 active:scale-95 shadow-md relative overflow-hidden group/btn">
                <span className="relative z-10">✨ Publish Mission</span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 transform scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left"></div>
              </button>
            </form>
          </div>

          {/* Admin Email Management with Limit 5 */}
          <div className="bg-white/90 backdrop-blur-sm p-10 rounded-[3rem] border-[3px] border-blue-400 shadow-xl animate-fadeInUp hover:shadow-2xl transition-all duration-500">
            <h2 className="text-3xl font-black mb-8 flex items-center gap-3 text-[#2C2C31]">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center animate-pulse">
                <Settings className="text-white" size={24} />
              </div>
              Admin Access
              <span className="text-sm bg-blue-100 text-blue-700 px-3 py-1 rounded-full ml-2">
                {adminEmails.length}/5
              </span>
            </h2>

            <div className="space-y-3 mb-6 max-h-52 overflow-y-auto">
              {adminEmails.map((email, idx) => (
                <div key={email} className="flex items-center justify-between bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-2xl border border-blue-200 animate-fadeInRight" style={{ animationDelay: `${idx * 0.1}s` }}>
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Check size={16} className="text-green-600" />
                    </div>
                    <span className="font-bold text-slate-700">{email}</span>
                  </div>
                  <button
                    onClick={() => removeAdminEmail(email)}
                    className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-600 hover:text-white transition-all duration-300 hover:scale-110"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>

            {adminEmails.length >= 5 ? (
              <div className="bg-yellow-50 border-2 border-yellow-400 p-4 rounded-2xl text-center animate-pulse">
                <p className="text-yellow-700 font-bold">⚠️ Maximum 5 admin emails reached!</p>
                <p className="text-xs text-yellow-600 mt-1">Remove an existing admin to add more.</p>
              </div>
            ) : showEmailForm ? (
              <div className="flex gap-2 animate-fadeIn">
                <input
                  type="email"
                  placeholder="admin@example.com"
                  className="flex-1 p-3 rounded-xl border-2 border-blue-300 focus:border-blue-500 outline-none font-bold transition-all"
                  value={newAdminEmail}
                  onChange={(e) => setNewAdminEmail(e.target.value)}
                />
                <button
                  onClick={addAdminEmail}
                  className="p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:scale-105"
                >
                  <Check size={18} />
                </button>
                <button
                  onClick={() => setShowEmailForm(false)}
                  className="p-3 bg-slate-300 text-slate-700 rounded-xl hover:bg-slate-400 transition-all duration-300 hover:scale-105"
                >
                  <X size={18} />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowEmailForm(true)}
                className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 rounded-2xl font-black uppercase tracking-widest hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-105 active:scale-95 flex items-center justify-center gap-2 shadow-md group"
              >
                <Plus size={18} className="group-hover:rotate-90 transition-transform duration-300" /> Add Admin Email ({5 - adminEmails.length} left)
              </button>
            )}
          </div>
        </div>

        {/* Admin Task List with Edit */}
        <div className="bg-white/90 backdrop-blur-sm p-10 rounded-[3rem] border-[3px] border-slate-200 shadow-xl animate-fadeInUp hover:shadow-2xl transition-all duration-500">
          <h2 className="text-3xl font-black mb-8 text-[#2C2C31] flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center">
              <Star size={20} className="text-purple-600" />
            </div>
            Active Missions ({adminTasks.length})
          </h2>
          <div className="space-y-4">
            {adminTasks.map((task, idx) => (
              <div
                key={task.id}
                className="bg-gradient-to-r from-slate-50 to-white p-6 rounded-3xl border-2 border-slate-100 hover:border-yellow-300 transition-all duration-300 hover:shadow-xl group animate-fadeInRight"
                style={{ animationDelay: `${idx * 0.05}s` }}
              >
                {editingTask === task.id ? (
                  <div className="flex gap-3 animate-fadeIn">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      className="flex-1 p-3 rounded-xl border-2 border-yellow-400 outline-none font-bold"
                      placeholder="Task title"
                    />
                    <input
                      type="number"
                      value={editPoints}
                      onChange={(e) => setEditPoints(e.target.value)}
                      className="w-28 p-3 rounded-xl border-2 border-yellow-400 outline-none font-bold text-center"
                      placeholder="Points"
                      min="1"
                    />
                    <button
                      onClick={() => saveEdit(task.id)}
                      className="p-3 bg-green-500 text-white rounded-xl hover:bg-green-600 transition-all hover:scale-110"
                    >
                      <Save size={18} />
                    </button>
                    <button
                      onClick={cancelEdit}
                      className="p-3 bg-red-500 text-white rounded-xl hover:bg-red-600 transition-all hover:scale-110"
                    >
                      <XCircle size={18} />
                    </button>
                  </div>
                ) : (
                  <div className="flex justify-between items-center">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-black px-3 py-1 rounded-full text-xs font-black">
                          #{idx + 1}
                        </span>
                        <p className="font-black text-xl text-[#2C2C31] group-hover:text-yellow-600 transition-colors">{task.title}</p>
                      </div>
                      <p className="text-orange-500 font-bold text-lg">⭐ {task.points} POINTS</p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(task)}
                        className="p-3 bg-blue-50 text-blue-600 rounded-2xl hover:bg-blue-500 hover:text-white transition-all hover:scale-110"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button


                        onClick={() => deleteTask(task.id)}
                        className="p-3 bg-red-50 text-red-500 rounded-2xl hover:bg-red-500 hover:text-white transition-all hover:scale-110"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
          {adminTasks.length === 0 && (
            <p className="text-center text-slate-400 font-bold py-10">No missions created yet</p>
          )}
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 5. MAIN APP COMPONENT
// ==========================================
export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [adminEmails, setAdminEmails] = useState(["muradmahmood46@gmail.com"]);

  useEffect(() => {
    const adminConfigRef = doc(db, "config", "admins");
    const unsubAdmin = onSnapshot(adminConfigRef, (docSnap) => {
      if (docSnap.exists()) {
        setAdminEmails(docSnap.data().emails || ["muradmahmood46@gmail.com"]);
      }
    });

    const unsubAuth = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setLoading(false);
    });

    return () => { unsubAdmin(); unsubAuth(); };
  }, []);

  if (loading) return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-white">
      <div className="text-center">
        <div className="w-20 h-20 bg-yellow-400 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-spin">
          <Zap className="text-black" size={40} fill="currentColor" />
        </div>
        <p className="font-black text-[#2C2C31] text-lg tracking-tight animate-pulse">REWARD X LOADING...</p>
      </div>
    </div>
  );

  const isAdmin = user && adminEmails.includes(user.email);

  return (
    <Router>
      <div className="min-h-screen bg-[#FDFCF6]">
        {user && <Navbar user={user} isAdmin={isAdmin} />}
        <Routes>
          <Route path="/" element={user ? <UserDashboard user={user} isAdmin={isAdmin} /> : <Navigate to="/login" />} />
          <Route path="/login" element={!user ? <AuthPage /> : <Navigate to="/" />} />
          <Route path="/admin" element={isAdmin ? <AdminPanel /> : <Navigate to="/" />} />
        </Routes>
      </div>
    </Router>
  );
}