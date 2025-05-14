import { Shield, Lock, Eye, Code2, AlertTriangle, BookOpen, Key, Binoculars, RotateCw } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import Footer from '../../components/Footer';

// Contenido y copy mejorado para cada solución
const solutionContent = [
  {
    icon: <Shield className="w-12 h-12 text-blue-600" />, 
    title: "Gestión de Riesgos",
    desc: "Descubre y elimina vulnerabilidades antes de que lo hagan los atacantes.",
    features: ["Análisis personalizado", "Priorización inteligente", "Plan de acción rápido"],
    impact: "+70% reducción de incidentes tras implementar"
  },
  {
    icon: <Lock className="w-12 h-12 text-blue-600" />, 
    title: "Seguridad & Cumplimiento",
    desc: "Cumple normativas y protege tu reputación con políticas robustas.",
    features: ["Gap analysis ágil", "Políticas a medida", "Preparación para auditoría"],
    impact: "100% clientes pasan auditoría tras consultoría"
  },
  {
    icon: <Eye className="w-12 h-12 text-blue-600" />, 
    title: "Monitorización 24/7 (SOC)",
    desc: "Defensa proactiva y vigilancia continua frente a amenazas.",
    features: ["Detección en tiempo real", "Respuesta automatizada", "Análisis forense"],
    impact: "Respuesta a incidentes en menos de 15 min."
  },
  {
    icon: <BookOpen className="w-12 h-12 text-blue-600" />, 
    title: "Formación y Concienciación",
    desc: "Convierte a tu equipo en la mejor defensa con simulaciones y talleres.",
    features: ["Talleres prácticos", "Simulaciones de ataques", "Módulos especializados"],
    impact: "+80% reducción de clics en phishing"
  },
  {
    icon: <AlertTriangle className="w-12 h-12 text-blue-600" />, 
    title: "Respuesta a Incidentes",
    desc: "Recupera el control y minimiza daños rápidamente ante cualquier incidente.",
    features: ["Plan de contingencia", "Equipo CERT dedicado", "Análisis post-incidente"],
    impact: "Recuperación 3x más rápida en crisis"
  },
  {
    icon: <Code2 className="w-12 h-12 text-blue-600" />, 
    title: "Desarrollo Seguro (DevSecOps)",
    desc: "Integra la seguridad en todo tu ciclo de desarrollo.",
    features: ["SAST/DAST", "Hardening de apps", "Automatización CI/CD"],
    impact: "+60% menos vulnerabilidades en despliegue"
  },
  {
    icon: <Key className="w-12 h-12 text-blue-600" />, 
    title: "Gestión de Identidades (IAM)",
    desc: "Control total de accesos y privilegios con MFA y PAM.",
    features: ["MFA avanzado", "Gobierno de identidades", "Gestión de privilegios"],
    impact: "0 brechas por acceso indebido"
  },
  {
    icon: <Binoculars className="w-12 h-12 text-blue-600" />, 
    title: "Inteligencia de Amenazas",
    desc: "Anticípate a los ciberdelincuentes con monitorización y alertas.",
    features: ["Dark web monitoring", "Alertas tempranas", "Informes estratégicos"],
    impact: "Detección proactiva de amenazas emergentes"
  },
  {
    icon: <RotateCw className="w-12 h-12 text-blue-600" />, 
    title: "Continuidad de Negocio (BCDR)",
    desc: "Asegura la supervivencia de tu negocio ante cualquier crisis.",
    features: ["Análisis de impacto", "Planes de contingencia", "Pruebas periódicas"],
    impact: "100% clientes retoman actividad en <24h"
  }
];

