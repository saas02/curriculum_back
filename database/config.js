const mongoose = require('mongoose');

const dbConnection = async () => {
    try {
        await mongoose.connect( process.env.CONEXION_MONGO )
        
        console.log("Base de datos conectada");

    } catch (error) {
        console.log(error);
        throw new Error("Error en la BD");
    }
}


module.exports = {
    dbConnection
}