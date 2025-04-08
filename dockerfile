# Paso 1: Imagen base con Node.js (versión 21 en Alpine)
FROM node:21-alpine3.19 AS build

# Paso 2: Establece el directorio de trabajo
WORKDIR /app

# Paso 3: Copia los archivos de configuración y dependencias
COPY angular.json package.json package-lock.json ./

# Paso 4: Instala dependencias antes de copiar el código fuente completo (para aprovechar cacheo de capas)
RUN npm install

# Paso 5: Copia el resto de los archivos de la aplicación
COPY . .

# Paso 6: Construye la aplicación Angular
RUN npm run build

# Paso 7: Usa Nginx para servir la aplicación
FROM nginx:alpine

# Paso 8: Copia la configuración personalizada de Nginx
COPY ./config/default.conf /etc/nginx/conf.d/default.conf

# Paso 9: Copia los archivos de la aplicación Angular construida desde la etapa anterior
COPY --from=build /app/dist/teslo-shop/browser /usr/share/nginx/html

# Exponer el puerto 80 para acceso web
EXPOSE 4200

# Paso 10: Ejecuta Nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
