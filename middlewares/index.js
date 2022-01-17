const { validarCampos } = require("../middlewares/validar-campos");
const { validarJwt } = require("../middlewares/validar-jwt");


module.exports = {
    validarCampos,
    validarJwt
}