FROM denoland/deno:alpine-1.25.1

EXPOSE 1993
ENV PORT=1993 \
    POSTGRES_USER= \
    POSTGRES_PASSWORD= \
    POSTGRES_DB= \
    POSTGRES_HOSTNAME=
WORKDIR /app
USER deno
ADD ./src .
COPY ./deno.json .
RUN deno cache main.ts
CMD [ "run", "--allow-env", "--allow-read", "--allow-net", "--unstable", "main.ts" ]