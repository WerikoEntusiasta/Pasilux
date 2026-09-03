# Multi-stage Dockerfile para Pasilux
# Estágio 1: Build da aplicação (Vite + Backend) na plataforma nativa do host ($BUILDPLATFORM)
# Isso evita lentidão de emulação QEMU e o erro de rollup/musl no ARM64
FROM --platform=$BUILDPLATFORM node:20-alpine AS builder

WORKDIR /app

# Copia arquivos de definição de dependência
COPY package*.json ./

# Instala todas as dependências necessárias para o build
RUN npm install --no-audit --no-fund

# Copia todo o código-fonte da aplicação
COPY . .

# Executa o build de produção (gera a pasta dist/ com o frontend e dist/server.cjs)
RUN npm run build

# -----------------------------------------------------------------------------
# Estágio 2: Imagem final de execução (leve, segura e otimizada)
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copia arquivos de dependência
COPY package*.json ./

# Instala apenas as dependências de produção de forma resiliente (suporta presença ou ausência de package-lock.json)
RUN npm install --omit=dev --no-audit --no-fund && npm cache clean --force

# Copia os artefatos compilados do estágio de build
COPY --from=builder /app/dist ./dist

# Garante que as pastas persistentes de dados e uploads existam
RUN mkdir -p data uploads

# Porta padrão de acesso
EXPOSE 3000

# Comando para iniciar o servidor em produção
CMD ["node", "dist/server.cjs"]
