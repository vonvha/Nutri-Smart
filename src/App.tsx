import React, { useState, useEffect } from 'react';
import { 
  User, Calendar, Home, Plus, FileText, Clock, ChevronRight, Search, 
  Barcode, Flame, Droplet, Utensils, LogOut, Check, Bell, ChevronLeft, 
  TrendingUp, X, Edit3, Save, Heart, AlertCircle, Award, MessageCircle, 
  Video, Camera, Send 
} from 'lucide-react';

/**
 * 🏋️‍♂️ SMART FIT NUTRITION SYSTEM - PROTOTIPO COMPLETO v3.0
 * * Tecnologías: React + Tailwind CSS
 * Diseño: Brandbook Smart Fit (Amarillo #FFB700, Negro, Gris, Blanco)
 * Viewport: Optimizado para Mobile (simulación iPhone 14 Pro)
 */

// --- 1. MOCK DATA & CONSTANTES ---

const MOCK_AUTH_USER = {
  name: "Carla",
  email: "carla.fit@smartfit.com",
};

const MOCK_DASHBOARD_DATA = {
  caloriesTarget: 1800,
  caloriesConsumed: 1200,
  macros: {
    protein: { current: 90, target: 140 },
    carbs: { current: 110, target: 180 },
    fat: { current: 40, target: 60 }
  }
};

const MOCK_HISTORY = [
  { date: "Hoy", calories: 1200, target: 1800, status: "inprogress" },
  { date: "Ayer", calories: 1750, target: 1800, status: "success" },
  { date: "20 Nov", calories: 2100, target: 1800, status: "warning" },
  { date: "19 Nov", calories: 1800, target: 1800, status: "success" },
  { date: "18 Nov", calories: 1650, target: 1800, status: "success" },
];

const MOCK_MEALS = [
  { type: "Desayuno", name: "Avena con proteína", kcal: 450, macros: "30P • 50C • 10G" },
  { type: "Almuerzo", name: "Pollo a la plancha y arroz", kcal: 600, macros: "45P • 60C • 15G" },
  { type: "Snack", name: "Manzana y almendras", kcal: 200, macros: "5P • 25C • 10G" },
  { type: "Cena", name: "Ensalada con atún", kcal: 350, macros: "35P • 10C • 15G" },
];

const MOCK_RECENT_FOODS = [
  { id: 1, name: "Pechuga de Pollo", detail: "100g • 165 Kcal" },
  { id: 2, name: "Arroz Integral", detail: "1 taza • 216 Kcal" },
  { id: 3, name: "Huevo Cocido", detail: "1 unidad • 78 Kcal" },
  { id: 4, name: "Plátano", detail: "1 unidad mediana • 105 Kcal" },
  { id: 5, name: "Batido Whey Protein", detail: "1 scoop • 120 Kcal" },
  { id: 6, name: "Yogur Griego", detail: "1 taza • 120 Kcal" },
];

const INITIAL_NOTIFICATIONS = [
  { id: 1, title: "Recordatorio", description: "No olvides registrar tu almuerzo", type: "reminder", time: "Hace 2h", isRead: false },
  { id: 2, title: "¡Meta cumplida!", description: "Alcanzaste tu objetivo de proteína ayer", type: "goal", time: "Hace 1d", isRead: false },
  { id: 3, title: "Alerta de consumo", description: "Has superado tu meta de grasas hoy", type: "alert", time: "Hace 30m", isRead: true },
];

const QUICK_QUERIES = [
  "¿Qué comer pre-entreno?",
  "¿Suplementos recomendados?",
  "¿Cuánta agua beber?",
  "Sustitutos del azúcar"
];

// --- 2. COMPONENTES UI REUTILIZABLES ---

const ButtonPrimary = ({ children, onClick, className = "", disabled = false }) => (
  <button 
    onClick={onClick}
    disabled={disabled}
    className={`w-full bg-[#FFB700] active:bg-[#e5a500] text-black font-bold py-4 rounded-xl uppercase tracking-wide shadow-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed ${className}`}
  >
    {children}
  </button>
);

const ButtonSecondary = ({ children, onClick, className = "" }) => (
  <button 
    onClick={onClick}
    className={`w-full bg-white border border-gray-200 text-black font-semibold py-3 rounded-xl hover:bg-gray-50 transition-all ${className}`}
  >
    {children}
  </button>
);

