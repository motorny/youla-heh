# Yoloco stats

## Установка расширения в браузер

Для рекламодателей предоставляется расширение для бразуера Google Chrome.
Сперва скачайте файл `Source code.zip` с [официальной страницы проекта](https://github.com/motorny/youla-heh/releases), выбирайте последнюю 
версию. 

Распакуйте скаченный архив стандартными средствами операционной системы.

Откройте браузер Google Chrome, в контекстном меню дополнительных 
настроек выберите `Дополнительные инструменты -> расширения`.

![Расширения](./docs/tut1.png?raw=true "Расширения")

Включите режим разработчика в правом верхнем углу.

![Режим разработчика](./docs/tut2.png?raw=true "Режим разработчика")

Нажмите на кнопку `Загрузить распакованное расширение` в левом верхнем углу
![Загрузить распакованное расширение](./docs/tut3.png?raw=true "Загрузить распакованное расширение")

В папке, куда был распакован архив, выберите подпапку `ui_ext` и подтвердите свой выбор.
![Папка](./docs/tut4.png?raw=true "Папка")

Расширение установлено, при посещении сайта instagram.com иконка расширения станет доступна. Нажимте
на нее для выполнения анализа рекламных агентов.

![Использование](./docs/tut5.png?raw=true "Использование")

## Simple run

```bash
bash ./run.sh

```

## Docker build and run

```bash
docker image build -t youla-dev ./

# observe new image
docker ls

docker run  -p 8008:8008 -d youla-dev

# check it is started
docker ps
``` 

Debugging tips:
```bash
# launch shell inside a container
docker run -it python-hello-world  /bin/sh

# get logs
docker container logs <id from docker ps>
```
