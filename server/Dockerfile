FROM denoland/deno:alpine-1.24.3
ENV PORT 8000
EXPOSE $PORT
ENV TEMP /appTemp
RUN mkdir $TEMP
RUN apk add unzip
WORKDIR /app
ADD ./src .
RUN deno cache main.ts
CMD [\
    "run",\
    "--allow-env",\
    "--allow-run=unzip",\
    "--allow-read",\
    "--allow-write",\
    "--allow-net=0.0.0.0:8000,donnees.roulez-eco.fr",\
    "main.ts"\
]
