const { Schema, model } = require("mongoose");


const UsuarioSchema = Schema({
    name: {
        type: String,
        required: [true, 'El nombre es obligatorio..']
    },
    age:{
        type: Number
    },    
    address:{
        type: String
    },    
    password:{
        type: String,
        required: [true, 'La contraseña es obligatoria'],
    },
    email: {
        type: String,
        required: [true, 'El correo es obligatorio'],
        unique: true
    },
    phone:{
        type: String
    },
    about:{
        type: Object
    },
    url:{
        type: String
    },  
    language:{
        type: String
    },    
    imageProfile: {
        type: String
    },    
    items:{
        profile:{
            type: Object
        },
        skills:{
            type: Object
        },
        experiences:{
            type: Object
        },
        educations:{
            type: Object
        },
        socialNetworks:{
            type: Object
        }
    },
    status: {
        type:Boolean,
        default: true
    }
});

UsuarioSchema.methods.toJSON = function(){
    /** Sirve para eliminar los campos del objeto */
    const { __v, _id, ...usuario } = this.toObject();
    usuario.uid = _id;
    return usuario;
}


module.exports = model( 'Usuario', UsuarioSchema)