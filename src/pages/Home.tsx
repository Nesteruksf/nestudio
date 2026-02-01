import { Button } from "@/components/ui/button";
import { ChevronDown, Check, MessageCircle, Mail, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import emailjs from '@emailjs/browser';

interface CaseStudy {
  id: number;
  name: string;
  role: string;
  result: string;
  rating: number;
  category: string;
  description: string;
}

const caseStudies: CaseStudy[] = [
  {
    id: 1,
    name: "Дмитрий Соколов",
    role: "Директор, IT-компания",
    result: "Сэкономили 800 000₽/мес",
    rating: 5,
    category: "IT",
    description: "Автоматизация поддержки клиентов с AI-ботом",
  },
  {
    id: 2,
    name: "Елена Петрова",
    role: "CEO, E-commerce",
    result: "Рост конверсии на 35%",
    rating: 5,
    category: "E-commerce",
    description: "Генеративный контент для описания товаров",
  },
  {
    id: 3,
    name: "Иван Смирнов",
    role: "Founder, SaaS",
    result: "Сокращение затрат на 45%",
    rating: 5,
    category: "SaaS",
    description: "Автоматизация маркетинг-кампаний",
  },
  {
    id: 4,
    name: "Анна Волкова",
    role: "Маркетолог, Агентство",
    result: "Ускорение работы в 3x раза",
    rating: 5,
    category: "Marketing",
    description: "AI-помощник для создания контента",
  },
  {
    id: 5,
    name: "Сергей Морозов",
    role: "CTO, Финтех",
    result: "Автоматизация 70% процессов",
    rating: 5,
    category: "Finance",
    description: "Интеграция AI в систему обработки платежей",
  },
  {
    id: 6,
    name: "Мария Кузнецова",
    role: "Директор, Логистика",
    result: "Оптимизация маршрутов на 25%",
    rating: 5,
    category: "Logistics",
    description: "AI для оптимизации логистических процессов",
  },
];

const categories = ["Все", "IT", "E-commerce", "SaaS", "Marketing", "Finance", "Logistics"];

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("Все");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [visibleCounters, setVisibleCounters] = useState<Record<string, number>>({
    savings: 0,
    uptime: 0,
    speed: 0,
    hours: 0,
  });

  const filteredCases = selectedCategory === "Все"
    ? caseStudies
    : caseStudies.filter((c) => c.category === selectedCategory);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Counter animation effect
  useEffect(() => {
    const counters = {
      savings: { target: 40, current: 0 },
      uptime: { target: 24, current: 0 },
      speed: { target: 3, current: 0 },
      hours: { target: 48, current: 0 },
    };

    const interval = setInterval(() => {
      let allDone = true;
      const newCounters: Record<string, number> = {};

      Object.entries(counters).forEach(([key, value]) => {
        if (value.current < value.target) {
          value.current += Math.ceil(value.target / 30);
          allDone = false;
        } else {
          value.current = value.target;
        }
        newCounters[key] = value.current;
      });

      setVisibleCounters(newCounters);

      if (allDone) {
        clearInterval(interval);
      }
    }, 50);

    return () => clearInterval(interval);
  }, []);

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  
  // Сохраняем ссылку на форму ДО асинхронного вызова
  const form = e.currentTarget;
  const formData = new FormData(form);
  
  const templateParams = {
    name: formData.get("name") as string,
    contact: formData.get("contact") as string,
    message: (formData.get("message") as string) || "Без сообщения",
  };

  try {
    await emailjs.send(
      'service_akriny6',
      'template_fr3lr6m',
      templateParams,
      'ULlQhwJX1bdJLBSFs'
    );
    
    alert("Спасибо! Мы получили вашу заявку и свяжемся с вами в течение 15 минут.");
    form.reset();  // Теперь используем сохранённую ссылку
    setIsModalOpen(false);
  } catch (error) {
    console.error("Ошибка отправки:", error);
    alert("Произошла ошибка. Попробуйте позже или позвоните нам по +375 44 713-88-69");
  }
};


  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-white overflow-hidden">
      {/* Navigation */}
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled || isMobileMenuOpen ? "bg-slate-950/95 backdrop-blur-md shadow-lg" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex justify-between items-center">
            
            {/* Логотип */}
            <a href="/" className="hover:opacity-80 transition-opacity">
              <img 
                src="/images/nestudio-logo.png" 
                alt="nestudio" 
                className="h-10 w-auto object-contain" 
              />
            </a>

            {/* Десктопное меню (для компьютеров) */}
            <div className="hidden md:flex gap-8 items-center">
              <a href="#benefits" className="hover:text-indigo-400 transition">Преимущества</a>
              <a href="#how-it-works" className="hover:text-indigo-400 transition">Как работает</a>
              <a href="#cases" className="hover:text-indigo-400 transition">Кейсы</a>
              <a href="tel:+375447138869" className="hover:text-indigo-400 transition">+375 (44) 713-88-69</a>
              <button
                onClick={() => setIsModalOpen(true)}
                className="px-4 py-2 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 font-semibold transition transform hover:scale-105 shadow-lg shadow-indigo-500/50"
              >
                Заказать звонок
              </button>
            </div>

            {/* Кнопка "Бургер" (для телефонов) */}
            <button
              className="md:hidden text-white p-2 focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              ) : (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
              )}
            </button>
          </div>
        </div>

        {/* Выпадающее меню (появляется при клике) */}
        {isMobileMenuOpen && (
          <div className="md:hidden bg-slate-950 border-t border-slate-800 px-4 pt-4 pb-8 shadow-xl animate-in fade-in slide-in-from-top-5 duration-200 absolute w-full left-0">
            <div className="flex flex-col space-y-4">
              <a href="#benefits" className="text-lg py-3 border-b border-slate-800 hover:text-indigo-400 transition" onClick={() => setIsMobileMenuOpen(false)}>
                Преимущества
              </a>
              <a href="#how-it-works" className="text-lg py-3 border-b border-slate-800 hover:text-indigo-400 transition" onClick={() => setIsMobileMenuOpen(false)}>
                Как работает
              </a>
              <a href="#cases" className="text-lg py-3 border-b border-slate-800 hover:text-indigo-400 transition" onClick={() => setIsMobileMenuOpen(false)}>
                Кейсы
              </a>
              <a href="tel:+375447138869" className="text-lg py-3 border-b border-slate-800 hover:text-indigo-400 transition font-mono">
                +375 44 713-88-69
              </a>
              <button
                onClick={() => { setIsMobileMenuOpen(false); setIsModalOpen(true); }}
                className="mt-4 w-full py-4 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 font-bold text-lg shadow-lg active:scale-95 transition"
              >
                Заказать звонок
              </button>
            </div>
          </div>
        )}
      </nav>


      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Animated background grid */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-b from-indigo-500/10 via-transparent to-purple-500/10"></div>
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                <circle cx="5" cy="5" r="0.5" fill="white" opacity="0.3" />
              </pattern>
            </defs>
            <rect width="100" height="100" fill="url(#grid)" />
          </svg>
        </div>

        {/* Floating elements */}
        <div className="absolute top-20 left-10 w-32 h-32 bg-indigo-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }}></div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-block mb-6 px-4 py-2 rounded-full border border-indigo-400/50 bg-indigo-500/10 backdrop-blur-sm">
            <span className="text-sm font-semibold text-indigo-300">⚡ DEMO решения за 48 часов - БЕСПЛАТНО</span>
          </div>

          {/* Main heading */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            Сократите расходы на{" "}
            <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
               30-45% за 48 часов без сокращений
            </span>
          </h1>

          {/* Subheading */}
          <p className="text-lg md:text-xl text-slate-400 mb-8 max-w-2xl mx-auto leading-relaxed">
            AI-решения для бизнеса: от чат-ботов и автоматизации до продающих сайтов и контента. 2 года создаем digital-инструменты для компаний Беларуси
          </p>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="flex flex-col md:flex-row gap-3 justify-center mb-6">
            <input
              type="text"
              name="name"
              placeholder="Ваше имя"
              required
              className="px-4 py-3 md:py-4 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 transition md:w-48"
            />
            <input
              type="text"
              name="contact"
              placeholder="Телефон/Email"
              required
              className="px-4 py-3 md:py-4 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 transition md:w-56"
            />
            <button
              type="submit"
              className="px-6 py-3 md:py-4 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 font-semibold transition transform hover:scale-105 shadow-lg shadow-indigo-500/50"
            >
              ⚡ ПОЛУЧИТЬ DEMO
            </button>
          </form>

          <p className="text-sm text-slate-500">🔒 Никакого спама. Перезвоним за 15 минут</p>

          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce">
            <ChevronDown className="w-6 h-6 text-indigo-400" />
          </div>
        </div>
      </section>

      {/* Pain Points Section */}
      <section className="py-24 px-4 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Пока вы вручную создаете контент и обрабатываете заявки, конкуренты автоматизировали это с AI
          </h2>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: "💸",
                title: "Переплата за контент и коммуникации",
                desc: "Дизайнеры, копирайтеры, SMM-менеджеры, операторы поддержки — 200 000+ BYN в год на задачи, которые AI делает за 48 часов",
              },
              {
                icon: "📉",
                title: "Потерянные клиенты из-за медленной реакции",
                desc: "67% клиентов уходят, если не получают ответ в течение 5 минут. AI-чат-бот отвечает мгновенно 24/7 и конвертирует в 3 раза больше заявок",
              },
              {
                icon: "❌",
                title: "Хаос в системах и ручная работа",
                desc: "Данные в Excel, CRM, мессенджерах и почте не связаны. Сотрудники тратят 4 часа в день на копирование информации между системами вместо продаж",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm hover:border-indigo-400/50 hover:-translate-y-2 transition duration-300"
              >
                <div className="text-5xl mb-4">{item.icon}</div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-400">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Solution Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-slate-900 to-slate-800">
        <div className="max-w-6xl mx-auto">
          <div className="inline-block mb-6 px-4 py-2 rounded-full bg-indigo-500/20 border border-indigo-400/50">
            <span className="text-sm font-semibold text-indigo-300">AI-РЕШЕНИЕ</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold mb-16">
            AI-технологии и digital-решения для роста бизнеса
          </h2>
          <p className="text-lg text-slate-400 mb-14">
            Мы - команда AI-разработчиков и digital-специалистов. За 2 года автоматизировали процессы и запустили продающие инструменты для 8 компаний Беларуси
          </p>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            {/* Left: Features */}
            <div>
              <ul className="space-y-4">
                {[
                  "✓ Экспертный AI-контент (текст, фото, видео), экономия на штате контент-мейкеров до 80%",
                  "✓ Умные AI чат-боты и голосовые ассистенты, автоматическая обработка заявок, консультации клиентов 24/7",
                  "✓ Автоматизация бизнес-процессов, ваши сотрудники экономят 4-6 часов в день",
                  "✓ Интеграции между системами, данные синхронизируются автоматически - никакого ручного копирования",
                ].map((item, idx) => (
                  <li key={idx} className="text-lg text-slate-300 flex items-start gap-3">
                    <span className="text-indigo-400 font-bold mt-1">✓</span>
                    <span>{item.substring(2)}</span>
                  </li>
                ))}
              </ul>
              <button className="mt-8 px-6 py-3 rounded-lg border border-indigo-400 text-indigo-400 hover:bg-indigo-400/10 transition">
                Узнать подробнее
              </button>
            </div>

            {/* Right: Dashboard mockup */}
            <div className="relative">
              <div className="bg-gradient-to-br from-indigo-500/20 to-purple-500/20 rounded-2xl p-8 border border-indigo-400/30 backdrop-blur-sm shadow-2xl">
                <div className="bg-slate-800/50 rounded-lg p-6 space-y-4">
                  <div className="h-2 bg-indigo-400 rounded w-1/3"></div>
                  <div className="space-y-2">
                    <div className="h-2 bg-slate-700 rounded"></div>
                    <div className="h-2 bg-slate-700 rounded w-5/6"></div>
                  </div>
                  <div className="grid grid-cols-3 gap-2 pt-4">
                    <div className="h-16 bg-indigo-500/20 rounded"></div>
                    <div className="h-16 bg-purple-500/20 rounded"></div>
                    <div className="h-16 bg-pink-500/20 rounded"></div>
                  </div>
                </div>
              </div>
              <div className="absolute -top-4 -right-4 px-4 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-lg font-bold text-sm">
                ↗ +40% экономии
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="py-24 px-4 bg-slate-950">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Результаты, которые видят наши клиенты
          </h2>

          <div className="grid md:grid-cols-4 gap-8">
            {[
              { value: "40%", label: "Сокращение расходов на операционные задачи", icon: "📉" },
              { value: "24/7", label: "Работа AI-ботов без выходных и перерывов", icon: "⏰" },
              { value: "3x", label: "Ускорение создания контента", icon: "⚡" },
              { value: "48ч", label: "До первых результатов", icon: "🚀" },
            ].map((item, idx) => (
              <div
                key={idx}
                className="p-8 rounded-2xl bg-slate-800/40 border border-slate-700/50 text-center hover:border-indigo-400/50 transition"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <div className="text-5xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent mb-3">
                  {visibleCounters[Object.keys(visibleCounters)[idx]] || 0}
                  {item.value.includes("%") ? "%" : item.value.includes("x") ? "x" : item.value.includes("ч") ? "ч" : ""}
                </div>
                <p className="text-slate-400">{item.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-24 px-4 bg-slate-900/50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Запуск за 3 простых шага
          </h2>

          <div className="space-y-12 relative max-w-2xl mx-auto">
            {/* Timeline line */}
            
            {[
              { num: "01",/* icon: "📞",*/ title: "Оставьте заявку", desc: "Опишите вашу задачу за 2 минуты" },
              { num: "02",/* icon: "🚀",*/ title: "Получите DEMO за 48 часов", desc: "Бесплатно создаем рабочий прототип для вашего бизнеса" },
              { num: "03",/* icon: "✅",*/ title: "Тестируйте и платите только за результат", desc: "Видите ценность - запускаем полную версию" },
            ].map((step, idx) => (
                          <div key={idx} className="flex gap-6 mb-12 items-start">
                <div className="min-w-[80px]">
                  <div className="text-6xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
                    {step.num}
                  </div>
                </div>
                <div>
                  <h3 className="text-2xl font-bold mb-2">{step.title}</h3>
                  <p className="text-slate-400">{step.desc}</p>
                </div>
              </div>
  
            ))}
          </div>
        </div>
      </section>

      {/* Free MVP Section */}
      <section className="py-24 px-4 bg-gradient-to-b from-slate-800 to-slate-900 border-t border-b border-indigo-500/30">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-block mb-6 px-6 py-3 rounded-full bg-indigo-500/20 border border-indigo-400/50 text-lg font-bold text-indigo-300">
            🎁 НИКАКИХ РИСКОВ
          </div>

          <h2 className="text-5xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Бесплатный тест-драйв AI-решения за 48 часов
          </h2>

          <p className="text-xl text-slate-400 mb-8">
            Выберите задачу - мы создадим работающий прототип на ваших данных
          </p>

          {/* Benefits list */}
          <div className="space-y-4 mb-10 text-left">
            {[
              "⚡ Реальный рабочий прототип, не презентация",
              "🔧 Интеграция с вашими системами",
              "📊 Демо - данные и примеры работы",
              "💰 0 р. - платите только если решите продолжить",
            ].map((item, idx) => (
              <div key={idx} className="flex items-center gap-4 text-lg">
                <span className="text-2xl">{item.substring(0, 2)}</span>
                <span>{item.substring(2)}</span>
              </div>
            ))}
          </div>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-3 mb-6">
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                name="name"
                placeholder="Ваше имя"
                required
                className="flex-1 px-6 py-4 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 transition"
              />
              <input
                type="text"
                name="contact"
                placeholder="Контакт"
                required
                className="flex-1 px-6 py-4 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 transition"
              />
            </div>
            <button
              type="submit"
              className="w-full px-6 py-4 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 font-bold text-lg transition transform hover:scale-105 shadow-lg shadow-indigo-500/50"
            >
              ПОЛУЧИТЬ БЕСПЛАТНОЕ DEMO
            </button>
          </form>

          <p className="text-slate-500">Перезвоним за 15 минут • Без спама</p>
        </div>
      </section>

      {/* Cases Section */}
      <section id="cases" className="py-24 px-4 bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Они уже сократили расходы на 40%
          </h2>

          {/* Category Filters */}
          <div className="flex flex-wrap justify-center gap-3 mb-12">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-6 py-2 rounded-full font-semibold transition-all duration-300 ${
                  selectedCategory === category
                    ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white shadow-lg shadow-indigo-500/50"
                    : "bg-slate-800/50 border border-slate-700 text-slate-300 hover:border-indigo-400/50 hover:text-indigo-300"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Cases Grid */}
          <div className="grid md:grid-cols-3 gap-8 mb-16 min-h-96">
            {filteredCases.length > 0 ? (
              filteredCases.map((caseStudy, idx) => (
                <div
                  key={caseStudy.id}
                  className="p-8 rounded-2xl bg-slate-800/40 border border-slate-700/50 backdrop-blur-sm hover:border-indigo-400/50 hover:shadow-2xl hover:shadow-indigo-500/30 transition-all duration-300 animate-fadeIn hover:scale-105"
                  style={{
                    animation: `fadeIn 0.5s ease-in-out ${idx * 0.1}s both`,
                  }}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-4 flex-1">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400"></div>
                      <div>
                        <h4 className="font-bold">{caseStudy.name}</h4>
                        <p className="text-sm text-slate-400">{caseStudy.role}</p>
                      </div>
                    </div>
                  </div>
                  <div className="inline-block px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/50 text-xs font-semibold text-indigo-300 mb-3">
                    {caseStudy.category}
                  </div>
                  <p className="text-slate-300 mb-4 text-sm">{caseStudy.description}</p>
                  <div className="mb-4 text-yellow-400">{"⭐".repeat(caseStudy.rating)}</div>
                  <p className="font-bold text-indigo-400">{caseStudy.result}</p>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-slate-400 text-lg">Нет кейсов в этой категории</p>
              </div>
            )}
          </div>

          {/* Company logos */}
          <div className="text-center">
            <p className="text-slate-400 mb-20">Нам доверяют</p>
            <div className="flex justify-center gap-25 flex-wrap opacity-60 hover:opacity-100 transition">
              {["Technex", "Aaronfarm", "Twistellar", "ПадВокам", "БиоСапропель"].map((company, idx) => (
                <div key={idx} className="text-slate-500 font-bold">{company}</div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 px-4 bg-slate-800/50">
        <div className="max-w-3xl mx-auto">
          <h2 className="text-4xl md:text-5xl font-bold text-center mb-16">
            Частые вопросы
          </h2>

          <div className="space-y-4">
            {[
              {
                q: "Что именно вы делаете?",
                a: "AI-решения: чат-боты и голосовые ассистенты для сайтов и мессенджеров. Автоматизация: обработка документов, интеграции между системами (CRM, 1С, почта). Digital: продающие сайты, landing page, презентации. Контент: генерация текстов, изображений, видео с помощью нейросетей",
              },
              {
                q: "Сколько стоит внедрение после DEMO?",
                a: "Стоимость зависит от сложности задачи и объема работ. После бесплатного DEMO мы предоставим точный расчет с детализацией этапов. Большинство наших клиентов окупают внедрение за первые месяцы работы. Предоставляем рассрочку без процентов",
              },
              {
                q: "Есть гарантия результата?",
                a: "Да. Мы работаем по договору с четкими метриками результата: экономия времени, рост конверсии или сокращение расходов. Если согласованные показатели не достигнуты - предусмотрены механизмы компенсации. Все условия фиксируем юридически",
              },
              {
                q: "Можете ли интегрироваться с нашими системами?",
                a: "Да. Работаем с любыми системами через API: 1С, amoCRM, Битрикс24, Telegram, Viber, WhatsApp, email, Excel, Google Sheets, custom-разработки. Если у вашей системы есть API или возможность экспорта данных - мы сможем подключиться",
              },
              {
                q: "Работаете с регионами Беларуси?",
                a: "Да. Работаем со всей Беларусью удаленно. Все встречи и созвоны проводим онлайн, выезд на площадку организуем по необходимости. География клиента не влияет на качество и сроки",
              },
            ].map((faq, idx) => (
              <details
                key={idx}
                className="group p-6 rounded-lg bg-slate-700/30 border border-slate-600/50 cursor-pointer hover:border-indigo-400/50 transition"
              >
                <summary className="flex justify-between items-center font-bold text-lg">
                  {faq.q}
                  <span className="group-open:rotate-180 transition">▼</span>
                </summary>
                <p className="mt-4 text-slate-300">{faq.a}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section id="contact" className="py-24 px-4 bg-gradient-to-b from-slate-900 to-slate-950 border-t border-indigo-500/30">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            Начните экономить уже через 48 часов
          </h2>

          <p className="text-xl text-slate-400 mb-8">
            Бесплатное DEMO решения без рисков и обязательств
          </p>

          {/* Form */}
          <form onSubmit={handleFormSubmit} className="flex flex-col gap-3 mb-8">
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                name="name"
                placeholder="Ваше имя"
                required
                className="flex-1 px-6 py-4 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 transition"
              />
              <input
                type="text"
                name="contact"
                placeholder="Контакт"
                required
                className="flex-1 px-6 py-4 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 transition"
              />
            </div>
            <button
              type="submit"
              className="w-full px-6 py-4 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 font-bold text-lg transition transform hover:scale-105 shadow-lg shadow-indigo-500/50"
            >
              ПОЛУЧИТЬ БЕСПЛАТНОЕ  DEMO РЕШЕНИЯ
            </button>
          </form>

          <p className="text-slate-500 mb-8">Перезвоним за 15 минут • Без спама</p>

          {/* Messengers */}
          <div className="flex justify-center gap-6 mb-12">
            <a href="#" className="p-3 rounded-full bg-slate-800/50 border border-slate-700 hover:border-indigo-400 transition">
              <MessageCircle className="w-6 h-6 text-indigo-400" />
            </a>
            <a href="#" className="p-3 rounded-full bg-slate-800/50 border border-slate-700 hover:border-indigo-400 transition">
              <Mail className="w-6 h-6 text-indigo-400" />
            </a>
            <a href="#" className="p-3 rounded-full bg-slate-800/50 border border-slate-700 hover:border-indigo-400 transition">
              <Phone className="w-6 h-6 text-indigo-400" />
            </a>
          </div>

          {/* Footer */}
          <div className="pt-8 border-t border-slate-700/50 space-y-2 text-slate-500 text-sm">
            <p>© 2026 nestudio. Все права защищены.</p>
            <div className="flex justify-center gap-6">
              <a href="#" className="hover:text-indigo-400 transition">
                Политика конфиденциальности
              </a>
              <a href="#" className="hover:text-indigo-400 transition">
                Условия использования
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Modal Overlay */}
      {isModalOpen && (
        <div
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fadeIn"
          onClick={() => setIsModalOpen(false)}
        >
          {/* Modal */}
          <div
            className="bg-gradient-to-b from-slate-800 to-slate-900 rounded-2xl border border-slate-700/50 p-8 max-w-md w-full shadow-2xl animate-fadeIn"
            onClick={(e) => e.stopPropagation()}
            style={{
              animation: `slideUp 0.3s ease-out`,
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-2xl font-bold">Заказать звонок</h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white transition text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <p className="text-slate-400 mb-6">
              Оставьте ваши контакты, и мы перезвоним вам в течение 15 минут
            </p>

            <form onSubmit={handleFormSubmit} className="space-y-4">
              <input
                type="text"
                name="name"
                placeholder="Ваше имя"
                required
                className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 transition"
              />
              <input
                type="text"
                name="contact"
                placeholder="Телефон или Email"
                required
                className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 transition"
              />
              <textarea
                name="message"
                placeholder="Кратко опишите вашу задачу (опционально)"
                rows={3}
                className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700 text-white placeholder-slate-500 focus:outline-none focus:border-indigo-400 transition resize-none"
              />
              <button
                type="submit"
                className="w-full px-6 py-3 rounded-lg bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 font-semibold transition transform hover:scale-105 shadow-lg shadow-indigo-500/50"
              >
                Отправить
              </button>
            </form>

            <p className="text-xs text-slate-500 text-center mt-4">🔒 Ваши данные защищены</p>
          </div>
        </div>
      )}

      {/* Animation styles */}
      <style>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </div>
  );
}
