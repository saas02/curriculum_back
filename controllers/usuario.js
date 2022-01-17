const { response, request } = require('express');
const brcyptjs = require('bcryptjs');
const Usuario = require("./../models/usuario");

const pdf = require("pdf-creator-node");
const fs = require("fs");

// Read HTML Template
const html = fs.readFileSync("public/template.handlebars", "utf8");

const options = {
    format: "Letter",
    orientation: "portrait",
    border: "10mm"
};

const usuariosGet = async (req = request, res = response)  => {
    
    const { limite = 5, desde = 0 } = req.query;
    const query = { state: true };
    
    const [ total, usuarios ] = await Promise.all([
        /** Se coloca el await para esperar la salida de las dos query */
        Usuario.countDocuments(query),
        Usuario.find(query)
            .skip( Number( desde ) )
            .limit( Number( limite ) )
    ]);    

    res.json({
        msg:" get API Controller",
        total,
        usuarios        
    })
}

const usuariosPost = async (req, res = response)  => {
    
    const { password, ...data } = req.body;
    const usuario = new Usuario( data );    
    
    /** Encriptar Contraseña */
    const salt = brcyptjs.genSaltSync(10);
    usuario.password = brcyptjs.hashSync( password, salt );

    await usuario.save();

    res.json({
        usuario
    })
}

const usuariosPut = async (req, res = response)  => {
    console.log("aca");
    const { id } = req.params;
    const { _id, ...data } = req.body;

    if(data.password){
        
        let usuario = await Usuario.findById( id );
        const validatePassword = brcyptjs.compareSync( data.password,  usuario.password );
        
        if( !validatePassword ){
            const salt = brcyptjs.genSaltSync(10);
            data.password = brcyptjs.hashSync( data.password, salt );
        }
        
    }

    const usuario = await Usuario.findByIdAndUpdate( id, data )

    res.json({
        msg: " put API Controller....",
        data
    })
}

const usuariosDelete = async (req, res = response)  => {

    const { id } = req.params;

    const uid = req.uid;

    /** para eliminar */
    //const usuario = await Usuario.findByIdAndDelete( id );

    /** para actualizar el estado */
    const usuario = await Usuario.findByIdAndUpdate( id, { state: false } );


    res.json({
        msg:" delete API Controller",
        id
    })
}

const usuariosDoc = async (req, res = response)  => {

    let { id } = req.params;    

    let usuario = await Usuario.findById( id ).lean() 

    let folder = 'public/cv/';

    if (!fs.existsSync(folder)) {
        fs.mkdirSync(folder);
    }

    
    
    let fileName = "/"+id+'.pdf';    
    
    let document = {
        html: html,
        data: {
            usuarios: usuario
        },
        path: folder+fileName,
        type: "",
    };    

    let result = pdf.create(document, options)
      .then((res) => {
        console.log(res);          
        return res;
      })
      .catch((error) => {  
        console.log(error);      
        return error;
      });

    res.json({
        msg: " put API Controller****",
        url: '/cv'+fileName        
    })


}



module.exports = {
    usuariosGet,
    usuariosPost,
    usuariosPut,
    usuariosDelete,
    usuariosDoc
}