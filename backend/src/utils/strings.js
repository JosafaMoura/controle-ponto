// Utilitários de normalização e validação de strings

export function removeDiacritics(str = "") {
    // remove acentos e troca 'ç' por 'c'
    return str
      .normalize("NFD")
      .replace(/\p{Diacritic}/gu, "")
      .replace(/ç/gi, "c");
  }
  
  export function onlyLetters(str = "") {
    return /^[A-Za-z]+$/.test(str);
  }
  
  export function onlyLettersAndDigits(str = "") {
    return /^[A-Za-z0-9\s]+$/.test(str); // permite espaço interno para endereço/bairro/cidade
  }
  
  export function toTitleCaseNoDiacritics(str = "") {
    const s = removeDiacritics(str)
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, ""); // remove símbolos
    return s.replace(/\S+/g, (w) => w[0] ? w[0].toUpperCase() + w.slice(1) : w);
  }
  
  export function sanitizeUsuario(str = "") {
    const s = removeDiacritics(str).toLowerCase();
    // apenas letras, sem espaços, máx 12
    return s.replace(/[^a-z]/g, "").slice(0, 12);
  }
  
  export function sanitizeEstado(str = "") {
    const s = removeDiacritics(str).toUpperCase().replace(/[^A-Z]/g, "");
    return s.slice(0, 2);
  }
  
  export function formatCEP(cepDigits = "") {
    // recebe só dígitos, devolve no formato 99.999-999
    if (!/^\d{8}$/.test(cepDigits)) return cepDigits;
    return `${cepDigits.slice(0,2)}.${cepDigits.slice(2,5)}-${cepDigits.slice(5)}`;
  }
  
  export function extractDigits(str = "") {
    return (str.match(/\d/g) || []).join("");
  }
  