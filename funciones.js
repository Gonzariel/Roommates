import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import fs from 'fs';
import { fileURLToPath } from 'url'
import { dirname } from "path";

const __filename = fileURLToPath( import.meta.url)
const __dirname = dirname( __filename)


let roommates = [];
let gastos = [];

export const agregarNuevo = async () => {

    try {
        const data = await axios.get("https://randomuser.me/api");
        const { name:{ first, last }, email  } = data.data.results[0];

        //El recibe lo deje en 0 solamente,no habia algo en el material como para modificarlo posteriormente y el debe lo calculo mas adelante.
        const roommate = {
            id: uuidv4().slice(0,6),
            nombre: `${first} ${last}`,
            email,
            debe:0,
            recibe:0
        };


        roommates.push(roommate)
        

        fs.writeFileSync(__dirname +'/json/roommates.json', JSON.stringify({ roommates:roommates,length:roommates.length }), "utf8");

        reparticionDeuda()    

        return JSON.parse(fs.readFileSync(__dirname +'/json/roommates.json', "utf8"));
    } catch (error) {
        console.error(error);
    }
    
    
};


export const obtenerRoomates = async() => {
    try {
        return JSON.parse(fs.readFileSync(__dirname +'/json/roommates.json',"utf8"));
    } catch (error) {
        console.error(error);
    }
    
    
};

export const obtenerGastos = async() => {
    try {
        return JSON.parse(fs.readFileSync(__dirname +'/json/gastos.json',"utf8"));
    } catch (error) {
        console.error(error);
    }
    
};


export const agregarGasto = async(data) => {
    try {
        const {roommate,descripcion,monto} = data;

        const gasto = {
            id: uuidv4().slice(0,6),
            roommate: roommate,
            descripcion : descripcion,
            monto : monto
        };


        gastos.push(gasto)
        
        fs.writeFileSync(__dirname +'/json/gastos.json', JSON.stringify({ gastos }), "utf8");
        
        reparticionDeuda()    

        return JSON.parse(fs.readFileSync(__dirname +'/json/gastos.json', "utf8"));
    } catch (error) {
        console.error(error);
    }


};

export const editarGasto = async(id,body) => {
    try {
        const {roommate,descripcion,monto} = body;

        const gasto = {
            id,
            roommate,
            descripcion,
            monto
        };

        
        const newJSON = JSON.parse(fs.readFileSync(__dirname +'/json/gastos.json',"utf8"))
        const gastosJSON = newJSON.gastos
        const gastosJSONMap = gastosJSON.map(element => element.id === id ? gasto : element);

        fs.writeFileSync(__dirname +'/json/gastos.json', JSON.stringify({gastos:gastosJSONMap}));

        reparticionDeuda()    

        return JSON.parse(fs.readFileSync(__dirname +'/json/gastos.json', "utf8"));

    } catch (error) {
        console.error(error);
    }
};

export const eliminarGasto = async(id) => {

    try {
        const newJSON = JSON.parse(fs.readFileSync(__dirname +'/json/gastos.json',"utf8"))
        const gastosJSON = newJSON.gastos

        const gastosJSONFilter = gastosJSON.filter(element => element.id !== id);

        fs.writeFileSync(__dirname +'/json/gastos.json', JSON.stringify({gastos:gastosJSONFilter}));

        reparticionDeuda()

        return JSON.parse(fs.readFileSync(__dirname +'/json/gastos.json', "utf8"));

    } catch (error) {
        console.error(error.stack);
    }

    
};



const reparticionDeuda = async() => {
    let total = 0;

    try {

        const gastoJson = JSON.parse(fs.readFileSync(__dirname +'/json/gastos.json',"utf8"))
        const montoJSON = gastoJson.gastos

        montoJSON.forEach((element) => {
            total += element.monto;
        });

    
        const newJSON = JSON.parse(fs.readFileSync(__dirname +'/json/roommates.json',"utf8"))
        const debeJSON = newJSON.roommates  


        debeJSON.forEach((element) => element.debe = Math.round(total/debeJSON.length));

        return fs.writeFileSync(__dirname +'/json/roommates.json', JSON.stringify({roommates:debeJSON,length:roommates.length }));
        
    } catch (error) {
        console.error(error);
    }

};