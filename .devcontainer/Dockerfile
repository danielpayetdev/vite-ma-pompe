# [Choice] Debian OS version: bullseye, buster
ARG VARIANT=bullseye
FROM --platform=linux/amd64 mcr.microsoft.com/vscode/devcontainers/base:0-${VARIANT}

ENV BUN_INSTALL=/home/vscode

RUN curl -fsSL https://bun.sh/install | bash 

ENV BUN_INSTALL="/home/vscode/.bun" \
    PATH="$BUN_INSTALL/bin:$PATH"