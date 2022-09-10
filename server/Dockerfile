FROM denoland/deno:alpine-1.25.1

ARG VERSION

ENV PORT \
    POSTGRES_USER \
    POSTGRES_PASSWORD \
    POSTGRES_DB \
    POSTGRES_HOSTNAME \
    VERSION=${VERSION}

WORKDIR /app
USER deno
ADD ./src .
COPY ./deno.json .
RUN deno cache main.ts
CMD [ "run", "--allow-env", "--allow-read", "--allow-net", "main.ts" ]