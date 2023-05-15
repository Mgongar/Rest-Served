
import  dotenv from 'dotenv'; // see https://github.com/motdotla/dotenv#how-do-i-use-dotenv-with-import
dotenv.config();

import colors from 'colors';
import { inquirerMenu, 
    pausa, 
    leerInput,
    listarLugares,
    confirmar,
    mostrarListadoChecklist
  } from './helpers/inquirer.js';
  import {Busquedas} from './models/busqueda.js';




const main = async () => {
    let opt = '';
    const busquedas= new Busquedas();
    

  
    do {
      opt = await inquirerMenu();//muestra el menu que se encuenta en el archivo inquirer
      switch (opt) {
        case 1:
          //Mostrar mensaje
           const termino= await leerInput('Ciudad: ');

           //Buscar los lugares
           const lugares= await busquedas.ciudad(termino);

           //Seleccionar el lugar
           const id= await listarLugares(lugares);
          if (id==='0') continue;

           const lugarSel= lugares.find(l => l.id===id);

           //Guardar en DB
           busquedas.agregarHistorial(lugarSel.nombre)
           
           //clima
           const clima = await busquedas.climaLugar(lugarSel.lat,lugarSel.lng);

           console.clear();
            console.log('\nInformación de la ciudad\n');
            console.log('Ciudad: ',lugarSel.nombre);
            console.log('Latitud: ',lugarSel.lat);
            console.log('Longitud: ',lugarSel.lng);
            console.log('Temperatura: ',clima.temp);
            console.log('Mínima: ',clima.min);
            console.log('Máxima: ',clima.max);
            console.log('Cómo está el clima: ',clima.desc);

        break;

        case 2:
          busquedas.historialCapitalizado.forEach((lugar, i)=> {
            const idx = `${i+1}.`.green;
            console.log(`${idx} ${lugar}`)
          });
            break;

        case 0:
            
            break;
      

      }
        if(opt !==0) await pausa();

    } while (opt !== 0);
}

main();