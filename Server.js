import express from 'express';
import fs from 'fs';
import {agregarNuevo,obtenerRoomates,agregarGasto,obtenerGastos,editarGasto,eliminarGasto} from './funciones.js'
const app = express()
console.clear();

//Variables de entorno
import { fileURLToPath } from 'url'
import { dirname } from "path";

const __filename = fileURLToPath( import.meta.url)
const __dirname = dirname( __filename)

app.use(express.json());

//Declaramos los arreglos para resetear los json al iniciar el servidor
let roommates = [];
let gastos = [];

fs.writeFileSync(__dirname +'/json/roommates.json', JSON.stringify({roommates}));
fs.writeFileSync(__dirname +'/json/gastos.json', JSON.stringify({gastos}));



app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});


  
app.get("/roommates", async(req, res) => {
    try{
        const response = await obtenerRoomates();
        res
        .status(200)
        .send({status:'OK', response })

     }catch(error){
        res
        .status(error?.status || 500)
        .send({ status: "FAILED", data: { error: error?.message || error } });
     }
});

app.post("/roommate", async(req, res) => {
    try {
        const response = await agregarNuevo();

      res
        .status(201)
        .send({status:'OK',response })
    } catch (error) {
        res
        .status(error?.status || 500)
        .send({ status: "FAILED", data: { error: error?.message || error } });
    }
    
});


app.get('/gastos', async( req, res ) => {
    try{
        const response = await obtenerGastos();
        res
        .status(200)
        .send({status:'OK', response })

     }catch(error){
        res
        .status(error?.status || 500)
        .send({ status: "FAILED", data: { error: error?.message || error } });
     }
})

app.post("/gasto", async( req, res ) => {
    try {
        const response = await agregarGasto(req.body);

      res
        .status(201)
        .send({status:'OK',response })
    } catch (error) {
        res
        .status(error?.status || 500)
        .send({ status: "FAILED", data: { error: error?.message || error } });
    }
    
});

app.put("/gasto", async( req, res ) => {
    try {
        
        const response = await editarGasto(req.query.id,req.body);
        res
        .status(201)
        .send({status:'OK',response })
    } catch (error) {
        res
        .status(error?.status || 500)
        .send({ status: "FAILED", data: { error: error?.message || error } });
    }
})


app.delete("/gasto", async( req, res ) => {
    try {
        const response = await eliminarGasto(req.query.id);
        res
        .status(200)
        .send({status:'OK',response })
    } catch (error) {
        res
        .status(error?.status || 500)
        .send({ status: "FAILED", data: { error: error?.message || error } });
    }
})

app.listen(3000,() => {
    console.log("Servidor corriendo en el puerto 3000");
});