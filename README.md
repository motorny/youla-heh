# Yoloco stats

## Установка расширения в браузер

Для рекламодателей предоставляется расширение для бразуера Google Chrome.
Сперва скачайте файл `ui_ext.zip` с [официальной страницы проекта](https://github.com/motorny/youla-heh/releases), выбирайте последнюю 
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

Зайдите на [Сайт instagram](https://www.instagram.com/), выберите любой пост в открытом аккаунте,
нажмите на иконку расширения, а затем на кнопку "Show statistics".

![Пример](./docs/tut6.png?raw=true "Пример")

Ожидайте загрузки результатов.


## Развертывание серверной части

### Предварительные требования

Установленные на сервере:
 - Apache2: для обеспечения защищенного HTTPS соединения
 - Docker: для запуска веб-сервера

### Установка
 
Простейший способ настройки прокси сервиса Apache2 для обеспечения HTTPS соединения - 
использование сервиса [Certbot](`https://certbot.eff.org/`), следуйте инструкциям с данного
сайта, в процессе установки необходимо будет ввести DNS имя сервера.

Затем, необходимо настроить Proxy в Apache2 для переадресации запросов к веб сервису.

В файл `/etc/apache2/sites-available/000-default-le-ssl.conf` добавьте следующие строчки: 

```
        <Location "/">
                ProxyPreserveHost On
                ProxyPass "http://127.0.0.1:8008/"
                ProxyPassReverse "http://127.0.0.1:8008/"
                RequestHeader set X-Forwarded-Proto expr=%{REQUEST_SCHEME}
                RequestHeader set X-Forwarded-SSL expr=%{HTTPS}
        </Location>
```
В файл `/etc/apache2/apache2.conf` добавьте сточку

```
LoadModule headers_module /usr/lib/apache2/modules/mod_headers.so
```
 
Установите недостающие модули для Apache2
```
sudo a2enmod proxy
sudo a2enmod proxy_http
sudo a2enmod proxy_balancer
sudo a2enmod lbmethod_byrequests
```
 
Перезапустите сервис

```
sudo systemctl start apache2
```
 
Запустите сборку контейнера, а затем и сам контейнер
```
docker run  -p 8008:8008 -d youla-dev

# check it is started
docker ps

```


 
### Development

```
docker image build -t youla-dev ./
```


###### Simpliest start
```bash
bash ./run.sh

```
###### Docker build and run

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
