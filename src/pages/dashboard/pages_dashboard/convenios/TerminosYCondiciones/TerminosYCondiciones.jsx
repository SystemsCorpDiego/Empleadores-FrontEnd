import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import ConveniosService from '@/pages/dashboard/pages_dashboard/convenios/ConveniosApi';
import Swal from 'sweetalert2';
import './TerminosYCondiciones.css';

const TerminosYCondiciones = ({ open, setOpen, rowTyC, setRowTyC, fetchData }) => {
  const handleClose = () => setOpen(false);

  const handleAceptar = async () => {

    console.log(rowTyC)
    const response = await ConveniosService.aceptarTerminosYCondiciones(rowTyC)

    console.log('Términos y condiciones aceptados:', response);
    handleClose();
    setRowTyC(null); // Limpiar el estado de la fila después de aceptar
    fetchData()
    if (response === true) {
      Swal.fire({
        icon: 'success',
        title: 'Términos y Condiciones Aceptados',
        text: 'Convenio generado, el mismo será aprobado por ospim.',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#1a76d2',
        showDenyButton: true,     
        })
      };
    
  }
  React.useEffect(() => {
    if (open) {
      Swal.fire({
        title: 'Términos y Condiciones',
        html: `
                        <div class="card">
      <div class="topbar">
        <div>
          <h1>Términos y Condiciones – Portal de Empleadores UOMA</h1>
        </div>
      </div>

      <nav class="toc" aria-label="Índice">
        <a href="#portal" class="index">Términos y Condiciones del Portal</a>
        <a href="#privacidad" class="index" >Política de Privacidad</a>
        <a href="#refinanciacion" class="index">Términos – Convenios de refinanciación</a>
      </nav>

      <section id="portal" class="section" aria-labelledby="h-portal">
        <h2 id="h-portal">Términos y Condiciones para el uso del Portal de Empleadores de la UOMA</h2>
        <p>Al acceder, directamente o a través de algún link al <strong>PORTAL EMPLEADORES</strong> de la <strong>UNIÓN OBRERA MOLINERA ARGENTINA (UOMA)</strong> (<a href="https://uomaempleadores.org.ar" rel="noopener" target="_blank">https://uomaempleadores.org.ar</a>), usted se compromete a cumplir con los términos y condiciones que se detallan a continuación y que se aplicarán a los que ingresen a la página, los que serán denominados en adelante <strong>EMPLEADORES</strong> y/o <strong>EMPLEADOR</strong> y/o <strong>USUARIOS</strong>. </p>
        <p>Si como <strong>USUARIO</strong> de este portal, su voluntad no es dar cumplimiento a los términos y condiciones de uso aquí establecidos, solicitamos sírvase no acceder a este sitio.</p>
        <p><strong>EL EMPLEADOR</strong> es responsable por el buen uso del servicio, comprometiéndose expresamente a evitar cualquier tipo de acción que pueda dañar a sistemas, equipos o servicios que sean accesibles directa o indirectamente a través de Internet, incluyendo la congestión intencional de enlaces o sistemas y de acuerdo a las presentes condiciones.</p>
        <p><strong>EL EMPLEADOR</strong> asume plena responsabilidad frente a la UOMA y a terceros por los daños y perjuicios que se produjeran como consecuencia del accionar propio, de sus dependientes o de terceros conectados a través del usuario y contraseña asignado al EMPLEADOR y los que resulten de la inobservancia de las leyes o reglamentaciones, de otros hechos ilícitos o del mal uso que se haga del servicio, debiendo el usuario indemnizar y mantener indemne a la UOMA ante cualquier reclamo que se pudiera interponer.</p>
        <p>Asimismo, la UOMA no será responsable frente a los EMPLEADORES o a terceros por los daños y perjuicios que se produjeran a los EMPLEADORES o a terceros como consecuencia del accionar de otros EMPLEADORES usuarios o terceros, y los que resulten de la inobservancia por parte de terceros o de los EMPLEADORES, de las leyes o reglamentaciones o de otros hechos ilícitos o del mal uso que se haga del servicio.</p>
        <p>La UOMA no será responsable por ningún daño, pérdidas, o gastos directos, indirectos, inherentes o consecuentes que surjan en relación con este sitio o su imposibilidad de uso por alguna de las partes, o en relación con cualquier falla en el rendimiento, error, omisión, interrupción, defecto, cortes de energía, interrupciones de cualquier índole, demoras en la operación o transmisión, virus de computadora o falla de sistema o línea, o cualquier otra falla que no sea atribuible a la UOMA.</p>
        <p>LOS EMPLEADORES reconocen que los hipervínculos o links con otros sitios o archivos a los que se puede acceder desde los sitios de la UOMA, son a su propio riesgo. La UOMA no investiga, verifica, controla ni respalda el contenido, la exactitud, las opiniones expresadas en otras conexiones suministradas por otros sitios que no sean los propios, las cuales se rigen por sus propios Términos y Condiciones de Uso.</p>
        <p>Los servicios y/o productos que pueden conocerse u ofrecerse a través del SITIO de la UOMA, reunirán las condiciones que cada empresa y/u organismo determine, reservándose éstas el derecho de cancelar, modificar, limitar, etc., la provisión de los mismos, no generando esto responsabilidad alguna para la UOMA. El uso de los beneficios y/o servicios que se presentan u ofrecen es privativo de quienes se adhieran a los mismos y no para todos los usuarios del SITIO.</p>
        <p>La UOMA tendrá el derecho de ampliar, alterar o mejorar los servicios ofrecidos, como también podrá modificar estas condiciones, modalidad de acceso al servicio, las relacionadas o no con temas técnicos, o las mismas condiciones comerciales y de mercado que rijan los servicios ofrecidos en cualquier momento, sin necesidad de comunicación previa.</p>
        <p>La elegibilidad de ciertos productos y servicios está sujeta a la determinación, aceptación y al cumplimiento de las condiciones que la UOMA establece, pudiendo suceder que toda o parte de la información, productos y/o servicios que se ofrecen en estas páginas no estén disponibles para todas las áreas geográficas del país y/o del exterior.</p>
        <p>La información suministrada por LOS EMPLEADORES al ingresar a este SITIO es de exclusiva responsabilidad de los mismos, siendo la UOMA, AMTIMA y OSPIM ajenas a cualquier responsabilidad que sobre la misma pudiera corresponder. La UOMA no es responsable por la veracidad y exactitud de la información que esos sitios provean, ni de los cambios que sobre la misma pudieran realizar.</p>
        <p>El acceso a otras páginas a través de este sitio no dará obligación alguna para la UOMA respecto de la información que en esas otras páginas pudieran contener, siendo esta responsabilidad única y excluyente de las empresas y/u organismos que la provean.</p>
        <p>Asimismo la UOMA no se responsabiliza por los errores u omisiones sobre la información brindada, por las fallas o defectos que pudieran presentar los productos, bienes y/o servicios, mediante el acceso desde su SITIO, a los demás sitios a los que a través del mismo se pudiera obtener, ni de los gastos directos y/o indirectos que estos provoquen. Los productos, bienes y/o servicios se proveerán según las condiciones que cada empresa y/u organismo determinen e indique y bajo las condiciones que éstas impongan.</p>
        <p>Los datos que son recolectados o utilizados en el SITIO de la UOMA, están amparados por la Política de Privacidad, la cual puede ser consultada en el SITIO <a href="https://www.uoma.org.ar" rel="noopener" target="_blank">www.uoma.org.ar</a>.</p>
      </section>

      <section id="privacidad" class="section" aria-labelledby="h-privacidad">
        <h2 id="h-privacidad">Política de Privacidad</h2>
        <h3>1. Declaración General</h3>
        <p>La <strong>UNIÓN OBRERA MOLINERA ARGENTINA</strong> (en adelante "UOMA"), se encuentra comprometida con el resguardo de la intimidad de los usuarios de su portal, en virtud de ello es que realizará su mejor esfuerzo y el que considere necesario para que los usuarios de su Sitio Web, (en adelante el "SITIO") se encuentren protegidos, entendiendo que el uso o visita al mismo será sin ninguna intención maliciosa o dolo.</p>
        <p>La presente política de privacidad se aplica exclusivamente a la información ofrecida y recibida por los usuarios del SITIO de la UOMA y no a la ofrecida a otras o por otras compañías u organizaciones o Sitios Web con los que el SITIO contenga enlaces y sobre los que la UOMA no tiene su control. La UOMA no se responsabiliza por el actuar de los Sitios Web a los cuales se puede acceder por medio del SITIO, por lo que recomendamos la lectura de la Política de Privacidad de cada uno ellos.</p>
        <p>Mediante el SITIO, la UOMA puede recopilar cierta información, sobre la que usted debe entender plenamente nuestra política con respecto al uso de la información que recogemos. Esta declaración sobre Política de Privacidad revela qué información recogemos, cómo la usamos y cómo puede corregirse o cambiarse.</p>
        <p>La UOMA tiene políticas, normas y procedimientos relativos a la seguridad física y lógica, las que están en permanente revisión, actualización y mejora, para el cumplimiento de las leyes y regulaciones a nivel nacional que así lo exigen para la protección de los datos personales.</p>

        <h3>2. Información General</h3>
        <p>Nuestro sistema podría obtener información automáticamente acerca de su conducta cuando navega por el SITIO, a través de una "cookie". Una cookie es un pequeño archivo de datos que algunos Sitios Web escriben en el disco duro de su computadora cuando usted los visita. Un archivo cookie puede contener tal información como la identificación del usuario que el sitio utiliza para rastrear las páginas que usted ha visitado. Pero la única información personal que una cookie puede contener es información que usted mismo suministra. Una cookie NO puede leer datos de su disco duro ni leer los archivos cookie creados por otros sitios. La UOMA podría utilizar cookies para rastrear los patrones de tráfico del usuario cuando navega por ciertas páginas del SITIO. Si usted ha ajustado su navegador para que le avise antes de aceptar cookies, recibirá el mensaje de advertencia con cada cookie. Usted puede rehusar aceptar cookies, desactivándolas en su navegador. Usted no necesita tener las cookies activadas para usar los SITIOS de la UOMA. Si usted rehúsa aceptar cookies, existe la posibilidad de que usted no tenga acceso a ciertos servicios brindados por el SITIO.</p>

        <h3>3. Información específica sobre usted</h3>
        <p>En ciertos casos la UOMA tiene la necesidad de acceder a datos personales suyos, como por ejemplo su nombre completo, su domicilio, su dirección de e-mail o su número de socio o telefónico (en adelante, “información personal”). La UOMA necesita dicha información personal para poder brindar los servicios que ofrece a través del SITIO. En ciertos lugares del SITIO, se le requerirá Información Personal a los fines de facilitarle el uso de, o su participación en encuestas, foros, suscripciones, envíos e inclusiones de contenido en nuestros boletines, registración en suscripciones y/o con relación a cualesquiera otras actividades, servicios o recursos que podamos suministrar u ofrecer en nuestro sitio. En todos estos casos, solo recopilaremos y/o almacenaremos su Información Personal en caso que usted nos suministre voluntariamente la misma, y mediante un proceso de aceptación. Mediante esta aceptación, nos autoriza a su uso para los fines indicados. La UOMA no vende, alquila, intercambia ni presta información personal de ninguna índole con ninguna persona o empresa, excepto con la ASOCIACIÓN MUTUAL DE TRABAJADORES DE LA INDUSTRIA MOLINERA (AMTIMA) y la OBRA SOCIAL DEL PERSONAL DE LA INDUSTRIA MOLINERA (OSPIM).</p>

        <h3>4. Fines de la recopilación</h3>
        <p>La UOMA podría recoger información personal en el SITIO para: autenticar al usuario, dar un servicio al mismo, elaborar resultados, y otros intercambios de información en su SITIO. En caso que nos provea su Información Personal, mediante el envío de un mail, la misma será utilizada para los fines requeridos en el mail. Ingresando su Información Personal mediante cualquier canal dentro del SITIO, acepta que podemos archivar su Información Personal y/o cualquier otro dato que haya ingresado por esta vía, o bien descartar esa información en forma parcial o total luego.</p>

        <h3>5. Uso de la información</h3>
        <p>La UOMA no revelará ni compartirá ninguna información que pueda identificar a las personas con ninguna organización ajena a la UOMA sin el consentimiento expreso del USUARIO y/o cualquier otra persona que proporcione la información. La UOMA puede utilizar la información para enviar al usuario información sobre la UOMA y/o relacionada con las obligaciones que emergen de la ley 23.551; Resoluciones N° 42/1984 y N° 108/1996 de la Dirección Nacional de Asociaciones Sindicales y N° 262 de la Dirección Nacional de Relaciones del Trabajo y del Convenio Colectivo de Trabajo N° 66/89. La información personal que usted le suministró a la UOMA no será revelada a nadie fuera de la UOMA y sus organizaciones afines (AMTIMA y OSPIM). No compartimos información sobre o usuarios individuales con ningún tercero u otras empresas.</p>

        <h3>6. Excepciones</h3>
        <p>No obstante cualquier otra provisión en contrario en esta declaración, la UOMA podrá divulgar cierta información privada solo en caso de:</p>
        <ul>
          <li>a) cumplir una exigencia legal tal como una orden de allanamiento, una citación judicial, una orden judicial;</li>
          <li>b) cumplir un requerimiento de una autoridad gubernamental o reguladora.</li>
        </ul>

        <h3>7. Derecho de acceso, rectificación y supresión</h3>
        <p>La UOMA reconoce al Titular de los Datos Personales, previa acreditación de su identidad, el derecho a solicitar y a obtener información sobre sus datos personales incluidos en sus registros, dentro de los diez días hábiles desde la solicitud, de conformidad con lo establecido en la Ley 25326 de protección de Datos Personales.</p>
        <p>La UOMA garantiza también al Titular de los Datos Personales el derecho a obtener la rectificación, actualización y, cuando corresponda, la supresión de los datos personales de los que sea titular, que estén incluidos en su banco de datos y garantiza la rectificación, supresión o actualización de los mismos en el plazo máximo de cinco días hábiles de recibido el reclamo del titular de los datos.</p>
        <p>En cumplimiento de la disposición 10/2008 de la Dirección Nacional de Protección de Datos Personales se hace saber que:</p>
        <p>El Titular de los Datos Personales tiene la facultad de ejercer el derecho de acceso a los mismos en forma gratuita y en intervalos no inferiores a seis meses, salvo que acredite un interés legítimo al efecto, conforme con lo establecido en el artículo 14, inciso 3 de la Ley N° 25.326.</p>
        <p>Los derechos de acceso y rectificación de datos, se deberán ejercer a través de correo electrónico dirigido a <a href="mailto:empleadores@uoma.org.ar">empleadores@uoma.org.ar</a> a requerimiento del titular de los datos sin costo alguno. Para ello se deberá remitir un correo electrónico a la dirección mencionada, con el asunto “Informar”, “Rectificar”, “Suprimir” y/o “Actualizar” según corresponda, conjuntamente con el objeto del requerimiento.</p>
        <p>La UOMA podrá denegar el acceso, rectificación o la supresión de los datos personales registrados únicamente por las causas previstas en la Ley de protección de datos personales.</p>

        <h3>8. Actualización de la Política de Privacidad</h3>
        <p>La UOMA podrá rever, revisar y/o actualizar permanentemente todos los aspectos relativos a la Seguridad y Privacidad de su SITIO. En el momento que las mismas sean actualizadas, le será informado por esta vía, de manera que usted siempre pueda saber qué información recogemos, cuál será el uso que le daremos a la misma.</p>

        <h3>9. Aceptación de estos términos</h3>
        <p>Al utilizar nuestro SITIO, Ud. está manifestando conocer nuestra Política de Privacidad y de los Términos y Condiciones de uso del WebSite, por lo que consideramos aceptadas las mismas.</p>
      </section>

      <section id="refinanciacion" class="section" aria-labelledby="h-refi">
        <h2 id="h-refi">Términos y Condiciones para el acceso y descarga de convenios de refinanciación de deuda</h2>
        <ol>
          <li>Estos Términos y Condiciones serán de aplicación para acceder a los acuerdos de refinanciación que ofrece la UOMA a través del Portal de Empleadores (<a href="https://www.uoma.org.ar" target="_blank" rel="noopener">www.uoma.org.ar</a>).</li>
          <li>Los acuerdos de refinanciación ofrecidos por la UOMA a los EMPLEADORES tienen por objeto la cancelación de deudas por aportes retenidos y no ingresados en concepto de Cuota Sindical, Aporte Solidario y Usufructo de Convenio (Ley 23.551; Resoluciones N° 42/1984 y N° 108/1996 de la Dirección Nacional de Asociaciones Sindicales y N° 262 de la Dirección Nacional de Relaciones del Trabajo) y contribuciones debidas en virtud de lo dispuesto por el Artículo 46 del Convenio Colectivo de Trabajo N° 66/89.</li>
          <li>Solo podrán completar y firmar dichos acuerdos los representantes legales de los EMPLEADORES y/o apoderados con facultades suficientes para reconocer deudas, a través del usuario y clave asignada a ese empleador. El uso del usuario y clave asignado al EMPLEADOR, es de exclusiva responsabilidad de los representantes legales de los EMPLEADORES. La delegación del usuario y clave en otros dependientes, para descargar, completar y firmar acuerdos, es de exclusiva responsabilidad de los representantes legales del EMPLEADOR, quedando este obligado por los actos de dichas personas.</li>
          <li>Serán requisitos para que los EMPLEADORES completen y firmen los acuerdos de refinanciación, disponer de una Cuenta Corriente Bancaria Activa para cancelar la deuda refinanciada a través del libramiento de echeqs a favor de la UOMA.</li>
          <li>EL EMPLEADOR que solicita una refinanciación de un Acta o deuda con la UOMA no debe poseer otros acuerdos de refinanciación vigentes y aún no cancelados.</li>
          <li>El EMPLEADOR accederá a la sección de Acuerdos, una vez aceptados estos términos y condiciones, y seleccionará las deudas que desea refinanciar. Posteriormente, elegirá el número de cuotas mensuales disponibles e ingresará los datos de los echeqs con los cuales pagará cada una de las cuotas comprometidas.</li>
          <li>El monto total de la deuda, con los intereses de refinanciación incluidos, podrá ser visibilizado en el acuerdo una vez que haya completado la información requerida en el pto. 4 y confirmada la misma.</li>
          <li>El último paso que le exigirá el sistema será confirmar la refinanciación y firma del acuerdo, la cual se realizará a través del ingreso del nombre de usuario y contraseña asignado a ese empleador, las que resultan únicas e intransferibles contenedoras de los caracteres que solo los EMPLEADORES conocen, y mediante la aceptación de estos términos y condiciones, previamente consensuados entre el EMPLEADOR y la UOMA.</li>
          <li>Se deja constancia, que la sola firma electrónica del acuerdo implica el reconocimiento de las Actas y deudas que se refinancian. Sin perjuicio de ello, la UOMA podrá solicitar al EMPLEADOR que adjunte escaneado en formato pdf al sistema, copia del acuerdo suscripto electrónicamente por el representante legal y/o apoderado con facultades suficientes para reconocer deudas, acompañando al mismo la documentación que acredita la personería invocada.</li>
          <li>El acuerdo solo surtirá efectos entre las partes a partir del día que figure ACEPTADO por la UOMA, siendo requisito para ello que dentro de las 48 horas de firmado electrónicamente el mismo, EL EMPLEADOR libre a favor de la UOMA los echeqs detallados en el acuerdo de refinanciación.</li>
          <li>La refinanciación será abonada en los términos preestablecidos en los acuerdos aplicándose los intereses legales allí previstos y que el EMPLEADOR declara conocer con antelación y prestar conformidad. La periodicidad de las cuotas será mensual.</li>
          <li>Solo en los casos en que el EMPLEADOR adjunte el acuerdo escaneado con firma ológrafa podrá éste solicitar a la UOMA, dentro de los 10 días, remitir por correo electrónico a la casilla que denuncie o hubiere denunciado el EMPLEADOR, un ejemplar del contrato firmado por alguno de los representantes legales o apoderados del sindicato.</li>
          <li>Acreditado la totalidad de los pagos convenidos en el acuerdo de refinanciación, EL EMPLEADOR podrá solicitar a la UOMA el correspondiente recibo de ley por el Acta o deuda refinanciada.</li>
          <li>Las partes pactan la mora automática de las obligaciones acordadas en el acuerdo. Consecuentemente, la falta de pago de cualquiera de las cuotas fijadas y/o el incumplimiento de cualquiera de las obligaciones contraídas por EL EMPLEADOR en el convenio, o si incurriere en estado de cesación de pagos, presentación en concurso, pedido de quiebra, facultará a la UOMA a: i) dejar sin efecto el presente acuerdo caducando condiciones de pago y demás facilidades que se hubieran acordado y dará lugar a la inmediata iniciación de acciones judiciales por el saldo que permanezca insoluto, conforme lo originariamente convenido. En tal caso, las sumas que hubiesen sido recibidas serán imputadas en primer lugar a los intereses y por último del capital, si correspondiere, en ese orden ; o ii) ejecutar el presente convenio.</li>
          <li>El clic en <strong>SÍ ACEPTO</strong> importará mi expresa aceptación a todos y cada uno de los Términos y Condiciones indicados precedentemente, y la constancia de haber tomado conocimiento y aceptado los Términos y Condiciones para la utilización del Portal de Empleadores de la UOMA y el acceso a los convenios de refinanciación allí ofrecidos, así como también de haber obtenido toda la información necesaria para utilizar correctamente este medio, los riesgos derivados de su empleo y quien asume los mismos. El clic en <strong>IMPRIMIR</strong> me permite obtener una copia del presente, cuyo texto también se encuentra a mi disposición en el sitio web Portal de Empleadores (<a href="https://uomaempleadores.org.ar" target="_blank" rel="noopener">https://uomaempleadores.org.ar</a>).</li>
        </ol>
      </section>
    </div>

                `,
  showCancelButton: true,
  showDenyButton: true,
  confirmButtonText: 'Aceptar Términos y Condiciones',
  denyButtonText: 'Imprimir',
  denyButtonColor: '#1a76d2',
  cancelButtonText: 'Cancelar',
  confirmButtonColor: '#1a76d2',
  reverseButtons: true,
  customClass: {
    popup: 'swal2-modal-tyc',
  },
  width: '80vw',
  maxWidth: '1200px',

  // 🔴 clave para que NO se cierre antes de imprimir
  preDeny: () => {
    // Marca body para que el CSS "imprimir solo el modal" de este componente
    // no quede afectando impresiones de otras pantallas (ver TerminosYCondiciones.css)
    document.body.classList.add('tyc-printing');
    const quitarMarca = () => {
      document.body.classList.remove('tyc-printing');
      window.removeEventListener('afterprint', quitarMarca);
    };
    window.addEventListener('afterprint', quitarMarca);
    window.print();
    return false; // evita que swal se cierre
  }

}).then(async (result) => {

  if (result.isConfirmed) {
    await handleAceptar();
  }

  handleClose();
});
    }
  }, [open]);

}
export default TerminosYCondiciones;
