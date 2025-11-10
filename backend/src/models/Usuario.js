// backend/src/models/Usuario.js
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

// Utils (mantidos)
function removeDiacritics(str = "") {
  return str.normalize("NFD").replace(/\p{Diacritic}/gu, "").replace(/ç/gi, "c");
}
function onlyLettersAndDigits(str = "") {
  return /^[A-Za-z0-9\s]+$/.test(str);
}
function toTitleCaseNoDiacritics(str = "") {
  const s = removeDiacritics(str).toLowerCase().replace(/[^a-z0-9\s]/g, "");
  return s.replace(/\S+/g, (w) => (w[0] ? w[0].toUpperCase() + w.slice(1) : w));
}
function sanitizeUsuario(str = "") {
  const s = removeDiacritics(str).toLowerCase();
  return s.replace(/[^a-z]/g, "").slice(0, 12);
}
function sanitizeEstado(str = "") {
  const s = removeDiacritics(str).toUpperCase().replace(/[^A-Z]/g, "");
  return s.slice(0, 2);
}
function extractDigits(str = "") {
  return (str.match(/\d/g) || []).join("");
}

const UsuarioSchema = new mongoose.Schema(
  {
    usuario: {
      type: String,
      required: true,
      unique: true,
      maxlength: 12,
      validate: {
        validator: (v) => /^[a-z]{1,12}$/.test(v),
        message: "usuario deve conter apenas letras minúsculas (1 a 12).",
      },
    },
    senhaHash: {
      type: String,
      required: false,
    },

    // --- Campos adicionais opcionais (mantidos) ---
    endereco: {
      type: String,
      required: false,
      maxlength: 35,
      validate: {
        validator: (v) => (v == null || v === "" ? true : onlyLettersAndDigits(v)),
        message: "endereco deve conter apenas letras e números (sem símbolos).",
      },
    },
    cidade: {
      type: String,
      required: false,
      maxlength: 20,
      validate: {
        validator: (v) => (v == null || v === "" ? true : onlyLettersAndDigits(v)),
        message: "cidade deve conter apenas letras e números (sem símbolos).",
      },
    },
    bairro: {
      type: String,
      required: false,
      maxlength: 20,
      validate: {
        validator: (v) => (v == null || v === "" ? true : onlyLettersAndDigits(v)),
        message: "bairro deve conter apenas letras e números (sem símbolos).",
      },
    },
    estado: {
      type: String,
      required: false,
      minlength: 2,
      maxlength: 2,
      validate: {
        validator: (v) => (v == null || v === "" ? true : /^[A-Z]{2}$/.test(v)),
        message: "estado deve conter exatamente 2 letras maiúsculas.",
      },
    },
    cep: {
      type: String,
      required: false,
      validate: {
        validator: (v) => (v == null || v === "" ? true : /^\d{2}\.\d{3}-\d{3}$/.test(v)),
        message: "cep deve estar no formato 99.999-999.",
      },
    },
  },
  {
    timestamps: true,
    // 👇 força a coleção singular
    collection: "usuario",
  }
);

// Normalizações
UsuarioSchema.pre("validate", function (next) {
  this.usuario = sanitizeUsuario(this.usuario);
  if (this.endereco) this.endereco = toTitleCaseNoDiacritics(this.endereco).slice(0, 35);
  if (this.cidade) this.cidade = toTitleCaseNoDiacritics(this.cidade).slice(0, 20);
  if (this.bairro) this.bairro = toTitleCaseNoDiacritics(this.bairro).slice(0, 20);
  if (this.estado) this.estado = sanitizeEstado(this.estado);
  if (this.cep) {
    const digits = extractDigits(this.cep).slice(0, 8);
    this.cep = /^\d{8}$/.test(digits)
      ? `${digits.slice(0, 2)}.${digits.slice(2, 5)}-${digits.slice(5)}`
      : this.cep;
  }
  next();
});

// Métodos
UsuarioSchema.methods.setSenha = async function (senhaPlano) {
  if (typeof senhaPlano !== "string" || senhaPlano.length === 0 || senhaPlano.length > 16) {
    throw new Error("senha inválida (1 a 16 caracteres).");
  }
  const salt = await bcrypt.genSalt(10);
  this.senhaHash = await bcrypt.hash(senhaPlano, salt);
};

UsuarioSchema.methods.compareSenha = function (senhaPlano) {
  return bcrypt.compare(senhaPlano, this.senhaHash);
};

const Usuario = mongoose.model("Usuario", UsuarioSchema);
export default Usuario;
