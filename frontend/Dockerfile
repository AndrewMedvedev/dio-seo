FROM node:20-bullseye-slim

WORKDIR /app

# 1. Копируем package.json
COPY package*.json ./

# 2. Чистая установка с удалением возможных конфликтов
RUN rm -rf node_modules package-lock.json && \
    npm install --legacy-peer-deps && \
    npm install @babel/plugin-proposal-private-property-in-object@7.21.0-placeholder-for-preset-env.2 --save-exact --force

# 3. Проверка
RUN npm list @babel/plugin-proposal-private-property-in-object && \
    ls -la node_modules/@babel/plugin-proposal-private-property-in-object

# 4. Копируем остальные файлы
COPY . .

# 5. Сборка
RUN npm run build

EXPOSE 3000

CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]