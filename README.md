# Project title

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
