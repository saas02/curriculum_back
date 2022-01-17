const jwt = require('jsonwebtoken');
const { request, response } = require('express');

const validarJwt = ( request, response, next ) => {
    
    const token = request.header('x-token');

    console.log(token);

    if( !token ){
        return response.status(401).json({
            msg: 'No hay token'
        });
    }

    try {
        
        const { uid } = jwt.verify(token, process.env.SECRETKEY)
        request.uid = uid;

        next();

    } catch (error) {
        response.status(500).json(
            error
        )
    }

    
}



module.exports = {
    validarJwt
}