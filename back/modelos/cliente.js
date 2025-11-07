const mongoose = require("mongose");

const clientSchema = new mongoose.Schema ({
    name: {type: String, required: true},
    email: {type: String},
    cellphone: {type: String, required: true},
    address: {Type: String, required: true},
    state: {type: String, required: true},
});

module.exports = mongoose.model("cliente", clienteSchema);