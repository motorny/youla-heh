FROM python:3.6.1-alpine
RUN apk update && apk add --no-cache --virtual .build-deps \
    gcc \
    python3-dev \
    musl-dev \
    postgresql-dev \
    && pip install --no-cache-dir psycopg2-binary \
    && apk del --no-cache .build-deps && apk add postgresql-dev
COPY requirements.txt /app/requirements.txt
WORKDIR /app
RUN pip install -r requirements.txt
ADD . /app
RUN pip install -e ./
CMD ["sh", "run.sh"]