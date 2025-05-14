import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-6">
      <h1 className="text-3xl font-bold mb-8">Política de Privacidad y Protección de Datos</h1>
      <p className="mb-6">Respetando lo establecido en la legislación vigente, Sesecpro (en adelante, “Sitio Web”) se compromete a adoptar las medidas técnicas y organizativas necesarias, según el nivel de seguridad adecuado al riesgo de los datos recogidos.</p>
      <h2 className="text-2xl font-bold mt-10 mb-4">Leyes que incorpora esta política de privacidad</h2>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>Reglamento (UE) 2016/679 (RGPD).</li>
        <li>Ley Orgánica 3/2018 (LOPD-GDD).</li>
        <li>Real Decreto 1720/2007 (RDLOPD).</li>
        <li>Ley 34/2002 (LSSI-CE).</li>
      </ul>
      <h2 className="text-2xl font-bold mt-10 mb-4">Identidad del responsable del tratamiento</h2>
      <p className="mb-2">Sesecpro, NIF: – (en adelante, “Responsable del tratamiento”)</p>
      <p className="mb-6">Email de contacto: <a href="mailto:contacto@sesecpro.es" className="text-blue-600 hover:underline">contacto@sesecpro.es</a></p>
      <h2 className="text-2xl font-bold mt-10 mb-4">Registro de Datos de Carácter Personal</h2>
      <p className="mb-6">En cumplimiento del RGPD y la LOPD-GDD, los datos personales recabados por Sesecpro serán tratados con el fin de facilitar, agilizar y cumplir los compromisos establecidos, o para atender solicitudes o consultas del Usuario. Se mantiene un registro de actividades de tratamiento según el RGPD.</p>
      <h2 className="text-2xl font-bold mt-10 mb-4">Principios aplicables al tratamiento</h2>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>Licitud, lealtad y transparencia</li>
        <li>Limitación de la finalidad</li>
        <li>Minimización de datos</li>
        <li>Exactitud</li>
        <li>Limitación del plazo de conservación</li>
        <li>Integridad y confidencialidad</li>
        <li>Responsabilidad proactiva</li>
      </ul>
      <h2 className="text-2xl font-bold mt-10 mb-4">Categorías de datos personales</h2>
      <p className="mb-6">Solo se tratan datos identificativos. No se tratan categorías especiales de datos personales.</p>
      <h2 className="text-2xl font-bold mt-10 mb-4">Base legal para el tratamiento</h2>
      <p className="mb-6">La base legal es el consentimiento del Usuario, que puede retirarse en cualquier momento. En los formularios se informará de los campos obligatorios.</p>
      <h2 className="text-2xl font-bold mt-10 mb-4">Fines del tratamiento</h2>
      <p className="mb-6">Los datos personales se recogen para facilitar, agilizar y cumplir compromisos, atender solicitudes, y podrán usarse con fines comerciales, estadísticos y de mejora del Sitio Web.</p>
      <h2 className="text-2xl font-bold mt-10 mb-4">Períodos de retención</h2>
      <p className="mb-6">Se conservarán durante el tiempo mínimo necesario, o hasta que el Usuario solicite su supresión.</p>
      <h2 className="text-2xl font-bold mt-10 mb-4">Destinatarios de los datos</h2>
      <p className="mb-6">No se comparten datos con terceros. Se informará al Usuario en caso contrario.</p>
      <h2 className="text-2xl font-bold mt-10 mb-4">Menores de edad</h2>
      <p className="mb-6">Solo los mayores de 14 años pueden consentir el tratamiento de sus datos. Para menores de 14, se requiere consentimiento de padres o tutores.</p>
      <h2 className="text-2xl font-bold mt-10 mb-4">Seguridad y confidencialidad</h2>
      <p className="mb-6">Sesecpro adopta medidas técnicas y organizativas para garantizar la seguridad de los datos. El Sitio Web usa certificado SSL. En caso de violación de seguridad, se notificará al Usuario.</p>
      <h2 className="text-2xl font-bold mt-10 mb-4">Derechos del Usuario</h2>
      <ul className="list-disc pl-6 mb-6 space-y-2">
        <li>Acceso</li>
        <li>Rectificación</li>
        <li>Supresión (“derecho al olvido”)</li>
        <li>Limitación del tratamiento</li>
        <li>Portabilidad</li>
        <li>Oposición</li>
        <li>No ser objeto de decisiones automatizadas</li>
      </ul>
      <p className="mb-6">Para ejercer estos derechos, envía solicitud con nombre, apellidos, copia de DNI, descripción, domicilio, fecha, firma y documentación a:</p>
      <ul className="mb-6 pl-6 list-disc">
        <li>Dirección postal: Valencia, España</li>
        <li>Email: <a href="mailto:contacto@sesecpro.es" className="text-blue-600 hover:underline">contacto@sesecpro.es</a></li>
      </ul>
      <h2 className="text-2xl font-bold mt-10 mb-4">Enlaces a sitios de terceros</h2>
      <p className="mb-6">El Sitio Web puede contener enlaces a sitios de terceros con sus propias políticas de privacidad.</p>
      <h2 className="text-2xl font-bold mt-10 mb-4">Reclamaciones</h2>
      <p className="mb-6">El Usuario puede reclamar ante la Agencia Española de Protección de Datos si considera que existe una infracción.</p>
      <h2 className="text-2xl font-bold mt-10 mb-4">Aceptación y cambios</h2>
      <p className="mb-6">El uso del Sitio Web implica la aceptación de esta política. Sesecpro puede modificarla en función de cambios legislativos. Consulta esta página periódicamente para actualizaciones.</p>
      <p className="text-xs text-gray-500 mt-8">Actualizada para adaptarse al RGPD y a la Ley Orgánica 3/2018.</p>
      <Link href="/" className="text-blue-600 hover:underline block mt-8">Volver al inicio</Link>
    </div>
  );
}