export default function SolutionsPage() {
  const solutions = [
    {
      icon: <Shield className="w-8 h-8 text-blue-600" />,
      title: "Evaluación y Gestión de Riesgos",
      description: "Identificamos exhaustivamente las vulnerabilidades en tus sistemas, aplicaciones y procesos",
      why: "Para una comprensión clara de tus puntos débiles y cómo fortalecerlos",
      features: [
        "Análisis de vulnerabilidades",
        "Priorización de riesgos",
        "Plan de mitigación personalizado"
      ]
    },
    {
      icon: <Lock className="w-8 h-8 text-blue-600" />,
      title: "Consultoría en Seguridad y Cumplimiento Normativo",
      description: "Alineamos tus políticas con normativas (ISO 27001, ENS, RGPD, PCI-DSS)",
      why: "Para operar con confianza, cumpliendo la ley y generando confianza",
      features: [
        "Gap analysis",
        "Desarrollo de políticas",
        "Preparación para auditorías"
      ]
    },
    {
      icon: <Eye className="w-8 h-8 text-blue-600" />,
      title: "Monitorización 24/7 (SOC)",
      description: "Vigilancia continua con tecnología SIEM/SOAR avanzada",
      why: "Para una defensa proactiva que nunca duerme, detectando amenazas al instante",
      features: [
        "Detección en tiempo real",
        "Respuesta automatizada",
        "Análisis forense"
      ]
    },
    {
      icon: <BookOpen className="w-8 h-8 text-blue-600" />,
      title: "Formación y Concienciación",
      description: "Programas interactivos y simulaciones de phishing",
      why: "Porque tus empleados son clave: un equipo formado es un activo invaluable",
      features: [
        "Talleres prácticos",
        "Simulaciones de ataques",
        "Módulos especializados"
      ]
    },
    {
      icon: <AlertTriangle className="w-8 h-8 text-blue-600" />,
      title: "Respuesta a Incidentes",
      description: "Contención, erradicación y recuperación de incidentes",
      why: "Para minimizar daños y recuperarte rápidamente cuando ocurre lo inesperado",
      features: [
        "Plan de contingencia",
        "Equipo CERT dedicado",
        "Análisis post-incidente"
      ]
    },
    {
      icon: <Code2 className="w-8 h-8 text-blue-600" />,
      title: "Desarrollo Seguro (DevSecOps)",
      description: "Seguridad integrada en el ciclo de vida del desarrollo",
      why: "Para construir aplicaciones robustas y seguras desde su concepción",
      features: [
        "SAST/DAST",
        "Hardening de aplicaciones",
        "Automatización CI/CD"
      ]
    },
    {
      icon: <Key className="w-8 h-8 text-blue-600" />,
      title: "Gestión de Identidades (IAM)",
      description: "Control de accesos con MFA y gestión de privilegios",
      why: "Para garantizar que solo las personas correctas accedan a la información correcta",
      features: [
        "Autenticación multifactor",
        "Gobierno de identidades",
        "PAM (Gestión de accesos privilegiados)"
      ]
    },
    {
      icon: <Binoculars className="w-8 h-8 text-blue-600" />,
      title: "Inteligencia de Amenazas",
      description: "Análisis de actores de amenazas y TTPs",
      why: "Para anticiparte a los ciberdelincuentes con conocimiento proactivo",
      features: [
        "Monitorización dark web",
        "Alertas tempranas",
        "Informes estratégicos"
      ]
    },
    {
      icon: <RotateCw className="w-8 h-8 text-blue-600" />,
      title: "Continuidad de Negocio (BCDR)",
      description: "Planes integrales para recuperación ante desastres",
      why: "Para asegurar la supervivencia y rápida recuperación de tu negocio ante cualquier crisis",
      features: [
        "Análisis de impacto",
        "Planes de contingencia",
        "Pruebas periódicas"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50/80 to-blue-100/60 relative overflow-x-hidden">
      {/* Fondo decorativo moderno */}
      <div className="absolute -top-32 -left-32 w-[400px] h-[400px] bg-blue-300/30 rounded-full blur-3xl z-0 animate-float" />
      <div className="absolute bottom-0 right-0 w-[300px] h-[300px] bg-yellow-100/40 rounded-full blur-2xl z-0 animate-float2" />
      {/* Hero */}
      <section className="relative h-[320px] md:h-[380px] flex items-center justify-center">
        <Image
          src="/hero-cybersecurity.png"
          alt="Ciberseguridad"
          fill
          className="object-cover object-center z-0"
          priority
        />
        <div className="absolute inset-0 bg-blue-900/30 backdrop-blur-sm z-10" aria-hidden="true"></div>
        <div className="relative z-20 w-full text-center px-6">
          <h1 className="text-4xl md:text-5xl font-extrabold mb-4 text-blue-200 drop-shadow-lg tracking-tight">Soluciones Integrales de Ciberseguridad</h1>
          <p className="text-xl md:text-2xl max-w-2xl mx-auto text-white/90 drop-shadow-sm font-light">
            En Sesecpro, ofrecemos un portfolio completo de servicios avanzados, diseñados para proteger tu organización contra las ciberamenazas más sofisticadas.
          </p>
        </div>
      </section>

      {/* Solutions Grid */}
      <section className="py-20 bg-transparent">
        {/* Grid glassmorphism y animaciones */}
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {solutions.map((solution, index) => {
              const sc = solutionContent[index];
              return (
                <div key={index} className="bg-white/70 backdrop-blur-xl border border-blue-100 rounded-3xl shadow-2xl overflow-hidden hover:shadow-2xl transition-all duration-300 flex flex-col animate-fade-in group">
                  <div className="flex flex-col items-center text-center gap-4 p-10">
                    <div className="p-4 bg-gradient-to-br from-blue-300 via-blue-100 to-yellow-50 rounded-2xl shadow-lg animate-pop">
                      {sc.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-blue-700 tracking-tight">{sc.title}</h3>
                    <p className="text-gray-700 font-light text-base md:text-lg">{sc.desc}</p>
                    <ul className="flex flex-col gap-1 text-gray-600 text-sm w-full max-w-xs mx-auto mt-2">
                      {sc.features.map((f, i) => (
                        <li key={i} className="flex items-center gap-2"><span className="inline-block w-4 h-4"><svg fill='none' viewBox='0 0 24 24' stroke='currentColor' className='w-4 h-4 text-green-500'><path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M5 13l4 4L19 7' /></svg></span> {f}</li>
                      ))}
                    </ul>
                    <div className="bg-blue-50 px-4 py-2 rounded-lg text-blue-800 font-medium text-xs mt-3 shadow animate-fade-in">
                      {sc.impact}
                    </div>
                    <Link href="/contact" className="mt-4 inline-block text-white bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-700 hover:to-blue-500 px-7 py-3 rounded-xl shadow-lg transition-all text-base font-semibold focus:outline-none focus:ring-2 focus:ring-blue-300 animate-cta">Más</Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Custom Solution CTA */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">¿Necesitas una Solución a Medida?</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-10">
            Cada organización es única. Nuestro equipo de expertos está listo para diseñar una estrategia personalizada que se adapte perfectamente a tus desafíos y objetivos.
          </p>
          <Link 
            href="/contact" 
            className="inline-block bg-blue-600 text-white font-semibold px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors duration-300"
          >
            Solicita una Consulta Gratuita
          </Link>
        </div>
      </section>

      <Footer bgColor="bg-gray-100" links={[
        { label: 'Aviso Legal', href: '/legal' },
        { label: 'Política de Privacidad', href: '/privacy' },
        { label: 'Política de Cookies', href: '/cookies' }
      ]} />
    </div>
  );
}
