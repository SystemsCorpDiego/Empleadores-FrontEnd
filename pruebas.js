const ver = (aux) => {
  const patron = /[A-Za-z]/;

  for (let i = 0; i <= aux.length - 1; i++) {
    let letra = aux[i];
    if (!patron.test(letra)) {
      console.log(aux);
      console.log('patron.test(aux): FALSE - letra:', letra);
      return;
    }
  }
  console.log(aux);
  console.log('patron.test(aux): TRUE');
};

ver('perofkDKSKDS');

ver('perofkD34343KSKDS');
ver('-');
ver('dsdsd-dsdsds');

/*
const prueba = (aux) => {
  if (aux) {
    console.log('1 - TRUE - aux:', aux);
  } else {
    console.log('2 - FALSE - aux:', aux);
  }
};

let aux = null;
prueba(aux);

aux = 0;
prueba(aux);

prueba();

aux = false;
prueba(aux);

aux = 1;
prueba(aux);

aux = true;
prueba(aux);

aux = 'plata';
prueba(aux);

aux = '';
prueba(aux);

aux = -1;
prueba(aux);
console.log('FIN');
*/
