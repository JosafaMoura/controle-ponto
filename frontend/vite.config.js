import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// ✅ Configuração completa e limpa do Vite
export default defineConfig({
  plugins: [react()],
  base: "/", // Caminho base da aplicação
  server: {
    port: 3000,       // Porta fixa
    open: true,       // Abre o navegador automaticamente
    cors: true,       // Permite requisições do backend (localhost:8080)
    strictPort: true, // Erro se a porta já estiver em uso
  },
  preview: {
    port: 3000,
    strictPort: true,
  },
  build: {
    outDir: "dist",   // Pasta de build padrão
    sourcemap: true,  // Facilita debug no modo produção
  },
  resolve: {
    alias: {
      "@": "/src",    // Atalho para importar componentes: import X from "@/components/X"
    },
  },
});
