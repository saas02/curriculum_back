const express = require("express");

const cors = require('cors');
const { dbConnection } = require("../database/config");

class Server {    

    constructor(){
        this.app = express();        

        this.port = process.env.PORT;
        this.route = process.env.ROUTE;
        this.routeUsuarios = process.env.ROUTEUSUARIOS;
        this.routeAuth = process.env.ROUTEAUTH;
        
        /* Conectar a BD Mongo */
        this.conectarDB();

        /** Middlewares */
        this.middlewares();

        /** Routes */        
        this.routes();
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        
        //CORS
        this.app.use( cors() )

        /** PARSEO LECTURA DEL BODY */
        this.app.use( express.json() )

        //Public Directory
        this.app.use( express.static('public') );
    }

    routes(){

        this.app.use(this.route+this.routeAuth, require('../routes/auth') )

        this.app.use(this.route+this.routeUsuarios, require('../routes/usuario') )
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log("Servidor en puerto", this.port);
        })
    }

}


module.exports = Server;