const InputField = ({ label, type = "text", placeholder, value, onChange, className = "" }) => (
  <div className={`mb-4 ${className}`}>
    {label && <label className="block text-gray-500 text-xs font-bold mb-2 uppercase">{label}</label>}
    <input 
      type={type} 
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="w-full bg-white border border-gray-200 rounded-xl p-4 text-gray-900 focus:outline-none focus:border-[#FFB700] focus:ring-1 focus:ring-[#FFB700] transition-colors"
    />
  </div>
);

const SelectPill = ({ selected, label, onClick }) => (
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

const ProgressBar = ({ current, max, colorClass = "bg-[#FFB700]", label }) => {
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

const Card = ({ children, className = "" }) => (
  <div className={`bg-white p-5 rounded-2xl shadow-sm border border-gray-50 ${className}`}>
    {children}
  </div>
);

const Toast = ({ message, isVisible }) => (
  <div className={`fixed bottom-24 left-4 right-4 bg-gray-900 text-white px-6 py-3 rounded-full shadow-xl transform transition-all duration-300 z-[60] flex items-center justify-center gap-2 pointer-events-none ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
    <Check size={18} className="text-[#2ECC71]" />
    <span className="font-medium text-sm">{message}</span>
  </div>
);

const FloatingChatButton = ({ onClick }) => (
  <button 
    onClick={onClick}
    className="fixed bottom-24 right-4 w-14 h-14 bg-[#FFB700] rounded-full shadow-xl flex items-center justify-center text-black z-40 hover:scale-110 transition-transform active:scale-95 border-2 border-white"
  >
    <MessageCircle size={28} fill="black" className="text-black" />
  </button>
);

// --- 3. PANTALLAS DE LA APLICACIÓN ---

// 3.1 LOGIN
const LoginScreen = ({ onLogin, onNavigateRegister }) => (
  <div className="flex flex-col h-full justify-center px-6 bg-white">
    <div className="mb-10 text-center">
      <div className="w-20 h-20 bg-black rounded-full mx-auto mb-4 flex items-center justify-center shadow-xl">
        <span className="text-[#FFB700] text-4xl font-black italic">!</span>
      </div>
      <h1 className="text-3xl font-black text-black italic uppercase tracking-tight">Smart Fit <br/><span className="text-[#FFB700]">Nutri</span></h1>
      <p className="text-gray-500 mt-2">Tu complemento perfecto para entrenar</p>
    </div>
    <InputField label="Correo Electrónico" placeholder="ej. usuario@smartfit.com" />
    <InputField label="Contraseña" type="password" placeholder="••••••••" />
    <div className="flex justify-end mb-6">
      <button className="text-xs text-gray-500 font-medium hover:text-[#FFB700]">¿Olvidaste tu contraseña?</button>
    </div>
    <ButtonPrimary onClick={onLogin} className="mb-4">Iniciar Sesión</ButtonPrimary>
    <div className="text-center">
      <span className="text-gray-400 text-sm">¿No tienes cuenta? </span>
      <button onClick={onNavigateRegister} className="text-black font-bold text-sm underline decoration-[#FFB700] decoration-2">Crear cuenta</button>
    </div>
  </div>
);

// 3.2 REGISTRO
const RegisterScreen = ({ onRegister, onNavigateLogin }) => (
  <div className="flex flex-col h-full justify-center px-6 bg-white">
    <div className="mb-6">
       <button onClick={onNavigateLogin} className="flex items-center text-gray-500 mb-4 hover:text-black">
         <ChevronLeft size={20} /> Volver
       </button>
      <h1 className="text-3xl font-black text-black uppercase italic">Crear <span className="text-[#FFB700]">Cuenta</span></h1>
    </div>
    <div className="space-y-2 overflow-y-auto pb-4">
      <InputField label="Nombre Completo" placeholder="Tu nombre" />
      <InputField label="Correo Electrónico" placeholder="ej. usuario@smartfit.com" />
      <InputField label="Contraseña" type="password" placeholder="Mínimo 8 caracteres" />
      <InputField label="Confirmar Contraseña" type="password" placeholder="Repite tu contraseña" />
    </div>
    <ButtonPrimary onClick={onRegister} className="mt-2 mb-4">Crear Cuenta</ButtonPrimary>
    <div className="text-center">
      <span className="text-gray-400 text-sm">¿Ya tienes cuenta? </span>
      <button onClick={onNavigateLogin} className="text-black font-bold text-sm underline decoration-[#FFB700] decoration-2">Iniciar sesión</button>
    </div>
  </div>
);

// 3.3 PERFIL / ONBOARDING / EDICIÓN
const ProfileFormScreen = ({ initialData, isEditing, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    goal: initialData.goal || 'Perder peso',
    weight: initialData.weight || '',
    height: initialData.height || '',
    age: initialData.age || '',
    sex: initialData.sex || 'Femenino',
    activityLevel: initialData.activityLevel || 'Moderado',
    allergies: initialData.allergies || []
  });
  
  const [newAllergy, setNewAllergy] = useState("");

  const handleAddAllergy = () => {
    if (newAllergy.trim() && !formData.allergies.includes(newAllergy.trim())) {
      setFormData({ ...formData, allergies: [...formData.allergies, newAllergy.trim()] });
      setNewAllergy("");
    }
  };

  const handleRemoveAllergy = (allergy) => {
    setFormData({ ...formData, allergies: formData.allergies.filter(a => a !== allergy) });
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
            {goals.map(g => <SelectPill key={g} label={g} selected={formData.goal === g} onClick={() => setFormData({...formData, goal: g})} />)}
          </div>
        </section>
        <section>
          <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Datos Físicos</h3>
          <div className="grid grid-cols-2 gap-4">
            <InputField label="Peso (kg)" type="number" placeholder="70" value={formData.weight} onChange={(e) => setFormData({...formData, weight: e.target.value})} />
            <InputField label="Altura (cm)" type="number" placeholder="170" value={formData.height} onChange={(e) => setFormData({...formData, height: e.target.value})} />
            <InputField label="Edad" type="number" placeholder="25" value={formData.age} onChange={(e) => setFormData({...formData, age: e.target.value})} />
            <div className="mb-4">
              <label className="block text-gray-500 text-xs font-bold mb-2 uppercase">Sexo</label>
              <div className="flex bg-white rounded-xl border border-gray-200 p-1">
                {['Femenino', 'Masculino'].map(s => (
                  <button key={s} onClick={() => setFormData({...formData, sex: s})} className={`flex-1 py-3 rounded-lg text-sm font-bold transition-colors ${formData.sex === s ? 'bg-gray-900 text-[#FFB700]' : 'text-gray-500'}`}>
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
            {activities.map(a => <SelectPill key={a} label={a} selected={formData.activityLevel === a} onClick={() => setFormData({...formData, activityLevel: a})} />)}
          </div>
        </section>
        <section>
          <h3 className="text-xs font-bold text-gray-400 uppercase mb-3">Alergias y Restricciones</h3>
          <div className="flex gap-2 mb-3">
            <input type="text" value={newAllergy} onChange={(e) => setNewAllergy(e.target.value)} placeholder="Ej. Gluten, Lactosa" className="flex-1 bg-white border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-[#FFB700]" />
            <button onClick={handleAddAllergy} className="bg-gray-900 text-white px-4 rounded-xl font-bold">+</button>
          </div>
          <div className="flex flex-wrap gap-2">
            {formData.allergies.map(allergy => (
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

// 3.4 DASHBOARD (HOME)
const DashboardScreen = ({ user, nutritionProfile, unreadNotificationsCount, onNavigate, nextAppointment }) => (
  <div className="pb-24">
    {/* Header y Hero Widget */}
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
            <circle cx="96" cy="96" r="88" stroke="#FFB700" strokeWidth="12" fill="none" strokeDasharray={2 * Math.PI * 88} strokeDashoffset={2 * Math.PI * 88 * (1 - (MOCK_DASHBOARD_DATA.caloriesConsumed / MOCK_DASHBOARD_DATA.caloriesTarget))} strokeLinecap="round" className="transition-all duration-1000 ease-out" />
          </svg>
          <div className="absolute flex flex-col items-center">
            <Flame className="text-[#FFB700] mb-1" size={24} fill="#FFB700" />
            <span className="text-3xl font-black text-black tabular-nums">{MOCK_DASHBOARD_DATA.caloriesTarget - MOCK_DASHBOARD_DATA.caloriesConsumed}</span>
            <span className="text-xs text-gray-400 uppercase font-bold tracking-wider">Kcal Restantes</span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <ProgressBar label="Proteína" current={MOCK_DASHBOARD_DATA.macros.protein.current} max={MOCK_DASHBOARD_DATA.macros.protein.target} colorClass="bg-[#FFB700]" />
        <ProgressBar label="Carbos" current={MOCK_DASHBOARD_DATA.macros.carbs.current} max={MOCK_DASHBOARD_DATA.macros.carbs.target} colorClass="bg-black" />
        <ProgressBar label="Grasas" current={MOCK_DASHBOARD_DATA.macros.fat.current} max={MOCK_DASHBOARD_DATA.macros.fat.target} colorClass="bg-gray-400" />
      </div>
    </div>

    {/* Widgets y Contenido */}
    <div className="px-4 mt-6 space-y-4">
      {nextAppointment && (
        <Card className="bg-black text-white border-none flex justify-between items-center animate-fade-in">
          <div>
            <p className="text-xs text-[#FFB700] font-bold uppercase mb-1">Próxima Cita</p>
            <h4 className="font-bold text-lg">{nextAppointment.type}</h4>
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
);

// 3.5 SPEED LOGGER (REGISTRO RÁPIDO)
const SpeedLoggerScreen = ({ onBack, onAdd, favoriteFoods, onToggleFavorite }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("recent"); // 'recent' | 'favorites' | 'scan'

  const getDisplayList = () => {
    if (activeTab === "favorites") {
      return favoriteFoods.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    return MOCK_RECENT_FOODS.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));
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
        
        {activeTab !== 'scan' && (
          <div className="relative mb-2">
            <Search className="absolute left-4 top-3.5 text-gray-400" size={20} />
            <input 
              autoFocus
              type="text" 
              placeholder="¿Qué comiste hoy?" 
              className="w-full bg-gray-100 pl-12 pr-4 py-3 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#FFB700]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Barcode className="absolute right-4 top-3.5 text-gray-500" size={20} />
          </div>
        )}
        
        <div className="flex gap-6 mt-4 px-2 overflow-x-auto no-scrollbar">
          <button 
            onClick={() => setActiveTab("recent")}
            className={`pb-2 border-b-2 font-bold whitespace-nowrap ${activeTab === 'recent' ? 'border-[#FFB700] text-black' : 'border-transparent text-gray-400'}`}
          >
            Recientes
          </button>
          <button 
            onClick={() => setActiveTab("favorites")}
            className={`pb-2 border-b-2 font-bold whitespace-nowrap ${activeTab === 'favorites' ? 'border-[#FFB700] text-black' : 'border-transparent text-gray-400'}`}
          >
            Favoritos
          </button>
          <button 
            onClick={() => setActiveTab("scan")}
            className={`pb-2 border-b-2 font-bold whitespace-nowrap ${activeTab === 'scan' ? 'border-[#FFB700] text-black' : 'border-transparent text-gray-400'}`}
          >
            Escanear
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'scan' ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-8 pb-20">
            <div className="w-32 h-32 bg-gray-100 rounded-3xl flex items-center justify-center mb-6 border-2 border-dashed border-gray-300">
              <Camera size={48} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">Escanear alimentos</h3>
            <p className="text-gray-500 text-sm mb-8">
              Próximamente podrás escanear códigos de barras o tomar fotos a tus platos para registrar tus comidas automáticamente.
            </p>
            <button disabled className="w-full bg-gray-200 text-gray-400 font-bold py-4 rounded-xl cursor-not-allowed flex items-center justify-center gap-2">
              <Camera size={20} /> Abrir Cámara
            </button>
          </div>
        ) : (
          <>
            {activeTab === 'favorites' && displayList.length === 0 && !searchTerm ? (
              <div className="flex flex-col items-center justify-center h-64 text-gray-400 text-center px-8">
                <Heart size={48} className="mb-4 opacity-20" />
                <p className="font-medium">Aún no tienes favoritos</p>
                <p className="text-xs mt-2">Marca el corazón en tus alimentos recientes para verlos aquí.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {displayList.map((food) => {
                  const isFav = favoriteFoods.some(fav => fav.id === food.id);
                  return (
                    <div key={food.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-2xl hover:border-[#FFB700] transition-colors bg-white group">
                      <div className="flex items-center gap-3 flex-1">
                        <button 
                          onClick={(e) => { e.stopPropagation(); onToggleFavorite(food); }}
                          className="w-8 h-8 flex items-center justify-center text-gray-300 hover:text-[#E74C3C] transition-colors"
                        >
                          <Heart size={20} fill={isFav ? "#E74C3C" : "none"} className={isFav ? "text-[#E74C3C]" : ""} />
                        </button>
                        <div>
                          <p className="font-bold text-gray-900">{food.name}</p>
                          <p className="text-xs text-gray-500">{food.detail}</p>
                        </div>
                      </div>
                      <button onClick={() => onAdd(food.name)} className="w-10 h-10 bg-[#F4F6F8] rounded-full flex items-center justify-center text-[#FFB700] group-hover:bg-[#FFB700] group-hover:text-black transition-all active:scale-90 ml-2">
                        <Plus size={20} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

// 3.6 PLAN NUTRICIONAL
const PlanScreen = ({ nutritionProfile }) => (
  <div className="pt-12 px-4 pb-24">
    <h2 className="text-2xl font-black italic uppercase mb-6 text-black">Mi Plan <span className="text-[#FFB700]">Nutricional</span></h2>
    <Card className="mb-6 bg-gradient-to-r from-gray-900 to-gray-800 text-white border-none">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-400 text-xs uppercase font-bold mb-1">Objetivo Actual</p>
          <h3 className="text-xl font-bold text-[#FFB700]">{nutritionProfile.goal || 'No definido'}</h3>
          <p className="text-sm text-gray-300 mt-1">Meta: {MOCK_DASHBOARD_DATA.caloriesTarget} Kcal / día</p>
        </div>
        <TrendingUp className="text-[#FFB700]" size={24} />
      </div>
    </Card>
    <div className="space-y-4">
      {MOCK_MEALS.map((meal, idx) => (
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

// 3.7 PERFIL NUTRICIONAL (Read Only)
const ProfileScreen = ({ user, nutritionProfile, onNavigateEdit, onLogout }) => (
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
            nutritionProfile.allergies.map(allergy => (
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

// 3.8 HISTORIAL
const HistoryScreen = () => (
  <div className="pt-12 px-4 pb-24">
    <h2 className="text-2xl font-black italic uppercase mb-6">Historial</h2>
    <div className="flex gap-2 mb-6 overflow-x-auto no-scrollbar">
      <button className="px-4 py-2 bg-black text-[#FFB700] rounded-full text-sm font-bold whitespace-nowrap">Últimos 7 días</button>
      <button className="px-4 py-2 bg-white border border-gray-200 text-gray-600 rounded-full text-sm font-medium whitespace-nowrap">Últimos 30 días</button>
    </div>
    <div className="space-y-3">
      {MOCK_HISTORY.map((day, idx) => {
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
              {isSuccess ? <Check size={20} /> : isWarning ? <span className="font-bold">!</span> : <Clock size={20}/>}
            </div>
          </Card>
        );
      })}
    </div>
  </div>
);

// 3.9 NOTIFICACIONES
const NotificationsScreen = ({ notifications, onBack }) => {
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
          notifications.map((notif) => {
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

// 3.10 CONSULTAS Y CITAS
const ConsultasScreen = ({ onBack, showToast, setNextAppointment }) => {
  const [queryText, setQueryText] = useState("");
  const [selectedDate, setSelectedDate] = useState("Mañana");
  const [selectedTime, setSelectedTime] = useState("10:00");

  const handleSendQuery = () => {
    if (!queryText.trim()) return;
    showToast("Consulta enviada. Te responderemos pronto.");
    setQueryText("");
  };

  const handleQuickQuery = (topic) => {
    showToast(`Consulta sobre "${topic}" enviada.`);
  };

  const handleSchedule = () => {
    setNextAppointment({ date: selectedDate, time: selectedTime, type: "Videollamada" });
    showToast("¡Cita agendada correctamente!");
    setTimeout(onBack, 1500);
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

// --- 4. NAVEGACIÓN GLOBAL ---

const BottomNavBar = ({ currentScreen, onNavigate }) => {
  const navItems = [
    { id: 'home', icon: Home, label: 'Inicio' },
    { id: 'plan', icon: FileText, label: 'Plan' },
    { id: 'speedLogger', icon: Plus, label: '', isFab: true }, // Mapea a 'speedLogger' pero muestra FAB
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

// --- 5. APP ROOT & ESTADO GLOBAL ---

const App = () => {
  // --- ESTADOS GLOBALES ---
  const [user, setUser] = useState(null); 
  const [currentScreen, setCurrentScreen] = useState('login'); 
  const [hasNutritionProfile, setHasNutritionProfile] = useState(false);
  const [nutritionProfile, setNutritionProfile] = useState({ goal: '', weight: '', height: '', age: '', sex: '', activityLevel: '', allergies: [] });
  const [favoriteFoods, setFavoriteFoods] = useState([]); 
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  const [nextAppointment, setNextAppointment] = useState(null);
  const [toast, setToast] = useState({ show: false, message: '' });

  // --- HANDLERS DE LÓGICA ---
  
  const showToast = (msg) => {
    setToast({ show: true, message: msg });
    setTimeout(() => setToast({ show: false, message: '' }), 3000);
  };

  const handleAuthSuccess = () => {
    setUser(MOCK_AUTH_USER);
    // Redirección inteligente post-login
    if (!hasNutritionProfile) {
      setCurrentScreen('onboardingProfile');
    } else {
      setCurrentScreen('home');
    }
  };

  const handleSaveProfile = (data) => {
    setNutritionProfile(data);
    setHasNutritionProfile(true);
    if (currentScreen === 'onboardingProfile') {
      setCurrentScreen('home');
      showToast("¡Perfil creado con éxito!");
    } else {
      setCurrentScreen('profile');
      showToast("Perfil actualizado");
    }
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentScreen('login');
  };

  const handleToggleFavorite = (foodItem) => {
    const exists = favoriteFoods.some(f => f.id === foodItem.id);
    if (exists) {
      setFavoriteFoods(favoriteFoods.filter(f => f.id !== foodItem.id));
    } else {
      setFavoriteFoods([...favoriteFoods, foodItem]);
    }
  };

  // --- ROUTING VISUAL (SWITCH) ---
  const renderScreen = () => {
    if (!user) {
      if (currentScreen === 'register') return <RegisterScreen onRegister={handleAuthSuccess} onNavigateLogin={() => setCurrentScreen('login')} />;
      return <LoginScreen onLogin={handleAuthSuccess} onNavigateRegister={() => setCurrentScreen('register')} />;
    }

    switch (currentScreen) {
      case 'onboardingProfile': 
        return <ProfileFormScreen initialData={nutritionProfile} isEditing={false} onSave={handleSaveProfile} onCancel={() => {}} />;
      
      case 'editProfile': 
        return <ProfileFormScreen initialData={nutritionProfile} isEditing={true} onSave={handleSaveProfile} onCancel={() => setCurrentScreen('profile')} />;
      
      case 'notifications':
        return <NotificationsScreen notifications={notifications} onBack={() => setCurrentScreen('home')} />;

      case 'consultas':
        return <ConsultasScreen onBack={() => setCurrentScreen('home')} showToast={showToast} setNextAppointment={setNextAppointment} />;

      case 'home': 
        return <DashboardScreen user={user} nutritionProfile={nutritionProfile} unreadNotificationsCount={notifications.filter(n => !n.isRead).length} onNavigate={setCurrentScreen} nextAppointment={nextAppointment} />;
      
      case 'plan': 
        return <PlanScreen nutritionProfile={nutritionProfile} />;
      
      case 'profile': 
        return <ProfileScreen user={user} nutritionProfile={nutritionProfile} onNavigateEdit={() => setCurrentScreen('editProfile')} onLogout={handleLogout} />;
      
      case 'history': 
        return <HistoryScreen />;
      
      case 'speedLogger': 
        return <SpeedLoggerScreen onBack={() => setCurrentScreen('home')} onAdd={(food) => showToast(`Agregado: ${food}`)} favoriteFoods={favoriteFoods} onToggleFavorite={handleToggleFavorite} />;
      
      default: return <DashboardScreen user={user} nutritionProfile={nutritionProfile} onNavigate={setCurrentScreen} />;
    }
  };

  // Lógica de visualización de elementos flotantes
  const hideBottomNav = !user || ['onboardingProfile', 'editProfile', 'notifications', 'consultas'].includes(currentScreen);
  const showChatBubble = user && currentScreen === 'home';

  return (
    <div className="min-h-screen bg-[#F4F6F8] font-sans text-gray-900 flex justify-center">
      {/* Contenedor Principal Simulado (Mobile Frame) */}
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