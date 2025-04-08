# This is a markdown file and should not be treated as a YAML file

## NOTA Agregar esta ruta en .helmignore

## Crear Secret private de Aunteticacion con google cloud (CLI)

# Nota Importante:

1 -  Descargar Archivo de configuracion de GCP 
  - https://console.cloud.google.com/iam-admin/serviceaccounts/details/103203138605401358918/permissions?invt=AbuIMg&project=teslo-shop-backend  

2 - cambiar nombre y dejar archivo de configuracion en 'C:/GCP/gcp-teslo-shop-backend.json'

3 - Ejecutar el comnado "kubectl create secret" en la terminal de git bash ya que 
    hay error al intepretar --docker-password="$(cat 'C:/GCP/gcp-teslo-shop-backend.json')"

``` 
kubectl create secret docker-registry gcr-json-key --docker-server=us-central1-docker.pkg.dev --docker-username=_json_key --docker-password="$(cat 'C:/GCP/gcp-teslo-shop-backend.json')" --docker-email=ruznicolas176@gmail.com --dry-run=client -o yaml | kubectl apply -f -
```

## Crear Confirg Map
```
kubectl create configmap  ng-teslo-shop-config --from-literal=BASE_URL=http://localhost:32550/api
```


## Crear Deploy 
``` 
kubectl create deployment ng-teslo-shop --image=us-central1-docker.pkg.dev/teslo-shop-backend/ng-teslo-shop/angular-app --dry-run=client -o yaml > ng-teslo-shop.deployment.yml
```

## Crear Service 
```
kubectl create service nodeport ng-teslo-shop --tcp=4200 --dry-run=client -o yaml > ng-teslo-shop.service.yml
```
