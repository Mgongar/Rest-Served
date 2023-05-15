import axios from 'axios';
import fs from 'fs';


class Busquedas{
    historial= [];
    dbPath='./db/database.json';
    constructor(){

    }
    get historialCapitalizado(){
        return this.historial.map (lugar=>{
            //El método map() crea un nuevo array con los resultados de la llamada a la función indicada aplicados a cada uno de sus elementos
            let palabras = lugar.split(' ');
            palabras = palabras.map( p => p[0]. toUpperCase () + p.substring(1) );
            return palabras.join(' ');
        });
    }

    get paramsMapbox(){
        return{
            'limit':5,
            'language':'es',
            'access_token':'pk.eyJ1IjoiZGV0b2xvdXMiLCJhIjoiY2xoZWozZGFrMTBycTNybjR1Y2N5c2R0byJ9.4pnTXd8ahjWJDXYy8xkWuA'
        }
    }
    async ciudad(lugar=''){
        try {
            //petición http
            const intance= axios.create({
                baseURL:`https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params:this.paramsMapbox
            });
            const resp = await intance.get();

            //Con esto regreso de forma implícita un objeto
           return  resp.data.features.map(lugar =>({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
           }));

            
            
        } catch (error) {
            return[];
        }
        
    }
    get paramsClima(){
        return{
            lang:'es',
            appid:process.env.OPENWEATHER_KEY,
            units:'metric'
            //https://api.openweathermap.org/data/2.5/weather?lat=9.932543&lon=-84.079578&appid=ca4f79ed3180b6f0e2bab8b74da257dd&units=metric&lang=es
        }
    }

    async climaLugar(lat, lon){
        try {
            const intance= axios.create({
                baseURL:`https://api.openweathermap.org/data/2.5/weather`,
                params:{...this.paramsClima,lat,lon}
            });
            //instance axios.creta()

            const resp= await intance.get();
           const{weather,  main}=resp.data
           
            //resp.data
            return{
                desc:weather[0].description,
                min:main.temp_min,
                max:main.temp_max,
                temp:main.temp
           };
           
    
        } catch (error) {
            console.log(error);
        }
    
    }
    agregarHistorial(lugar=''){
        if(this.historial.includes(lugar.toLocaleLowerCase())){
            return;
        }
        this.historial= this.historial.splice(0,5);//Con esta línea limito a 6 la cantidad de ciudades que pueden aparecer en el historal

        this.historial.unshift(lugar.toLocaleLowerCase());

        //Grabar en DB
        this.guardarDB();
    }
    guardarDB(){
        const payload= {
            historial: this.historial
        };
        fs.writeFileSync(this.dbPath, JSON.stringify(payload));
    }

    leerDB(){
        //debe de existir
        if (!fs.existsSync(this.dbPath)) {//compruebo si la ruta existe
            return null;
        }
    
        const info = fs.readFileSync(this.dbPath,{encoding: 'utf-8'});//el encodind se pone porque sino iba a mandar bites



        const data= JSON.parse(info);//pasamos de que el objeto sea un String a que sea un objeto JSON parseado
        this.historial=JSON.parse(info);
       // console.log(data);
        
    }
}



export{
    Busquedas
}