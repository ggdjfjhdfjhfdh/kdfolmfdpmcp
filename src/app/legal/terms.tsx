import Link from 'next/link';

export default function Terms() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-6">
      <h1 className="text-3xl font-bold mb-8">Aviso Legal y Condiciones Generales de Uso</h1>
      <h2 className="text-2xl font-bold mt-10 mb-4">I. Información General</h2>
      <p className="mb-6">En cumplimiento con el deber de información dispuesto en la Ley 34/2002 de Servicios de la Sociedad de la Información y el Comercio Electrónico (LSSI-CE) de 11 de julio, se facilitan a continuación los siguientes datos de información general de este sitio web:</p>
      <ul className="mb-6 pl-6 list-disc">
        <li>Email de contacto: <a href="mailto:contacto@sesecpro.es" className="text-blue-600 hover:underline">contacto@sesecpro.es</a></li>
      </ul>
      <h2 className="text-2xl font-bold mt-10 mb-4">II. Términos y Condiciones Generales de Uso</h2>
      <p className="mb-6">El objeto de las presentes Condiciones Generales de Uso (en adelante, Condiciones) es regular el acceso y la utilización del Sitio Web. El acceso es libre y gratuito, salvo el coste de conexión a través de la red de telecomunicaciones. El uso de algunos servicios puede requerir registro previo.</p>
      <p className="mb-6">Sesecpro se reserva la facultad de modificar, en cualquier momento y sin aviso previo, la presentación y configuración del Sitio Web, así como de interrumpir, desactivar y/o cancelar elementos o el acceso.</p>
      <h2 className="text-2xl font-bold mt-10 mb-4">III. Acceso y Navegación: Exclusión de Garantías y Responsabilidad</h2>
      <p className="mb-6">Sesecpro no garantiza la continuidad, disponibilidad y utilidad del Sitio Web, ni de los Contenidos o Servicios. No se responsabiliza de que el acceso sea ininterrumpido o libre de error, ni de daños ocasionados al sistema informático del Usuario.</p>
      <h2 className="text-2xl font-bold mt-10 mb-4">IV. Política de Enlaces</h2>
      <p className="mb-6">El Sitio Web puede poner a disposición de los Usuarios enlaces, directorios y motores de búsqueda que permiten acceder a sitios web de terceros. No implica recomendación o invitación para visitarlos.</p>
      <h2 className="text-2xl font-bold mt-10 mb-4">V. Propiedad Intelectual e Industrial</h2>
      <p className="mb-6">Sesecpro es titular de todos los derechos de propiedad intelectual e industrial del Sitio Web y de los elementos contenidos en el mismo. Se consideran obras protegidas por la normativa española y comunitaria.</p>
      <h2 className="text-2xl font-bold mt-10 mb-4">VI. Acciones Legales, Legislación Aplicable y Jurisdicción</h2>
      <p className="mb-6">Sesecpro se reserva el derecho de presentar acciones legales por el uso indebido del Sitio Web y Contenidos. La relación entre Usuario y Sesecpro se regirá por la normativa española. Las partes se someten a la jurisdicción ordinaria de los jueces y tribunales que correspondan.</p>
      <Link href="/" className="text-blue-600 hover:underline block mt-8">Volver al inicio</Link>
    </div>
  );
}
