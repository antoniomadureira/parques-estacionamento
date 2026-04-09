import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Substitua 'matosinhos-estacionamento' pelo nome exato do seu repositório no GitHub
export default defineConfig({
  plugins: [react()],
  base: '/parques-estacionamento/', 
})