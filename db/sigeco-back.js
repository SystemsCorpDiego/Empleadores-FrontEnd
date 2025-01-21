module.exports = (req, res, next) => {
  console.log('Middleware - SIGECO - INIT - getAPI: ' + getAPI(req, res));

  console.log('Middleware - SIGECO - req.url: ' + req.method + '->' + req.url);
  //console.log("Middleware - SIGECO - req.body:" + req.body);

  function getAPI(req, res) {
    if (req.method === 'GET' && req.url == '/ospim/contacto') {
      return 'OSPIM-CONTACTO';
    }

    if (req.method === 'GET' && req.url.endsWith('/DDJJ/imprimir/')) {
      return 'DDJJ-IMPRIMIR';
    }

    if (
      req.method === 'POST' &&
      req.url.toLowerCase().endsWith('/ddjj/validar')
    ) {
      return 'DDJJ-VALIDAR-NIVEL2';
    }

    if (
      req.method === 'POST' &&
      req.url.endsWith('/ddjj/upload/nomina/validaCuil')
    ) {
      console.log('URL:', req.url);

      const [cuil1, cuil2, cuil3] = req.body;

      // Si todos los cuiles tienes 11 caracteres, se envía una respuesta exitosa
      if (cuil1.length === 11 && cuil2.length === 11 && cuil3.length === 11) {
        const jsonExitoso = [
          {
            cuil: '20949118682',
            inte: 0,
            apellido: 'Salinas',
            nombre: 'luis',
            cuilValido: true,
          },
          {
            cuil: '20949118782',
            inte: null,
            apellido: null,
            nombre: null,
            cuilValido: true,
          },
          {
            cuil: '21345667876',
            inte: null,
            apellido: null,
            nombre: null,
            cuilValido: true,
          },
        ];

        res.json(jsonExitoso);
      } else {
        const jsonFallido = [
          {
            cuil: cuil1,
            inte: 0,
            apellido: 'Salinas',
            nombre: 'luis',
            cuilValido: true,
          },
          {
            cuil: cuil2,
            inte: null,
            apellido: null,
            nombre: null,
            cuilValido: true,
          },
          {
            cuil: cuil3,
            inte: null,
            apellido: null,
            nombre: null,
            cuilValido: false,
          },
        ];

        res.json(jsonFallido);
      }
    }

    if (req.method === 'GET' && req.url.startsWith('/feriados/duplicar/')) {
      return 'FERIADOS-DUPLICAR';
    }

    let regEx = /([DDJJConsulta]|[DDJJ])/i;
    if (
      req.method === 'GET' &&
      regEx.test(req.url) &&
      !req.url.startsWith('/empresa/periodo/tiene-rectificativa') &&
      req.query.empresaId &&
      req.query.periodo
    ) {
      return 'DDJJ-PERIODO-VALIDAR';
    }

    if (
      req.method === 'POST' &&
      req.url.startsWith('/DDJJ?') &&
      req.query.empresaId
    ) {
      return 'DDJJ-ALTA-V2';
    }

    if (
      req.method === 'GET' &&
      req.url === '/auth/dfa/usuario-loguedo-habilitado'
    ) {
      return 'LOGIN-HABILITADO';
    }

    if (req.method === 'POST' && req.url === '/auth/login-dfa') {
      return 'LOGIN-DFA';
    }
    if (req.method === 'POST' && req.url === '/auth/login') {
      return 'LOGIN';
    }

    let pattern = /\bcategoria/;
    let result = req.url.search(pattern);
    if ((req.method === 'POST' || req.method === 'PUT') && result > -1) {
      return 'CATEGORIAS';
    }

    if (
      req.method === 'GET' &&
      req.url.startsWith('/comun/cui/') &&
      req.url.endsWith('/validar')
    ) {
      return 'COMUN-CUI-VALIDAR';
    }
    ///empresa/:empresaId/domicilio/planta/
    if (
      req.method === 'GET' &&
      req.url.startsWith('/empresaDomicilio/planta')
    ) {
      ///empresaDomicilio/planta?empresaId=1
      return 'EMPRESA-PLANTA-CONSULTA';
    }

    if (req.method === 'POST' && req.url.startsWith('/empresaDomicilio')) {
      return 'EMPRESA-DOMICILIO-ALTA';
    }

    if (req.method === 'POST' && req.url.startsWith('/DDJJConsulta')) {
      return 'DDJJ-ALTA';
    }
    if (req.method === 'PUT' && req.url.startsWith('/DDJJConsulta')) {
      return 'DDJJ-MODI';
    }

    if (
      req.method === 'GET' &&
      req.url.startsWith('/rol/funcionalidad/getRel')
    ) {
      return 'ROL-FUNC-REL-CONS';
    }

    if (req.method === 'PUT' && req.url.startsWith('/rolFuncionalidad/')) {
      return 'ROL-FUNC-REL-ALTA';
    }

    if (req.method === 'DELETE' && req.url.startsWith('/rolFuncionalidad/')) {
      return 'ROL-FUNC-REL-BAJA';
    }

    if (req.method === 'DELETE' && req.url.startsWith('/aportes/?')) {
      return 'APORTES-BAJA';
    }

    if (req.method === 'PUT' && req.url.startsWith('/aportes/?')) {
      return 'APORTES-MODI';
    }

    if (
      (req.method === 'PUT' || req.method === 'POST') &&
      req.url.startsWith('/aportesDetalle/?')
    ) {
      return 'APORTE-DETALLE-ALTA';
    }

    if (req.method === 'GET' && req.url.startsWith('/empresa/ddjj/boletas')) {
      console.log('Entre en el boleta detalle');
      return 'BOLETA-DETALLE';
    }
    if (req.method === 'POST' && req.url.startsWith('/empresa/ddjj/boletas')) {
      return 'CALCULAR-INTERESES';
    }
    if (req.method === 'POST' && req.url.startsWith('/empresa/ddjj/boleta')) {
      return 'CALCULAR-INTERES';
    }

    if (
      req.method === 'GET' &&
      req.url.startsWith('/empresa/ddjj/boleta/codigo')
    ) {
    }
    if (
      req.method === 'GET' &&
      req.url.startsWith('/empresa/ddjj/boleta/codigo')
    ) {
      return 'BOLETA-DDJJ-CODIGO';
    }
    if (
      req.method === 'GET' &&
      req.url.startsWith('/empresa/ddjj/boleta-pago/concepto/imprimir-detalle')
    ) {
      return 'DETALLE-BOLETA-IMPRIMIR';
    }
    if (
      req.method === 'GET' &&
      req.url.startsWith('/empresa/ddjj/boleta-pago/concepto/imprimir-boleta')
    ) {
      return 'BOLETA-IMPRIMIR';
    }
    if (
      req.method === 'GET' &&
      req.url.startsWith('/empresa/periodo/tiene-rectificativa')
    ) {
      return 'TIENE-RECTIFICATIVA';
    }
    if (req.method === 'POST' && req.url.startsWith('/empresa/otras_boletas')) {
      //REVISAR ESTA PARTE
      return 'GENERAR-SIN-DDJJ';
    }
    if (
      req.method === 'POST' &&
      req.url.startsWith('/empresa/ddjj/guardar-boletas')
    ) {
      return 'GUARDAR-BOLETAS';
    }
    if (req.method === 'GET' && req.url.startsWith('/empresa/boletas')) {
      console.log('Entre donde queria');
      return 'GET-BOLETA-BY-ID';
    }
    if (req.method === 'PUT' && req.url.startsWith('/empresa/boletas')) {
      console.log('entramos por aca');
      return 'MODIFICAR-BOLETA-BY-ID';
    }
    if (req.url.startsWith('/sigeco/ajustes')) {
      if (req.method === 'PUT') {
        return 'UPDATE-AJUSTE';
      } else {
        console.log('entre');
        return 'DELETE-AJUSTE';
      }
    }
    console.log('ESTO ES EL URL QUE ESTA COMPARANDO: ' + req.url);
    if (req.method === 'GET' && req.url.startsWith('/empresa/1/boleta/')) {
      console.log('Si entre');
      return 'GET-BOLETA-SIN-DDJJ';
    }

    if (req.method === 'PATCH' && req.url.startsWith('/DDJJ/')) {
      return 'DDJJ-PRESENTAR';
    }

    if (req.method === 'PUT' && req.url.startsWith('/funcionalidades/id')) {
      console.log('Llegamos al coso que me manda a la funcion');
      return 'ACTUALIZAR-ROL-FUNCIONALIDAD';
    }
    if (
      req.method === 'GET' &&
      req.url.startsWith('/rolFuncionalidades/by-rol')
    ) {
      return 'GET-FUNCIONALIDAD-BY-ROL';
    }

    if (req.method === 'DELETE' && req.url.startsWith('/afip/intereses')) {
      return 'DELETE-INTERES';
    }
    if (req.method === 'PUT' && req.url.startsWith('/afip/intereses')) {
      return 'UPDATE-INTERES';
    }
    if (req.url.startsWith('/error/401')) {
      return 'ERROR401';
    }
    if (req.method === 'PATCH' && req.url.startsWith('/usuario-interno')) {
      return 'PATCH-USUARIO-ACTIVO';
    }

    return '----';
  }

  switch (getAPI(req, res)) {
    case 'DDJJ-MISDDJJ-CONSULTA':
      ddjjGenerarTotales();
      break;
    case 'DDJJ-PERIODO-VALIDAR':
      validarPeriodo();
      break;
    case 'LOGIN-HABILITADO':
      validarLoguinHabilitado();
      next();
      break;
    case 'LOGIN-DFA':
      validarLoguinDFA();
      break;
    case 'LOGIN':
      validarLoguin();
      break;
    case 'CATEGORIAS':
      categoriasURL();
      break;
    case 'COMUN-CUI-VALIDAR':
      validarCUI();
      break;
    case 'EMPRESA-PLANTA-CONSULTA':
      empresaPlataConsulta();
      break;
    case 'EMPRESA-DOMICILIO-ALTA':
      empresaDomicilioAlta();
      break;
    case 'DDJJ-ALTA':
      DDJJSetParams();
      break;
    case 'DDJJ-ALTA-V2':
      DDJJSetParamsV2();
      break;
    case 'DDJJ-IMPRIMIR':
      DDJJImprimir();
      break;
    case 'DDJJ-MODI':
      DDJJSetParams();
      break;
    case 'ROL-FUNC-REL-CONS':
      RolFuncionalidadRelCons();
      break;
    case 'ROL-FUNC-REL-ALTA':
      RolFuncionalidadRelAlta();
      break;
    case 'ROL-FUNC-REL-BAJA':
      RolFuncionalidadRelBaja();
      break;
    case 'APORTES-BAJA':
      AportesBaja();
      break;
    case 'APORTES-MODI':
      AportesModi();
      break;
    case 'APORTE-DETALLE-ALTA':
      AporteDetalleAlta();
      break;
    case 'DDJJ-VALIDAR-NIVEL2':
      ddjjValidarN2(req, res);
      break;
    case 'BOLETA-DETALLE':
      getBoletaDetalle();
      break;
    case 'CALCULAR-INTERES':
      calcularInteres();
      break;
    case 'CALCULAR-INTERESES':
      calcularInteresBoletas();
      break;
    case 'BOLETA-DDJJ-CODIGO':
      getBoletaByDDJJIDandCodigo();
      break;
    case 'DETALLE-BOLETA-IMPRIMIR':
      getBoletaDetalleImpresa();
      break;
    case 'BOLETA-IMPRIMIR':
      getBoletaImpresa();
      break;
    case 'TIENE-RECTIFICATIVA':
      tieneRectificativa();
      break;
    case 'GUARDAR-BOLETAS':
      guardarBoletas();
      break;
    case 'GENERAR-SIN-DDJJ':
      generarBoletaSinDDJJ();
      break;
    case 'FERIADOS-DUPLICAR':
      feriadosDuplicar();
      break;
      break;
    case 'GET-BOLETA-BY-ID':
      getBoletaById();
      break;
    case 'MODIFICAR-BOLETA-BY-ID':
      modificarBoletaById();
      break;
    case 'GET-BOLETA-SIN-DDJJ':
      getBoletaSinDDJJ();
      break;
    case 'UPDATE-AJUSTE':
      updateAjuste();
      break;
    case 'DELETE-AJUSTE':
      deleteAjuste();
      break;
    case 'OSPIM-CONTACTO':
      getOspimContacto();
      break;
    case 'DDJJ-PRESENTAR':
      presentarDDJJ(req, res);
      break;
    case 'ACTUALIZAR-ROL-FUNCIONALIDAD':
      updateRolFuncionalidad();
      break;
    case 'GET-FUNCIONALIDAD-BY-ROL':
      getFuncionalidadesByRol();
      break;
    case 'DELETE-INTERES':
      deleteInteres();
      break;
    case 'UPDATE-INTERES':
      updateInteres();
      break;
    case 'ERROR401':
      err401();
      break;
    case 'PATCH-USUARIO-ACTIVO':
      patchUsuarioInterno();
      break;
    case '----':
      // code block
      next();
      break;
    default:
    // code block
  }

  function DDJJImprimir() {
    const file = `${__dirname}/ddjj_2.pdf`;
    res.download(file); // Set disposition and send it.
  }

  function getOspimContacto() {
    let contacto = {};
    contacto.email = 'mesadeayuda@ospim.com.ar';
    contacto.telefono = '011-4502-2075';
    contacto.whasap = '15-4569-4545';
    res.status(200).send(contacto);
  }

  function ddjjValidarN2(req, res) {
    // Validar que todos los campos estén llenos excepto "inte"
    const afiliados = req.body.afiliados;
    console.log(afiliados);
    const errores = [];

    afiliados.forEach((afiliado, index) => {
      Object.entries(afiliado).forEach(([key, value]) => {
        if (key !== 'inte' && (value === null || value === undefined)) {
          errores.push({
            //codigo: `CAMPO_${key.toUpperCase()}_VACIO`,
            codigo: key,
            cuil: afiliado.cuil,
            descripcion: `El campo '${key}' está vacío.`,
            indice: index,
          });
        }
      });
    });

    res.status(200).jsonp({
      mensaje: "Todos los campos están llenos excepto 'inte'.",
      afiliados,
      errores,
    });

    /* if (errores.length > 0) {
      res.status(400).jsonp({
        codigo: "ERROR_VALIDACION_NIVEL",
        ticket: "TK-156269",
        descripcion: "Errores en la validación de la DDJJ.",
        tipo: "ERROR_APP_BUSINESS",
        errores: {
          errores: errores,
        },
      });
    } else {
      res.status(200).jsonp({
        mensaje: "Todos los campos están llenos excepto 'inte'.",
        afiliados,
      });
    } */
  }

  function DDJJImprimir() {
    const file = `${__dirname}/ddjj_2.pdf`;
    res.download(file); // Set disposition and send it.
  }

  function feriadosDuplicar() {
    res.status(200).jsonp(true);
  }

  function AporteDetalleAlta() {
    let aporte = req.query.aporte;
    req.body.aporte = aporte;
    next();
  }

  function AportesBaja() {
    let codigo = req.query.codigo;
    let aportesDB = req.app.db.__wrapped__.aportes;
    let aporte = aportesDB.find((elem) => elem.codigo == codigo);
    if (aporte) {
      let aportesDBNew = aportesDB.filter((elem) => elem.codigo != codigo);
      req.app.db.__wrapped__.aportes = aportesDBNew;
      req.app.db.write();
      res.status(200).send(null);
    } else {
      res.status(404).jsonp({
        tipo: 'ERROR_APP_BUSINESS',
        ticket: 'TK-156269',
        codigo: 'CODIGO_INVALIDO',
        descripcion: 'Codigo inexistente.',
      });
    }
  }

  function AportesModi() {
    let codigo = req.query.codigo;
    let aportesDB = req.app.db.__wrapped__.aportes;
    let aportesIndex = aportesDB.findIndex((elem) => elem.codigo == codigo);
    console.log('aportesIndex: ' + aportesIndex);
    if (aportesIndex > -1) {
      if (req.body.descripcion)
        aportesDB[aportesIndex].descripcion = req.body.descripcion;
      if (req.body.cuenta) aportesDB[aportesIndex].cuenta = req.body.cuenta;
      req.app.db.write();
      res.status(200).send(null);
    } else {
      res.status(404).jsonp({
        tipo: 'ERROR_APP_BUSINESS',
        ticket: 'TK-156269',
        codigo: 'CODIGO_INVALIDO',
        descripcion: 'Codigo inexistente.',
      });
    }
  }

  function RolFuncionalidadRelBaja() {
    let rolId = req.query.rolId;
    let funcCodigo = req.query.funcionalidad;
    console.log('rolId:' + rolId + ' - funcCodigo:' + funcCodigo);

    let reg = { rolId: rolId, funcionalidad: funcCodigo };

    let rolFuncDB = req.app.db.__wrapped__.rolFuncionalidad;
    const lstFiltrado = rolFuncDB.filter((element) => {
      return !(
        element.rolId == reg.rolId && element.funcionalidad == reg.funcionalidad
      );
    });
    console.log(lstFiltrado);
    if (!lstFiltrado || lstFiltrado.length > 0) {
      req.app.db.__wrapped__.rolFuncionalidad = lstFiltrado;
      req.app.db.write();
    } else {
      console.log('NO SE PUEDE BOORAR lo que NO EXSISTE !...');
    }
    res.status(200).send(null);
  }

  function RolFuncionalidadRelAlta() {
    let rolId = req.query.rolId;
    let funcCodigo = req.query.funcionalidad;
    console.log('rolId:' + rolId + ' - funcCodigo:' + funcCodigo);

    let reg = { rolId: rolId, funcionalidad: funcCodigo };

    let rolFuncDB = req.app.db.__wrapped__.rolFuncionalidad;
    const lstFiltrado = rolFuncDB.filter((element) => {
      return (
        element.rolId == reg.rolId && element.funcionalidad == reg.funcionalidad
      );
    });
    console.log(lstFiltrado);
    if (!lstFiltrado || lstFiltrado.length == 0) {
      rolFuncDB.push(reg);
      req.app.db.write();
    } else {
      console.log('YA EXSITE !...');
    }
    res.status(201).send(null);
  }

  function RolFuncionalidadRelCons() {
    let rolId = req.query.rolId;

    console.log('rolId: ' + rolId);
    if (rolId && rolId != ':id') {
      let rolFuncDB = req.app.db.__wrapped__.rolFuncionalidad;
      //let rolFuncDB = req.app.db.get("rolFuncionalidad");
      const lstFiltrado = rolFuncDB.filter((element) => {
        return element.rolId == rolId;
      });
      if (lstFiltrado && lstFiltrado.length && lstFiltrado.length > 0) {
        res.status(200).send(lstFiltrado);
      } else {
        res.status(204).send(null);
      }
    } else {
      res.status(404).send(null);
    }
  }

  function empresaDomicilioAlta() {
    let empresaId = req.query.empresaId;
    console.log('empresaId: ' + empresaId);
    if (empresaId) {
      req.body.empresaId = empresaId;
    }
    next();
  }

  function empresaPlataConsulta() {
    let empresaId = req.query.empresaId;
    if (empresaId) {
      var domicilioDB = req.app.db.__wrapped__.empresaDomicilio;
      const lstFiltrado = domicilioDB.filter((element) => {
        return element.empresaId == empresaId;
      });

      lstPlanta = lstFiltrado.map((reg) => {
        let newReg;
        newReg = { id: reg.id, planta: reg.planta };
        return newReg;
      });

      res.status(200).send(lstPlanta);
    } else {
      next();
    }
  }

  function validarCUI() {
    const rand = Math.random() < 0.5;
    const response = {
      resultado: rand,
    };
    res.json(response);
  }

  function categoriasURL() {
    const { camaraCodigo, descripcion } = req.body;
    console.log(
      'Middleware - SIGECO - categoriasURL() - INIT - camaraCodigo:' +
        camaraCodigo,
    );
    if (
      camaraCodigo != 'CAENA' &&
      camaraCodigo != 'FAIM' &&
      camaraCodigo != 'CEPA'
    ) {
      res.status(412).jsonp({
        tipo: 'ERROR_APP_BUSINESS',
        ticket: 'TK-156269',
        codigo: 'CODIGO_INVALIDO',
        descripcion: 'Valor de camaraCodigo (' + camaraCodigo + ') invalido.',
      });
    } else {
      next();
    }
  }

  function validarLoguin() {
    // Handle the login request here
    console.log('Middleware - SIGECO - validarLoguin() - INIT');

    const { usuario, clave } = req.body;
    if (usuario != 'admin' || (clave != 'Prueba123' && clave != 'Prueba3333')) {
      res.status(401).jsonp({
        tipo: 'ERROR_APP_BUSINESS',
        ticket: 'TK-156269',
        codigo: 'CODIGO_INVALIDO',
        descripcion: 'Credenciales invalidas.',
      });

      console.log(res.statusCode);
    } else {
      const response = {
        token: 'ncvfjlkcovkelvkeivnfjkvevcfo.cmkdwocjoiwcmw.dnmiwedfiwejndfmwe',
        tokenRefresco:
          '2ncvfjlkcovkelvkeivnfjkvevcfo.cmkdwocjoiwcmw.dnmiwedfiwejndfmwe',
      };
      res.json(response);
    }
  }

  function validarLoguinHabilitado() {
    const response = {
      valor: true,
    };
    res.json(response);
  }

  function validarLoguinDFA() {
    console.log('Middleware - SIGECO - validarLoguinDFA() - INIT');

    const { codigo } = req.body;
    if (codigo != '310279') {
      res.status(401).jsonp({
        tipo: 'ERROR_APP_BUSINESS',
        ticket: 'TK-156269',
        codigo: 'CODIGO_INVALIDO',
        descripcion: 'Codigo de verificación invalido.',
      });

      console.log(
        'Middleware - SIGECO - validarLoguinDFA() - res.statusCode: ' +
          res.statusCode,
      );
    } else {
      const response = {
        token: 'ncvfjlkcovkelvkeivnfjkvevcfo.cmkdwocjoiwcmw.dnmiwedfiwejndfmwe',
        tokenRefresco:
          '2ncvfjlkcovkelvkeivnfjkvevcfo.cmkdwocjoiwcmw.dnmiwedfiwejndfmwe',
      };
      res.json(response);
      /* En la sección donde manejas la ruta "/auth/login-dfa" con el método POST, estás llamando a res.json(response) y luego a next(). En este caso, res.json() envía la respuesta al cliente, pero luego también estás pasando la solicitud al siguiente middleware con next(). Esto puede resultar en un conflicto, ya que la respuesta ya se ha enviado al cliente. */
      //next();
    }
  }

  function validarPeriodo() {
    var ddjj = req.app.db.__wrapped__.DDJJ;

    var empresaId = req.query.empresaId;
    var periodo = new Date(
      req.query.periodo.substring(0, 4),
      req.query.periodo.substring(4, 6) - 1,
      '01',
    );

    const reg = ddjj.find((element) => {
      const fecha = new Date(
        element.periodo.substring(0, 4),
        element.periodo.substring(5, 7) - 1,
        '01',
      );

      return (
        element.empresaId == empresaId && fecha.getTime() === periodo.getTime()
      );
    });

    if (reg) {
      res.status(200).send({ resultado: true });
    } else {
      res.status(200).send({ resultado: false });
    }
  }

  function DDJJSetParamsV2() {
    let empresaId = req.query.empresaId;
    if (empresaId != ':empresaId') {
      req.body.empresaId = empresaId;
      req.body.estado = 'PE';
      req.body.secuencia = null;

      let vecAfiliados = req.body.afiliados;
      let vecAfiliadosNew = vecAfiliados.map(
        function callback(element, index, array) {
          // Return value for new_array
          element.aportes = DDJJSetParamsAporteV2(
            element.remunerativo,
            element.uomaSocio,
            element.amtimaSocio,
          );

          return element;
        },
      );
      req.body.afiliados = vecAfiliadosNew;

      next();
    } else {
      res.status(401).jsonp({
        tipo: 'ERROR_APP_BUSINESS',
        ticket: 'TK-156270',
        codigo: 'CODIGO_INVALIDO',
        descripcion: 'Debe indicar la empresa de la DDJJ .',
      });
    }
  }

  function DDJJSetParamsAporteV2(remuneracion, buomaSocio, bamtimaSocio) {
    let aportes = [];
    let imp = remuneracion * 0.02;
    let impArt46 = 2570 * 0.02;
    aportes[0] = { aporte: 'ART46', importe: impArt46 };
    if (buomaSocio) {
      aportes[1] = { aporte: 'UOMACS', importe: imp };
      aportes[2] = { aporte: 'UOMAAS', importe: imp };
      if (bamtimaSocio) {
        aportes[3] = { aporte: 'AMTIMACS', importe: 7500 };
      }
    }
    return aportes;
  }

  function DDJJSetParams() {
    console.log('DDJJAlta - Hola');
    let empresaId = req.query.empresaId;
    if (empresaId != ':empresaId') {
      console.log('empresaId: ' + empresaId);
      req.body.empresaId = empresaId;
      req.body.estado = 'PE';
      req.body.secuencia = null;
      req.body.totalART46 = genRand(100000, 1000000, 2);
      req.body.totalAmtimaCS = genRand(100000, 1000000, 2);
      req.body.totalUomaCS = genRand(100000, 1000000, 2);
      req.body.totalUomaAS = genRand(100000, 1000000, 2);
      req.body.totalCuotaUsu = genRand(100000, 1000000, 2);

      next();
    } else {
      res.status(401).jsonp({
        tipo: 'ERROR_APP_BUSINESS',
        ticket: 'TK-156270',
        codigo: 'CODIGO_INVALIDO',
        descripcion: 'Debe indicar la empresa de la DDJJ .',
      });

      console.log(res.statusCode);
    }
  }

  function genRand(min, max, decimalPlaces) {
    var rand = Math.random() * (max - min) + min;
    var power = Math.pow(10, decimalPlaces);
    return Math.floor(rand * power) / power;
  }

  function getBoletaDetalle() {
    const declaracion_jurada_id = req.query.ddjj_id;
    const boletasDetalle = req.app.db.__wrapped__.boletas;
    const tieneBoletasParaDeclaracion =
      boletasDetalle.declaracion_jurada_id == declaracion_jurada_id;
    const error404 = {
      descripcion: 'No se encontraron boletas para la declaracion jurada',
    };

    tieneBoletasParaDeclaracion
      ? res.status(200).jsonp(boletasDetalle)
      : res.status(404).jsonp(error404);
  }

  function calcula_diferencia_de_dias(dia_mayor, dia_menor) {
    return (new Date(dia_mayor) - new Date(dia_menor)) / (1000 * 60 * 60 * 24);
  }

  function guardarBoletas() {
    const numero_boleta = req.app.db.__wrapped__.boletas_guardadas.length;
    console.log(req.body);
    req.body.forEach((element, index) => {
      element.numero_boleta = numero_boleta + index;
      element.id = 10000 + index;
      req.app.db.__wrapped__.boletas_guardadas.con_ddjj.push(element);
      req.app.db.write();
    });
    res.status(201).send(null);
  }

  function calcularInteres() {
    console.log('entre en calcular interes');
    const { codigoBoleta } = req.query;
    const { intencionDePago } = req.body;
    const interes_diario = 0.01;
    console.log(req.body);
    console.log(codigoBoleta);
    const boletaOrig = req.app.db.__wrapped__.boletas.detalle_boletas.find(
      (boleta) => boleta.codigo === codigoBoleta,
    );
    const boleta = JSON.parse(JSON.stringify(boletaOrig));
    const diferencia_en_dias = calcula_diferencia_de_dias(
      intencionDePago,
      boleta.vencimiento,
    );

    if (diferencia_en_dias >= 0) {
      const monto_interes =
        boleta.total_acumulado * interes_diario * diferencia_en_dias;
      boleta.total_final = boleta.total_acumulado + monto_interes;
      boleta.interes = parseFloat(monto_interes.toFixed(2));
    }

    boleta.intencionDePago = intencionDePago;
    const nueva_estructura = {
      declaracion_jurada_id: 120,
      tipo_ddjj: 'Original',
      periodo: '2024-01-01T03:00:00.000Z',
    };
    nueva_estructura.detalle_boletas = [boleta];
    res.status(200).jsonp(nueva_estructura);
  }

  function calcularInteresBoletas() {
    //Calcula el interes de todas las boletas de una sola vez
    const { intencionDePago } = req.body;
    const interes_diario = 0.01;
    const boletasOrig = req.app.db.__wrapped__.boletas;
    const boletas = JSON.parse(JSON.stringify(boletasOrig));
    const nueva_estructura = {
      declaracion_jurada_id: 120,
      tipo_ddjj: 'Original',
      periodo: '2024-01-01T03:00:00.000Z',
      detalle_boletas: [],
    };
    boletas.detalle_boletas.map((boleta) => {
      const diferencia_en_dias = calcula_diferencia_de_dias(
        intencionDePago,
        boleta.vencimiento,
      );
      if (diferencia_en_dias >= 0) {
        const monto_interes =
          boleta.total_acumulado * interes_diario * diferencia_en_dias;
        boleta.total_final = boleta.total_acumulado + monto_interes;
        boleta.intencionDePago = intencionDePago;
        boleta.interes = parseFloat(monto_interes.toFixed(2));
      }
      nueva_estructura.detalle_boletas.push(boleta);
      //nueva_estructura.intencionDePago = intencionDePago
      //return { ...nueva_estructura};
    });

    res.status(200).jsonp(nueva_estructura);
  }

  function getBoletaByDDJJIDandCodigo() {
    const { ddjj_id, codigo } = req.query;
    const BOLETAS_BY_DDDJJ =
      req.app.db.__wrapped__.boletas_guardadas.con_ddjj.find(
        (boletasddjj) => boletasddjj.declaracion_jurada_id == ddjj_id,
      );
    const BOLETA_BY_CODIGO = BOLETAS_BY_DDDJJ.detalle_boletas.find(
      (boleta) => boleta.codigo == codigo,
    );
    res.status(200).jsonp(BOLETA_BY_CODIGO);
  }

  function getBoletaDetalleImpresa() {
    const file = `${__dirname}/detalle_boleta.pdf`;
    res.download(file);
  }

  function getBoletaImpresa() {
    const file = `${__dirname}/boletas.pdf`;
    res.download(file);
  }

  function tieneRectificativa() {
    const { empresaId, periodo } = req.query;
    const rectificativa = empresaId == 1 && periodo == '2024-01';
    res.status(200).jsonp({ rectificativa });
  }

  function generarBoletaSinDDJJ() {
    const file = `${__dirname}/boleta_blanca.pdf`;
    const nueva_boleta = req.body;
    const id = req.app.db.__wrapped__.boletas_guardadas.sin_ddjj.length + 1;
    req.app.db.__wrapped__.boletas_guardadas.sin_ddjj.push({
      ...nueva_boleta,
      id,
    });
    req.app.db.write();
    res.download(file);
  }

  function getBoletaSinDDJJ() {
    const file = `${__dirname}/boleta_blanca.pdf`;
    res.download(file);
  }

  function getBoletaById() {
    const { id } = req.query;
    const boleta = req.app.db.__wrapped__.boletas_guardadas.con_ddjj.find(
      (boleta) => boleta.id == id,
    );
    res.status(200).jsonp(boleta);
  }

  function modificarBoletaById() {
    const { id } = req.query;
    const index = req.app.db.__wrapped__.boletas_guardadas.con_ddjj.findIndex(
      (element) => element.id == id,
    );
    req.app.db.__wrapped__.boletas_guardadas.con_ddjj.forEach((element) =>
      console.log(element.numero_boleta),
    );
    try {
      req.app.db.__wrapped__.boletas_guardadas.con_ddjj[index] = req.body;
      req.app.db.write();
      res.status(200).send(null);
    } catch (error) {
      res.status(404);
    }
  }

  function updateAjuste() {
    const { id } = req.query;
    console.log('id pedido ' + id);
    const index = req.app.db.__wrapped__.ajustes.findIndex(
      (element) => element.id == id,
    );
    console.log('index del elemento ' + index);
    req.app.db.__wrapped__.ajustes[index] = req.body;
    req.app.db.write();
    res.status(201).send(null);
  }

  function deleteAjuste() {
    const { id } = req.query;
    console.log(id);
    const ajustesActualizados = req.app.db.__wrapped__.ajustes.filter(
      (item) => item.id != id,
    );
    console.log(ajustesActualizados);
    req.app.db.__wrapped__.ajustes = ajustesActualizados;
    req.app.db.write();
    res.status(204).send(null);
  }

  function presentarDDJJ(req, res) {
    // quiero que esta funcion me reporte { estado = "PR", secuencia = 1 }
    res.status(200).jsonp({ estado: 'PR', secuencia: 1 });
  }

  function updateRolFuncionalidad() {
    console.log('Estoy en el update');
    const { id } = req.query;
    const index = req.app.db.__wrapped__.rolFuncionalidades.findIndex(
      (element) => element.id == id,
    );
    req.body.id = parseInt(id);
    req.app.db.__wrapped__.rolFuncionalidades[index] = req.body;
    req.app.db.write();
    res.status(201).send(null);
  }

  function getFuncionalidadesByRol() {
    console.log('llegue');
    const { rol } = req.query;
    console.log(rol);
    const rolfuncionalidad = req.app.db.__wrapped__.rolFuncionalidades.find(
      (element) => element.descripcion === rol,
    );

    res.status(200).jsonp(rolfuncionalidad);
  }

  function deleteInteres() {
    const { id } = req.query;
    console.log(req.query);
    console.log(req.body);
    console.log(id);
    const interes = req.app.db.__wrapped__.intereses.filter(
      (item) => item.id != id,
    );
    console.log(interes);
    req.app.db.__wrapped__.intereses = interes;
    req.app.db.write();
    res.status(204).send(null);
  }

  function updateInteres() {
    const { id } = req.query;
    const index = req.app.db.__wrapped__.intereses.findIndex(
      (element) => element.id == parseInt(id),
    );
    req.body.id = parseInt(id);
    req.app.db.__wrapped__.intereses[index] = req.body;
    req.app.db.write();
    res.status(201).send(null);
  }

  function err401() {
    res.status(412).jsonp({
      status: 412,
      error: 'Not Found',
      tipo: 'ERROR_APP_BUSINESS',
      ticket: 'SGC-07168420',
      codigo: 'DDJJ_CON_BOLETAS',
      descripcion:
        'La Declaracion Jurada ya cuenta con las Boletas de Pago generadas',
      args: {},
    });
  }

  function patchUsuarioInterno() {
    const { habilitado } = req.body;
    const { id } = req.query;
    console.log(habilitado);
    console.log(id);
    const index = req.app.db.__wrapped__['usuario-interno'].findIndex(
      (element) => element.id == parseInt(id),
    );
    req.app.db.__wrapped__['usuario-interno'][index].habilitado = habilitado;
    req.app.db.write();
    res.status(204).send(null);
  }
};
