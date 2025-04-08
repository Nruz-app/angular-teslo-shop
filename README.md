

# Instalar paquetes Variable de entorno
```
* * - ng g environments
* * - npm i -D dotenv
* * - crear .env
* * Crear Script De Ejecucion de Variable de Entorno
* * - scripts/set-envs.js
* * - node ./scripts/set-envs.js  | npm run set-envs
```

#### Linkd Doc Table 

## - https://daisyui.com/components/table/

#### Linkd Doc Dash Boar 

## - https://www.creative-tim.com/twcomponents/component/dashboard-navigation

###### Link Doc ######

## - Imagen Carousel => https://swiperjs.com/get-started

###### Instalar Paquete ######

## - npm install swiper

###### Link Doc Guards ######

## https://angular.dev/guide/http/interceptors

###### Link Doc Guards ######

## https://angular.dev/guide/routing/common-router-tasks#preventing-unauthorized-access


###### Comandos Ejecutar para contruir Imagenes de Docker ######

# Comando limpiar docker
``` 
docker-compose down
docker system prune -a --volumes -f
```
# Comando Para countruir la imagen local y prod
``` 
docker-compose build
docker-compose -f docker-compose.prod.yml build
```
# Comado para levantar imagen local y prod
```
docker-compose up -d
docker-compose -f docker-compose.prod.yml up -d
```
# Comado para subir imagen al repositorio de google cloud (GCP)
```
gcloud auth configure-docker us-central1-docker.pkg.dev
docker image push us-central1-docker.pkg.dev/teslo-shop-backend/teslo-shop-app/teslo-shop-backend
```

# Github Pages 

[View Teslo Shop Angular](https://nruz-app.github.io/angular-teslo-shop/#/)
