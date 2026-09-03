# Multi-stage Dockerfile para Pasilux
# Estágio 1: Build da aplicação (Frontend Vite + Backend Express compilado)
FROM node:20-alpine AS builder

WORKDIR /app

# Copia arquivos de dependência
COPY package*.json ./

# Instala todas as dependências (incluindo devDependencies necessárias para o build)
RUN npm ci

# Copia o código-fonte da aplicação
COPY . .

# Executa o build de produção (gera a pasta dist/ com o frontend e dist/server.cjs)
RUN npm run build

# -----------------------------------------------------------------------------
# Estágio 2: Imagem final de execução (leve, segura e otimizada)
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Instala apenas dependências de produção
COPY package*.json ./
RUN npm ci --omit=dev && npm cache clean --force

# Copia os artefatos compilados do estágio anterior
COPY --from=builder /app/dist ./dist

# Garante que as pastas persistentes de dados e uploads existam
RUN mkdir -p data uploads

# Porta padrão de acesso
EXPOSE 3000

# Comando para iniciar o servidor em produção
CMD ["node", "dist/server.cjs"]
