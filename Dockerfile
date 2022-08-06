FROM denoland/deno:alpine-1.24.1

ENV PORT 8000

EXPOSE $PORT

ENV TEMP /appTemp

RUN mkdir $TEMP
RUN apk add unzip

WORKDIR /app

COPY ./src/deps.ts .
RUN deno cache deps.ts

ADD ./src .

RUN deno cache main.ts


CMD [\
    "run",\
    "--allow-env",\
    "--allow-run=unzip",\
    "--allow-read=db.json,/appTemp",\
    "--allow-write=db.json,/appTemp",\
    "--allow-net=0.0.0.0:8000,donnees.roulez-eco.fr",\
    "main.ts"\
]
