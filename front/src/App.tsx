import React, { useState, useEffect, useRef } from 'react';
import {
  User, Calendar, Home, Plus, FileText, Clock, ChevronRight, Search,
  Barcode, Flame, Droplet, Utensils, LogOut, Check, Bell, ChevronLeft,
  TrendingUp, X, Edit3, Save, Heart, AlertCircle, Award, MessageCircle,
  Video, Camera, Send, Loader2
} from 'lucide-react';
import * as api from './services/api';
import { NutritionProfile, Meal, HistoryDay, FoodItem, FoodAnalysis } from './models/nutrition';

/**
 * 🏋️‍♂️ SMART FIT NUTRITION SYSTEM - v4.0 API INTEGRATED
 * * Tecnologías: React + Tailwind CSS + FastAPI
 * Diseño: Brandbook Smart Fit (Amarillo #FFB700, Negro, Gris, Blanco)
 * Viewport: Optimizado para Mobile (simulación iPhone 14 Pro)
 */

// --- CONSTANTES ---
const QUICK_QUERIES = [
  "¿Qué comer pre-entreno?",
  "¿Suplementos recomendados?",
  "¿Cuánta agua beber?",
  "Sustitutos del azúcar"
];

// --- COMPONENTES UI REUTILIZABLES ---

const ButtonPrimary = ({ children, onClick, className = "", disabled = false }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`w-full bg-[#FFB700] active:bg-[#e5a500] text-black font-bold py-4 rounded-xl uppercase tracking-wide shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${className}`}
  >
    {children}
  </button>
);

const ButtonSecondary = ({ children, onClick, className = "" }: any) => (
  <button
    onClick={onClick}
    className={`w-full bg-white border border-gray-200 text-black font-semibold py-3 rounded-xl hover:bg-gray-50 transition-all ${className}`}
  >
    {children}
  </button>
);

const InputField = ({ label, type = "text", placeholder, value, onChange, name, className = "" }: any) => (
  <div className={`mb-4 ${className}`}>
    {label && <label className="block text-gray-500 text-xs font-bold mb-2 uppercase">{label}</label>}
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      name={name}
      onChange={onChange}
      className="w-full bg-white border border-gray-200 rounded-xl p-4 text-gray-900 focus:outline-none focus:border-[#FFB700] focus:ring-1 focus:ring-[#FFB700] transition-colors"
    />
  </div>
);

const SelectPill = ({ selected, label, onClick }: any) => (
  <button
    onClick={onClick}
    className={`px-4 py-3 rounded-xl text-sm font-bold border transition-all text-center flex-1 whitespace-nowrap
      ${selected
        ? 'bg-black text-[#FFB700] border-black shadow-md transform scale-105'
        : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'}`}
  >
    {label}
  </button>
);

