// Função para definir a saudação conforme o fuso horário
export function getSaudacaoPorHorario(timeZone = "America/Sao_Paulo") {
    const agora = new Date();
  
    const formatterHora = new Intl.DateTimeFormat("pt-BR", {
      hour: "numeric",
      hour12: false,
      timeZone,
    });
  
    const parts = formatterHora.formatToParts(agora);
    const hourPart = parts.find((p) => p.type === "hour");
    const hora = hourPart ? parseInt(hourPart.value, 10) : agora.getHours();
  
    if (hora >= 5 && hora < 12) return "Bom dia!";
    if (hora >= 12 && hora < 18) return "Boa tarde!";
    return "Boa noite!";
  }
  
  // Função de formatação de data e hora
  export function formatarDataHora(timeZone = "America/Sao_Paulo") {
    const agora = new Date();
  
    const formatter = new Intl.DateTimeFormat("pt-BR", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
      timeZone,
    });
  
    return formatter.format(agora);
  }
  