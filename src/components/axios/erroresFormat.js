export const erroresFormat = (desc) => {
  // Extraer el contenido entre los corchetes
  try {
    const errores = desc.match(/\[(.*?)\]/)[1].replace(/^\{|\}$/g, '');

    // Separar los diferentes errores por coma
    const erroresArray = errores.split(', ');

    // Formatear el texto con los errores enumerados, cada uno en una nueva línea
    let resultado = '<p>Errores :</p>';
    erroresArray.forEach((error, index) => {
      resultado += `<p>${index + 1}. ${error},<p>`;
    });

    // Eliminar la última coma y agregar un salto de línea
    resultado = resultado.trim().slice(0, -1);

    return resultado;
  } catch (error) {
    return desc;
  }
};