const ProgressBar = ({ current, max, colorClass = "bg-[#FFB700]", label }: any) => {
  const percentage = Math.min(100, Math.max(0, (current / max) * 100));
  return (
    <div className="w-full">
      <div className="flex justify-between text-xs mb-1">
        <span className="font-bold text-gray-600">{label}</span>
        <span className="text-gray-400">{current}/{max}g</span>
      </div>
      <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${colorClass} transition-all duration-500 ease-out`}
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
};

const Card = ({ children, className = "" }: any) => (
  <div className={`bg-white p-5 rounded-2xl shadow-sm border border-gray-50 ${className}`}>
    {children}
  </div>
);

const Toast = ({ message, isVisible }: any) => (
  <div className={`fixed bottom-24 left-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-full shadow-xl transform transition-all duration-300 z-[60] flex items-center justify-center gap-2 pointer-events-none ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
    <Check size={18} className="text-[#2ECC71]" />
    <span className="font-medium text-sm">{message}</span>
  </div>
);

const FloatingChatButton = ({ onClick }: any) => (
  <button
    onClick={onClick}
    className="fixed bottom-24 right-4 w-14 h-14 bg-[#FFB700] rounded-full shadow-xl flex items-center justify-center text-black z-40 hover:scale-110 transition-transform active:scale-95 border-2 border-white"
  >
    <MessageCircle size={28} fill="black" className="text-black" />
  </button>
);

// --- PANTALLAS DE LA APLICACIÓN ---

const LoginScreen = ({ onLogin, onNavigateRegister }: any) => {
    // ... (CÓDIGO IGUAL AL ANTERIOR) ...
    const [credentials, setCredentials] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
  
    const handleChange = (e: any) => {
      setError('');
      setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async () => {
      setIsLoading(true);
      setError('');
      try {
        await onLogin(credentials.email, credentials.password);
      } catch (err) {
        setError('Email o contraseña incorrectos.');
        setIsLoading(false);
      }
    };
  
    return (
      <div className="flex flex-col h-full justify-center px-6 bg-white">
        <div className="mb-10 text-center">
          <div className="w-20 h-20 bg-black rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl">
            <span className="text-[#FFB700] text-4xl font-black italic">!</span>
          </div>
          <h1 className="text-3xl font-black text-black italic uppercase tracking-tight">Smart Fit <br /><span className="text-[#FFB700]">Nutri</span></h1>
          <p className="text-gray-500 mt-2">Tu complemento perfecto para entrenar</p>
        </div>
        <InputField label="Correo Electrónico" name="email" placeholder="ej. usuario@smartfit.com" value={credentials.email} onChange={handleChange} />
        <InputField label="Contraseña" name="password" type="password" placeholder="••••••••" value={credentials.password} onChange={handleChange} />
        {error && <p className="text-red-500 text-xs text-center mb-2">{error}</p>}
        <div className="flex justify-end mb-6">
          <button className="text-xs text-gray-500 font-medium hover:text-[#FFB700]">¿Olvidaste tu contraseña?</button>
        </div>
        <ButtonPrimary onClick={handleSubmit} disabled={isLoading} className="mb-4">
          {isLoading && <Loader2 size={20} className="animate-spin" />}
          Iniciar Sesión
        </ButtonPrimary>
        <div className="text-center">
          <span className="text-gray-400 text-sm">¿No tienes cuenta? </span>
          <button onClick={onNavigateRegister} className="text-black font-bold text-sm underline decoration-[#FFB700] decoration-2">Crear cuenta</button>
        </div>
      </div>
    );
  };

const RegisterScreen = ({ onRegister, onNavigateLogin }: any) => {
    // ... (CÓDIGO IGUAL AL ANTERIOR) ...
    const [formData, setFormData] = useState({ name: '', email: '', password: '', confirmPassword: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
  
    const handleChange = (e: any) => {
      setError('');
      setFormData({ ...formData, [e.target.name]: e.target.value });
    };
  
    const handleSubmit = async () => {
      if (formData.password !== formData.confirmPassword) {
        setError("Las contraseñas no coinciden.");
        return;
      }
      setIsLoading(true);
      setError('');
      try {
        await onRegister(formData.name, formData.email, formData.password);
      } catch (err: any) {
        console.error("Registration error:", err);
        let errorMessage = 'No se pudo crear la cuenta. Inténtalo de nuevo.';
  
        if (err.response?.data?.detail) {
          if (typeof err.response.data.detail === 'string') {
            errorMessage = err.response.data.detail;
          } else if (Array.isArray(err.response.data.detail)) {
            errorMessage = err.response.data.detail.map((e: any) => e.msg).join(', ');
          }
        } else if (err.message) {
          errorMessage = err.message;
        }
  
        setError(errorMessage);
        setIsLoading(false);
      }
    };
  
    return (
      <div className="flex flex-col h-full justify-center px-6 bg-white">
        <div className="mb-6">
          <button onClick={onNavigateLogin} className="flex items-center text-gray-500 mb-4 hover:text-black">
            <ChevronLeft size={20} /> Volver
          </button>
          <h1 className="text-3xl font-black text-black uppercase italic">Crear <span className="text-[#FFB700]">Cuenta</span></h1>
        </div>
        <div className="space-y-2 overflow-y-auto pb-4">
          <InputField label="Nombre Completo" name="name" placeholder="Tu nombre" value={formData.name} onChange={handleChange} />
          <InputField label="Correo Electrónico" name="email" placeholder="ej. usuario@smartfit.com" value={formData.email} onChange={handleChange} />
          <InputField label="Contraseña" name="password" type="password" placeholder="Mínimo 8 caracteres" value={formData.password} onChange={handleChange} />
          <InputField label="Confirmar Contraseña" name="confirmPassword" type="password" placeholder="Repite tu contraseña" value={formData.confirmPassword} onChange={handleChange} />
        </div>
        {error && <p className="text-red-500 text-xs text-center mb-2">{error}</p>}
        <ButtonPrimary onClick={handleSubmit} disabled={isLoading} className="mt-2 mb-4">
          {isLoading && <Loader2 size={20} className="animate-spin" />}
          Crear Cuenta
        </ButtonPrimary>
        <div className="text-center">
          <span className="text-gray-400 text-sm">¿Ya tienes cuenta? </span>
          <button onClick={onNavigateLogin} className="text-black font-bold text-sm underline decoration-[#FFB700] decoration-2">Iniciar sesión</button>
        </div>
      </div>
    );
  };

const ProfileFormScreen = ({ initialData, isEditing, onSave, onCancel }: any) => {
    // ... (CÓDIGO IGUAL AL ANTERIOR) ...
    const [formData, setFormData] = useState(initialData);
    const [newAllergy, setNewAllergy] = useState("");
  
    const handleAddAllergy = () => {
      if (newAllergy.trim() && !formData.allergies.includes(newAllergy.trim())) {
        setFormData({ ...formData, allergies: [...formData.allergies, newAllergy.trim()] });
        setNewAllergy("");
      }
    };
  
    const handleRemoveAllergy = (allergy: any) => {
      setFormData({ ...formData, allergies: formData.allergies.filter((a: any) => a !== allergy) });
    };
  
    const goals = ["Perder peso", "Ganar músculo", "Mantener", "Rendimiento"];
    const activities = ["Sedentario", "Ligero", "Moderado", "Intenso"];
  
    return (
      <div className="flex flex-col h-full bg-[#F4F6F8]">
        <div className="pt-12 px-6 pb-4 bg-white shadow-sm z-10 sticky top-0">
          <h1 className="text-2xl font-black text-black uppercase italic">
            {isEditing ? 'Editar ' : 'Configura tu '}
            <span className="text-[#FFB700]">Perfil</span>
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            {isEditing ? 'Actualiza tus datos para ajustar tu plan.' : 'Usaremos estos datos para personalizar tu plan.'}
          </p>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-6 pb-32">
          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Objetivo Principal</h3>
            <div className="grid grid-cols-2 gap-3">
              {goals.map(g => <SelectPill key={g} label={g} selected={formData.goal === g} onClick={() => setFormData({ ...formData, goal: g })} />)}
            </div>
          </section>
          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Datos Físicos</h3>
            <div className="grid grid-cols-2 gap-4">
              <InputField label="Peso (kg)" type="number" placeholder="70" value={formData.weight} onChange={(e: any) => setFormData({ ...formData, weight: e.target.value })} />
              <InputField label="Altura (cm)" type="number" placeholder="170" value={formData.height} onChange={(e: any) => setFormData({ ...formData, height: e.target.value })} />
              <InputField label="Edad" type="number" placeholder="25" value={formData.age} onChange={(e: any) => setFormData({ ...formData, age: e.target.value })} />
              <div className="mb-4">
                <label className="block text-gray-500 text-xs font-bold mb-2 uppercase">Sexo</label>
                <div className="flex bg-white rounded-xl border border-gray-200 p-1">
                  {['Femenino', 'Masculino'].map(s => (
                    <button key={s} onClick={() => setFormData({ ...formData, sex: s })} className={`flex-1 py-3 rounded-lg text-sm font-bold transition-colors ${formData.sex === s ? 'bg-gray-900 text-[#FFB700]' : 'text-gray-500'}`}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>
          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Nivel de Actividad</h3>
            <div className="grid grid-cols-2 gap-3">
              {activities.map(a => <SelectPill key={a} label={a} selected={formData.activityLevel === a} onClick={() => setFormData({ ...formData, activityLevel: a })} />)}
            </div>
          </section>
          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Alergias y Restricciones</h3>
            <div className="flex gap-2 mb-3">
              <input type="text" value={newAllergy} onChange={(e) => setNewAllergy(e.target.value)} placeholder="Ej. Gluten, Lactosa" className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FFB700]" />
              <button onClick={handleAddAllergy} className="bg-gray-900 text-white px-4 rounded-xl font-bold">+</button>
            </div>
            <div className="flex flex-wrap gap-2">
              {formData.allergies.map((allergy: any) => (
                <span key={allergy} className="flex items-center gap-1 pl-3 pr-2 py-1 bg-red-50 text-[#E74C3C] border border-red-100 rounded-full text-sm font-medium">
                  {allergy} <button onClick={() => handleRemoveAllergy(allergy)}><X size={14} /></button>
                </span>
              ))}
            </div>
          </section>
        </div>
        <div className="fixed bottom-0 w-full max-w-md bg-white p-4 border-t border-gray-100 flex gap-3 z-20">
          {isEditing && <ButtonSecondary onClick={onCancel} className="!py-4">Cancelar</ButtonSecondary>}
          <ButtonPrimary onClick={() => onSave(formData)}>{isEditing ? 'Guardar Cambios' : 'Guardar y Continuar'}</ButtonPrimary>
        </div>
      </div>
    );
  };

const DashboardScreen = ({ user, dashboardData, unreadNotificationsCount, onNavigate, nextAppointment }: any) => {
    // ... (CÓDIGO IGUAL AL ANTERIOR) ...
    if (!dashboardData) {
      return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-[#FFB700]" size={48} /></div>;
    }
    const { caloriesTarget, caloriesConsumed, macros } = dashboardData;
  
    return (
      <div className="pb-24">
        <div className="pt-12 pb-6 px-6 bg-white rounded-b-3xl shadow-sm z-10 relative">
          <div className="flex justify-between items-center mb-6">
            <div>
              <p className="text-gray-400 text-sm font-medium">¡Vamos con todo!</p>
              <h2 className="text-2xl font-bold text-black">Hola, {user.name}</h2>
            </div>
            <button onClick={() => onNavigate('notifications')} className="p-2 bg-gray-50 rounded-full relative hover:bg-gray-100 transition-colors">
              <Bell size={20} className="text-black" />
              {unreadNotificationsCount > 0 && (
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#E74C3C] rounded-full border border-white animate-pulse"></span>
              )}
            </button>
          </div>
  
          <div className="flex flex-col items-center justify-center mb-6">
            <div className="relative w-48 h-48 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90">
                <circle cx="96" cy="96" r="88" stroke="#F4F6F8" strokeWidth="12" fill="none" />
                <circle cx="96" cy="96" r="88" stroke="#FFB700" strokeWidth="12" fill="none" strokeDasharray={2 * Math.PI * 88} strokeDashoffset={2 * Math.PI * 88 * (1 - (caloriesConsumed / caloriesTarget))} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
              </svg>
              <div className="absolute flex flex-col items-center">
                <Flame className="text-[#FFB700] mb-1" size={24} fill="#FFB700" />
                <span className="text-3xl font-black text-black tabular-nums">{Math.max(0, caloriesTarget - caloriesConsumed)}</span>
                <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Kcal Restantes</span>
              </div>
            </div>
          </div>
  
          <div className="grid grid-cols-3 gap-4">
            <ProgressBar label="Proteína" current={macros.protein.current} max={macros.protein.target} colorClass="bg-[#FFB700]" />
            <ProgressBar label="Carbos" current={macros.carbs.current} max={macros.carbs.target} colorClass="bg-black" />
            <ProgressBar label="Grasas" current={macros.fat.current} max={macros.fat.target} colorClass="bg-gray-400" />
          </div>
        </div>
  
        <div className="px-4 mt-6 space-y-4">
          {nextAppointment && (
            <Card className="bg-black text-white border-none flex justify-between items-center animate-fade-in">
              <div>
                <p className="text-xs text-[#FFB700] font-bold uppercase mb-1">Próxima Cita</p>
                <h4 className="font-bold text-lg text-black">{nextAppointment.type}</h4>
                <p className="text-sm text-gray-400">{nextAppointment.date} a las {nextAppointment.time}</p>
              </div>
              <div className="bg-[#FFB700] p-2 rounded-full">
                <Video size={20} className="text-black" />
              </div>
            </Card>
          )}
  
          <div className="flex justify-between items-center px-2">
            <h3 className="font-bold text-lg">Próxima comida</h3>
            <button onClick={() => onNavigate('plan')} className="text-[#FFB700] text-sm font-bold">Ver plan</button>
          </div>
          <Card className="flex items-center gap-4 border-l-4 border-l-[#FFB700]">
            <div className="bg-yellow-50 p-3 rounded-xl">
              <Utensils size={24} className="text-[#FFB700]" />
            </div>
            <div>
              <p className="text-xs text-gray-400 font-bold uppercase mb-1">Almuerzo • 13:00 PM</p>
              <h4 className="font-bold text-gray-900">Pollo a la plancha con quinoa</h4>
              <p className="text-sm text-gray-500">450 Kcal • Alto en proteína</p>
            </div>
            <button onClick={() => onNavigate('speedLogger')} className="ml-auto w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center hover:bg-[#FFB700] transition-colors group">
              <Check size={20} className="text-gray-400 group-hover:text-black" />
            </button>
          </Card>
        </div>
      </div>
    )
  };

const SpeedLoggerScreen = ({ onBack, onAdd, recentFoods, favoriteFoods, onToggleFavorite }: any) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("recent");
  const [analysisResult, setAnalysisResult] = useState<FoodAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  
  // NUEVO: Estado para búsqueda global y manejo de foco
  const [databaseFoods, setDatabaseFoods] = useState<FoodItem[]>([]);
  const [isSearchActive, setIsSearchActive] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  // EFECTO: Ejecutar búsqueda cuando cambia el término o se activa la búsqueda
  useEffect(() => {
    // Si estamos en modo búsqueda (ya sea por foco o porque hay texto)
    if (isSearchActive) {
      const fetchFoods = async () => {
        setIsLoadingSearch(true);
        try {
          const results = await api.searchFoodsInDb(searchTerm);
          setDatabaseFoods(results);
        } catch (error) {
          console.error("Error searching foods:", error);
        } finally {
          setIsLoadingSearch(false);
        }
      };

      // Debounce simple para no saturar la API
      const timeoutId = setTimeout(() => {
        fetchFoods();
      }, 300); // 300ms de espera

      return () => clearTimeout(timeoutId);
    }
  }, [searchTerm, isSearchActive]);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setIsAnalyzing(true);
      setAnalysisResult(null);
      try {
        const result = await api.analyzeImage(file);
        setAnalysisResult(result);
      } catch (error) {
        console.error("Image analysis failed:", error);
        setAnalysisResult({ is_food: false, message: "Error al analizar la imagen." });
      } finally {
        setIsAnalyzing(false);
      }
    }
  };

  const handleSearchFocus = () => {
    setIsSearchActive(true);
  };

  const handleCancelSearch = () => {
    setIsSearchActive(false);
    setSearchTerm("");
    setDatabaseFoods([]);
  };

  // Determinar qué lista mostrar
  const getDisplayList = () => {
    if (isSearchActive) {
      return databaseFoods;
    }
    // Si no está buscando, muestra pestañas locales
    if (activeTab === "favorites") return favoriteFoods;
    return recentFoods;
  };

  const displayList = getDisplayList();

  return (
    <div className="h-full bg-white flex flex-col">
      <div className="pt-12 pb-2 px-4 border-b border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full">
            <ChevronLeft size={24} />
          </button>
          <h2 className="font-bold text-xl">Registrar comida</h2>
        </div>

        {/* Buscador y Tabs */}
        {activeTab !== 'scan' && (
          <>
            <div className="relative mb-2 flex items-center gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
                <input
                  type="text"
                  placeholder="¿Qué comiste hoy?"
                  className="w-full bg-gray-100 pl-12 pr-12 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFB700] transition-all"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={handleSearchFocus}
                />
                {isSearchActive ? (
                   <button onClick={handleCancelSearch} className="absolute right-4 top-3.5 text-gray-500 hover:text-black">
                     <X size={20} />
                   </button>
                ) : (
                   <Barcode className="absolute right-4 top-3.5 text-gray-500" size={20} />
                )}
              </div>
            </div>

            {/* Ocultar Tabs si está buscando */}
            {!isSearchActive && (
              <div className="flex gap-6 mt-4 px-2 overflow-x-auto no-scrollbar">
                <button onClick={() => setActiveTab("recent")} className={`pb-2 border-b-2 font-bold whitespace-nowrap ${activeTab === 'recent' ? 'border-[#FFB700] text-black' : 'border-transparent text-gray-400'}`}>Recientes</button>
                <button onClick={() => setActiveTab("favorites")} className={`pb-2 border-b-2 font-bold whitespace-nowrap ${activeTab === 'favorites' ? 'border-[#FFB700] text-black' : 'border-transparent text-gray-400'}`}>Favoritos</button>
                <button onClick={() => setActiveTab("scan")} className={`pb-2 border-b-2 font-bold whitespace-nowrap ${activeTab === 'scan' ? 'border-[#FFB700] text-black' : 'border-transparent text-gray-400'}`}>Escanear</button>
              </div>
            )}
          </>
        )}
        
        {/* Título simple si estamos escaneando */}
        {activeTab === 'scan' && !isSearchActive && (
             <div className="flex gap-6 mt-4 px-2 overflow-x-auto no-scrollbar">
                <button onClick={() => setActiveTab("recent")} className={`pb-2 border-b-2 font-bold whitespace-nowrap border-transparent text-gray-400`}>Recientes</button>
                <button onClick={() => setActiveTab("favorites")} className={`pb-2 border-b-2 font-bold whitespace-nowrap border-transparent text-gray-400`}>Favoritos</button>
                <button onClick={() => setActiveTab("scan")} className={`pb-2 border-b-2 font-bold whitespace-nowrap border-[#FFB700] text-black`}>Escanear</button>
             </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'scan' && !isSearchActive ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-8 pb-20">
            <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
            <div className="w-32 h-32 bg-gray-100 rounded-3xl flex items-center justify-center mb-6 border-2 border-dashed border-gray-300">
              <Camera size={48} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Analiza tu comida</h3>
            <p className="text-gray-500 text-sm mb-8">Toma una foto de tu plato para obtener un estimado de calorías, proteínas y grasas.</p>
            <ButtonPrimary onClick={() => fileInputRef.current?.click()} disabled={isAnalyzing}>
              {isAnalyzing ? <Loader2 size={20} className="animate-spin" /> : <Camera size={20} />}
              {isAnalyzing ? 'Analizando...' : 'Abrir Cámara'}
            </ButtonPrimary>
            {analysisResult && (
              <Card className="mt-6 w-full text-left">
                {analysisResult.is_food ? (
                  <div>
                    <h4 className="font-bold text-lg mb-2">Análisis Nutricional</h4>
                    <p><strong>Calorías:</strong> {analysisResult.calories ?? 'N/A'} kcal</p>
                    <p><strong>Proteínas:</strong> {analysisResult.protein ?? 'N/A'} g</p>
                    <p><strong>Grasas:</strong> {analysisResult.fat ?? 'N/A'} g</p>
                    <ButtonPrimary
                      onClick={() => onAdd("Comida escaneada", analysisResult.calories)}
                      className="mt-4"
                    >
                      Registrar (+{analysisResult.calories ?? 300} kcal)
                    </ButtonPrimary>
                  </div>
                ) : (
                  <p className="text-red-500">{analysisResult.message}</p>
                )}
              </Card>
            )}
          </div>
        ) : (
          <div className="space-y-2">
            {isLoadingSearch && isSearchActive ? (
                <div className="flex justify-center p-4"><Loader2 className="animate-spin text-[#FFB700]" /></div>
            ) : (
                displayList.map((food) => {
                const isFav = favoriteFoods.some((fav: any) => fav.id === food.id);
                return (
                    <div key={food.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:border-[#FFB700] transition-colors bg-white group">
                    <div className="flex items-center gap-3 flex-1">
                        <button onClick={(e) => { e.stopPropagation(); onToggleFavorite(food); }} className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-[#E74C3C] transition-colors">
                        <Heart size={20} fill={isFav ? "#E74C3C" : "none"} className={isFav ? "text-[#E74C3C]" : ""} />
                        </button>
                        <div>
                        <p className="font-bold text-gray-900">{food.name}</p>
                        <p className="text-xs text-gray-500">{food.detail}</p>
                        </div>
                    </div>
                    <button onClick={() => onAdd(food.name, undefined, food.detail)} className="w-10 h-10 bg-[#F4F6F8] rounded-full flex items-center justify-center text-[#FFB700] group-hover:bg-[#FFB700] group-hover:text-black transition-all active:scale-90 ml-2">
                        <Plus size={20} />
                    </button>
                    </div>
                );
                })
            )}
            {/* Mensaje si no hay resultados en búsqueda */}
            {isSearchActive && !isLoadingSearch && displayList.length === 0 && (
                <div className="text-center py-8 text-gray-400">
                    No se encontraron alimentos
                </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const PlanScreen = ({ nutritionProfile, mealPlan }: any) => (
    // ... (CÓDIGO IGUAL AL ANTERIOR) ...
    <div className="pt-12 px-4 pb-24">
      <h2 className="text-2xl font-black italic uppercase mb-6 text-black">Mi Plan <span className="text-[#FFB700]">Nutricional</span></h2>
      <Card className="mb-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white border-none">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-gray-400 text-xs uppercase font-bold mb-1">Objetivo Actual</p>
            <h3 className="text-xl font-bold text-[#FFB700]">{nutritionProfile.goal || 'No definido'}</h3>
            <p className="text-sm text-gray-300 mt-1">Meta: 1800 Kcal / día</p> {/* This should come from backend */}
          </div>
          <TrendingUp className="text-[#FFB700]" size={24} />
        </div>
      </Card>
      <div className="space-y-4">
        {mealPlan.map((meal: any, idx: any) => (
          <Card key={idx} className="relative overflow-hidden">
            <div className="absolute top-0 left-0 w-1 h-full bg-[#FFB700]"></div>
            <div className="pl-2">
              <div className="flex justify-between mb-2">
                <span className="text-xs font-bold text-[#FFB700] uppercase tracking-wider">{meal.type}</span>
                <span className="text-xs font-bold text-gray-900">{meal.kcal} Kcal</span>
              </div>
              <h4 className="font-bold text-lg mb-2">{meal.name}</h4>
              <div className="inline-block px-2 py-1 bg-gray-100 rounded-md">
                <span className="text-xs text-gray-600 font-medium">{meal.macros}</span>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <button className="w-full mt-8 py-4 text-gray-400 font-medium text-sm hover:text-[#FFB700] transition-colors">
        Solicitar ajuste a mi nutricionista
      </button>
    </div>
  );

const ProfileScreen = ({ user, nutritionProfile, onNavigateEdit, onLogout }: any) => (
    // ... (CÓDIGO IGUAL AL ANTERIOR) ...
    <div className="pt-12 px-4 pb-24">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-20 h-20 bg-gray-200 rounded-full border-4 border-white shadow-md flex items-center justify-center text-2xl">
          👤
        </div>
        <div>
          <h2 className="text-2xl font-bold">{user.name}</h2>
          <p className="text-gray-500 text-sm">{user.email}</p>
          <div className="mt-2 bg-[#FFB700] text-black text-xs font-bold px-2 py-1 rounded inline-block">
            PLAN BLACK
          </div>
        </div>
      </div>
      <div className="space-y-4 mb-8">
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-bold text-sm uppercase text-gray-400">Datos Físicos</h3>
            <button onClick={onNavigateEdit} className="text-[#FFB700]"><Edit3 size={18} /></button>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><p className="text-xs text-gray-500">Peso</p><p className="font-bold text-lg">{nutritionProfile.weight || '--'} kg</p></div>
            <div><p className="text-xs text-gray-500">Altura</p><p className="font-bold text-lg">{nutritionProfile.height || '--'} cm</p></div>
            <div><p className="text-xs text-gray-500">Edad</p><p className="font-bold text-lg">{nutritionProfile.age || '--'} años</p></div>
            <div><p className="text-xs text-gray-500">Actividad</p><p className="font-bold text-lg truncate">{nutritionProfile.activityLevel || '--'}</p></div>
          </div>
        </Card>
        <Card>
          <h3 className="font-bold text-sm uppercase text-gray-400 mb-4">Alergias y Restricciones</h3>
          <div className="flex flex-wrap gap-2">
            {nutritionProfile.allergies && nutritionProfile.allergies.length > 0 ? (
              nutritionProfile.allergies.map((allergy: any) => (
                <span key={allergy} className="px-3 py-1 bg-red-50 text-[#E74C3C] border border-red-100 rounded-full text-sm font-medium">
                  {allergy}
                </span>
              ))
            ) : (
              <p className="text-sm text-gray-400 italic">Sin restricciones registradas</p>
            )}
          </div>
        </Card>
      </div>
      <ButtonSecondary onClick={onNavigateEdit} className="border-red-100 text-[#E74C3C] hover:bg-red-50 mb-4">
        Editar Perfil Nutricional
      </ButtonSecondary>
      <button onClick={onLogout} className="w-full flex items-center justify-center gap-2 text-gray-400 py-4 font-medium hover:text-black transition-colors">
        <LogOut size={18} /> Cerrar Sesión
      </button>
    </div>
  );

const HistoryScreen = ({ history }: any) => (
    // ... (CÓDIGO IGUAL AL ANTERIOR) ...
    <div className="pt-12 px-4 pb-24">
      <h2 className="text-2xl font-black italic uppercase mb-6">Historial</h2>
      <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
        <button className="px-4 py-2 bg-black text-[#FFB700] rounded-full text-sm font-bold whitespace-nowrap">Últimos 7 días</button>
        <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-full text-sm font-medium whitespace-nowrap">Últimos 30 días</button>
      </div>
      <div className="space-y-3">
        {history.map((day: any, idx: any) => {
          const isSuccess = day.status === 'success';
          const isWarning = day.status === 'warning';
          const percentage = Math.min(100, (day.calories / day.target) * 100);
          return (
            <Card key={idx} className="flex items-center justify-between py-4">
              <div className="w-16"><p className="font-bold text-gray-900">{day.date}</p></div>
              <div className="flex-1 px-4">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-500">{day.calories} kcal</span>
                  <span className="text-gray-400">Meta: {day.target}</span>
                </div>
                <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                  <div className={`h-full rounded-full ${isSuccess ? 'bg-[#2ECC71]' : isWarning ? 'bg-[#E74C3C]' : 'bg-[#FFB700]'}`} style={{ width: `${percentage}%` }}></div>
                </div>
              </div>
              <div className={`w-8 flex justify-end ${isSuccess ? 'text-[#2ECC71]' : isWarning ? 'text-[#E74C3C]' : 'text-[#FFB700]'}`}>
                {isSuccess ? <Check size={20} /> : isWarning ? <span className="font-bold">!</span> : <Clock size={20} />}
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );

const NotificationsScreen = ({ notifications, onBack }: any) => {
    // ... (CÓDIGO IGUAL AL ANTERIOR) ...
    return (
      <div className="h-full bg-[#F4F6F8] flex flex-col">
        <div className="pt-12 pb-4 px-6 bg-white shadow-sm z-10 sticky top-0 flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full -ml-2">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-black">Notificaciones</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
              <Bell size={48} className="mb-4 opacity-20" />
              <p>No tienes notificaciones</p>
            </div>
          ) : (
            notifications.map((notif: any) => {
              let icon = <Bell size={20} className="text-gray-500" />;
              let bgIcon = "bg-gray-100";
              let borderClass = "border-transparent";
              if (notif.type === 'alert') {
                icon = <AlertCircle size={20} className="text-[#E74C3C]" />;
                bgIcon = "bg-red-50";
                borderClass = "border-l-4 border-l-[#E74C3C]";
              } else if (notif.type === 'goal') {
                icon = <Award size={20} className="text-[#2ECC71]" />;
                bgIcon = "bg-green-50";
                borderClass = "border-l-4 border-l-[#2ECC71]";
              }
              return (
                <div key={notif.id} className={`bg-white p-4 rounded-2xl shadow-sm border flex gap-4 ${borderClass} ${notif.isRead ? 'opacity-70' : 'opacity-100'}`}>
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${bgIcon}`}>{icon}</div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start">
                      <h4 className={`text-sm font-bold ${notif.type === 'alert' ? 'text-[#E74C3C]' : 'text-gray-900'}`}>{notif.title}</h4>
                      <span className="text-xs text-gray-400 whitespace-nowrap ml-2">{notif.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 mt-1 leading-relaxed">{notif.description}</p>
                  </div>
                  {!notif.isRead && <div className="w-2 h-2 bg-[#FFB700] rounded-full mt-2"></div>}
                </div>
              );
            })
          )}
        </div>
      </div>
    );
  };

const ConsultasScreen = ({ onBack, showToast, setNextAppointment }: any) => {
    // ... (CÓDIGO IGUAL AL ANTERIOR) ...
    const [queryText, setQueryText] = useState("");
    const [selectedDate, setSelectedDate] = useState("Mañana");
    const [selectedTime, setSelectedTime] = useState("10:00");
  
    const handleSendQuery = () => {
      if (!queryText.trim()) return;
      showToast("Consulta enviada. Te responderemos pronto.");
      setQueryText("");
    };
  
    const handleQuickQuery = (topic: any) => {
      showToast(`Consulta sobre "${topic}" enviada.`);
    };
  
    const handleSchedule = async () => {
      try {
        await api.scheduleAppointment({ date: selectedDate, time: selectedTime, type: "Videollamada" });
        setNextAppointment({ date: selectedDate, time: selectedTime, type: "Videollamada" });
        showToast("¡Cita agendada correctamente!");
        setTimeout(onBack, 1500);
      } catch (error) {
        showToast("Error al agendar la cita.");
      }
    };
  
    return (
      <div className="h-full bg-[#F4F6F8] flex flex-col">
        <div className="pt-12 pb-4 px-6 bg-white shadow-sm z-10 sticky top-0 flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-gray-100 rounded-full -ml-2">
            <ChevronLeft size={24} />
          </button>
          <h1 className="text-xl font-bold text-black">Consultas y Citas</h1>
        </div>
        <div className="flex-1 overflow-y-auto p-4 space-y-6 pb-32">
          <section>
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Preguntas Frecuentes</h3>
            <div className="flex flex-wrap gap-2">
              {QUICK_QUERIES.map((q, idx) => (
                <button key={idx} onClick={() => handleQuickQuery(q)} className="px-3 py-2 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:border-[#FFB700] hover:text-black transition-colors">
                  {q}
                </button>
              ))}
            </div>
          </section>
          <Card>
            <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Escribe a tu nutricionista</h3>
            <textarea value={queryText} onChange={(e) => setQueryText(e.target.value)} placeholder="Hola, tengo una duda sobre..." className="w-full bg-gray-50 border border-gray-200 rounded-xl p-4 text-sm focus:outline-none focus:border-[#FFB700] min-h-[100px] mb-4" />
            <div className="flex justify-end">
              <button onClick={handleSendQuery} disabled={!queryText.trim()} className="bg-black text-[#FFB700] px-6 py-3 rounded-xl font-bold text-sm flex items-center gap-2 disabled:opacity-50">
                Enviar <Send size={16} />
              </button>
            </div>
          </Card>
          <Card className="border-l-4 border-l-[#FFB700]">
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-yellow-50 p-3 rounded-full"><Video size={24} className="text-[#FFB700]" /></div>
              <div><h3 className="font-bold text-lg">Agendar Cita</h3><p className="text-xs text-gray-500">Modalidad: Videollamada</p></div>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Fecha</p>
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  {["Hoy", "Mañana", "Jueves", "Viernes"].map(d => <SelectPill key={d} label={d} selected={selectedDate === d} onClick={() => setSelectedDate(d)} />)}
                </div>
              </div>
              <div>
                <p className="text-xs font-bold text-gray-400 uppercase mb-2">Hora</p>
                <div className="flex gap-2 overflow-x-auto no-scrollbar">
                  {["09:00", "10:00", "16:00", "18:00"].map(t => <SelectPill key={t} label={t} selected={selectedTime === t} onClick={() => setSelectedTime(t)} />)}
                </div>
              </div>
              <ButtonPrimary onClick={handleSchedule} className="mt-2">Confirmar Cita</ButtonPrimary>
            </div>
          </Card>
        </div>
      </div>
    );
  };

// --- NAVEGACIÓN GLOBAL ---

const BottomNavBar = ({ currentScreen, onNavigate }: any) => {
    // ... (CÓDIGO IGUAL AL ANTERIOR) ...
    const navItems = [
      { id: 'home', icon: Home, label: 'Inicio' },
      { id: 'plan', icon: FileText, label: 'Plan' },
      { id: 'speedLogger', icon: Plus, label: '', isFab: true },
      { id: 'history', icon: Calendar, label: 'Historial' },
      { id: 'profile', icon: User, label: 'Perfil' },
    ];
  
    return (
      <div className="fixed bottom-0 w-full max-w-md bg-white border-t border-gray-100 pb-6 pt-2 px-2 flex justify-around items-end z-50">
        {navItems.map((item) => {
          if (item.isFab) {
            return (
              <div key={item.id} className="relative -top-5">
                <button onClick={() => onNavigate('speedLogger')} className="w-14 h-14 bg-[#FFB700] rounded-full shadow-lg shadow-yellow-200 flex items-center justify-center text-black transform transition-transform active:scale-95">
                  <Plus size={32} strokeWidth={2.5} />
                </button>
              </div>
            );
          }
          const isActive = currentScreen === item.id;
          return (
            <button key={item.id} onClick={() => onNavigate(item.id)} className={`flex flex-col items-center justify-center w-14 h-12 space-y-1 ${isActive ? 'text-black' : 'text-gray-400'}`}>
              <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    );
  };
  
  const App = () => {
    // ... (CÓDIGO IGUAL AL ANTERIOR) ...
    const [user, setUser] = useState<any>(null);
    const [currentScreen, setCurrentScreen] = useState('login');
    const [isLoading, setIsLoading] = useState(true);
  
    // App Data State
    const [nutritionProfile, setNutritionProfile] = useState<NutritionProfile | null>(null);
    const [mealPlan, setMealPlan] = useState<Meal[]>([]);
    const [history, setHistory] = useState<HistoryDay[]>([]);
    const [recentFoods, setRecentFoods] = useState<FoodItem[]>([]);
    const [favoriteFoods, setFavoriteFoods] = useState<FoodItem[]>([]);
    const [dashboardData, setDashboardData] = useState<any>(null);
  
    // UI State
    const [notifications, setNotifications] = useState([]); // Mocked for now
    const [nextAppointment, setNextAppointment] = useState<any>(null); // Mocked for now
    const [toast, setToast] = useState({ show: false, message: '' });
  
    // Check for token on initial load
    useEffect(() => {
      const token = localStorage.getItem('authToken');
      if (token) {
        // Restore user from localStorage
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
        fetchInitialData();
      } else {
        setIsLoading(false);
      }
    }, []);
  
    const fetchInitialData = async () => {
      setIsLoading(true);
      try {
        const [profileData, planData, historyData, recentFoodsData, dashboardData, notificationsData, appointmentData] = await Promise.all([
          api.getProfile(),
          api.getPlan(),
          api.getHistory(),
          api.getRecentFoods(),
          api.getDashboardData(),
          api.getNotifications(),
          api.getNextAppointment()
        ]);
        setNutritionProfile(profileData);
        setMealPlan(planData);
        setHistory(historyData);
        setRecentFoods(recentFoodsData);
        // The dashboard state will be set here
        setDashboardData(dashboardData);
        setNotifications(notificationsData);
        setNextAppointment(appointmentData);
  
        if (!profileData || profileData.goal === 'No definido') {
          setCurrentScreen('onboardingProfile');
        } else {
          setCurrentScreen('home');
        }
      } catch (error) {
        console.error("Failed to fetch initial data", error);
        // If token is invalid, logout
        handleLogout();
      } finally {
        setIsLoading(false);
      }
    };
  
    const showToast = (msg: any) => {
      setToast({ show: true, message: msg });
      setTimeout(() => setToast({ show: false, message: '' }), 3000);
    };
  
    const handleLogin = async (email: any, password: any) => {
      const data = await api.login(email, password);
      setUser({ name: data.user.name, email }); // Use name from API
      await fetchInitialData();
    };
  
    const handleRegister = async (name: any, email: any, password: any) => {
      await api.register(name, email, password);
      // After register, log the user in
      await handleLogin(email, password);
    };
  
    const handleSaveProfile = async (data: any) => {
      const savedProfile = await api.saveProfile(data);
      setNutritionProfile(savedProfile);
      if (currentScreen === 'onboardingProfile') {
        setCurrentScreen('home');
        showToast("¡Perfil creado con éxito!");
      } else {
        setCurrentScreen('profile');
        showToast("Perfil actualizado");
      }
    };
  
    const handleLogout = () => {
      api.logout();
      setUser(null);
      setNutritionProfile(null);
      setCurrentScreen('login');
    };
  
    const handleToggleFavorite = (foodItem: any) => {
      // This would ideally be an API call
      const exists = favoriteFoods.some(f => f.id === foodItem.id);
      if (exists) {
        setFavoriteFoods(favoriteFoods.filter(f => f.id !== foodItem.id));
      } else {
        setFavoriteFoods([...favoriteFoods, foodItem]);
      }
    };
  
    const handleAddFood = async (foodName: string, calories?: number, detail?: string) => {
      let kcal = calories;
      if (kcal === undefined && detail) {
        const match = detail.match(/•\s*(\d+)\s*Kcal/);
        if (match) {
          kcal = parseInt(match[1]);
        }
      }
  
      await api.logFood(foodName, kcal);
      showToast(`Agregado: ${foodName}`);
      // Refresh recent foods AND dashboard data
      const [recentFoodsData, dashboardData] = await Promise.all([
        api.getRecentFoods(),
        api.getDashboardData()
      ]);
      setRecentFoods(recentFoodsData);
      setDashboardData(dashboardData);
    }
  
    const renderScreen = () => {
      if (isLoading) {
        return <div className="flex items-center justify-center h-full"><Loader2 className="animate-spin text-[#FFB700]" size={48} /></div>;
      }
  
      if (!user) {
        if (currentScreen === 'register') return <RegisterScreen onRegister={handleRegister} onNavigateLogin={() => setCurrentScreen('login')} />;
        return <LoginScreen onLogin={handleLogin} onNavigateRegister={() => setCurrentScreen('register')} />;
      }
  
  
  
      switch (currentScreen) {
        case 'onboardingProfile':
          return <ProfileFormScreen initialData={nutritionProfile || { goal: 'Perder peso', weight: '', height: '', age: '', sex: 'Femenino', activityLevel: 'Moderado', allergies: [] }} isEditing={false} onSave={handleSaveProfile} onCancel={() => { }} />;
  
        case 'editProfile':
          return <ProfileFormScreen initialData={nutritionProfile} isEditing={true} onSave={handleSaveProfile} onCancel={() => setCurrentScreen('profile')} />;
  
        case 'notifications':
          return <NotificationsScreen notifications={notifications} onBack={() => setCurrentScreen('home')} />;
  
        case 'consultas':
          return <ConsultasScreen onBack={() => setCurrentScreen('home')} showToast={showToast} setNextAppointment={setNextAppointment} />;
  
        case 'home':
          return <DashboardScreen user={user} dashboardData={dashboardData} unreadNotificationsCount={notifications.filter((n: any) => !n.isRead).length} onNavigate={setCurrentScreen} nextAppointment={nextAppointment} />;
  
        case 'plan':
          return <PlanScreen nutritionProfile={nutritionProfile} mealPlan={mealPlan} />;
  
        case 'profile':
          return <ProfileScreen user={user} nutritionProfile={nutritionProfile} onNavigateEdit={() => setCurrentScreen('editProfile')} onLogout={handleLogout} />;
  
        case 'history':
          return <HistoryScreen history={history} />;
  
        case 'speedLogger':
          return <SpeedLoggerScreen onBack={() => setCurrentScreen('home')} onAdd={handleAddFood} recentFoods={recentFoods} favoriteFoods={favoriteFoods} onToggleFavorite={handleToggleFavorite} />;
  
        default: return <DashboardScreen user={user} dashboardData={dashboardData} onNavigate={setCurrentScreen} />;
      }
    };
  
    const hideBottomNav = !user || ['onboardingProfile', 'editProfile', 'notifications', 'consultas'].includes(currentScreen);
    const showChatBubble = user && currentScreen === 'home';
  
    return (
      <div className="min-h-screen bg-[#F4F6F8] font-sans text-gray-900 flex justify-center">
        <div className="w-full max-w-md bg-[#F4F6F8] min-h-screen relative shadow-2xl overflow-hidden border-x border-gray-100">
  
          {renderScreen()}
  
          {showChatBubble && <FloatingChatButton onClick={() => setCurrentScreen('consultas')} />}
  
          <Toast message={toast.message} isVisible={toast.show} />
  
          {!hideBottomNav && <BottomNavBar currentScreen={currentScreen} onNavigate={setCurrentScreen} />}
  
        </div>
      </div>
    );
  };
  
  export default App;
