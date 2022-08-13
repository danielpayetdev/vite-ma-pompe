<div align="center">

<br />
<img src=".github/assets/logo.png" alt="logo" width="200" height="auto" />
<br />
<br />
<h1>ViteMaPompe</h1>
<p>Un projet pour simplifier l'accès aux données des prix de carburant en France.</p>
<p>A project to simplify access to fuel price data in France.</p>

<p>Data from <a href="https://www.prix-carburants.gouv.fr/rubrique/opendata/">french government</p>

<p>
  <a href="https://github.com/danielpayetdev/vite-ma-pompe/graphs/contributors">
    <img src="https://img.shields.io/github/contributors/danielpayetdev/vite-ma-pompe" alt="contributors" />
  </a>
  <a href="">
    <img src="https://img.shields.io/github/last-commit/danielpayetdev/vite-ma-pompe" alt="last update" />
  </a>
  <a href="https://github.com/danielpayetdev/vite-ma-pompe/issues/">
    <img src="https://img.shields.io/github/issues/danielpayetdev/vite-ma-pompe" alt="open issues" />
  </a>
  <a href="https://github.com/danielpayetdev/vite-ma-pompe/blob/master/LICENSE">
    <img src="https://img.shields.io/github/license/danielpayetdev/vite-ma-pompe.svg" alt="license" />
  </a>
</p>

<h4>
    <a href="https://github.com/danielpayetdev/vite-ma-pompe/">View Demo</a>
  <span> · </span>
    <a href="https://github.com/danielpayetdev/vite-ma-pompe">Documentation</a>
  <span> · </span>
    <a href="https://github.com/danielpayetdev/vite-ma-pompe/issues/">Report Bug</a>
  <span> · </span>
    <a href="https://github.com/danielpayetdev/vite-ma-pompe/issues/">Request Feature</a>
  </h4>
</div>

<br />

# Table of Contents

- [About the Project](#about-the-project)
  - [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
    - [Installation - Server](#installation---server)
    - [Installation - Client](#installation---client)
  - [Deployment](#deployment)
- [Contributing](#contributing)
- [Contact](#contact)

## About the Project

### Tech Stack

<details>
  <summary>Client</summary>
  <ul>
    <li><a href="https://flutter.dev/">Flutter</a></li>
  </ul>
</details>

<details>
  <summary>Server</summary>
  <ul>
    <li><a href="https://deno.land/">Deno</a></li>
    <li><a href="https://www.typescriptlang.org/">Typescript</a></li>
    <li><a href="https://honojs.dev/">Hono.js</a></li>
  </ul>
</details>

<details>
<summary>DevOps</summary>
  <ul>
    <li><a href="https://www.docker.com/">Docker</a></li>
  </ul>
</details>

## Getting Started

### Prerequisites

- For the server you need to install Deno : [see Deno guide](https://deno.land/manual/getting_started/installation).
- For the client you need to install Flutter : [see Flutter guide](https://docs.flutter.dev/get-started/install).

### Installation

Clone the project

```bash
git clone https://github.com/danielpayetdev/vite-ma-pompe.git
```

### Installation - Server

Go to the server directory

```bash
cd server
```

start the server

```bash
deno run --allow-all ./src/main.ts
```

### Installation - Client

Go to the client directory

```bash
cd client
```

install dependencies

```bash
flutter pub get
```

Start flutter app with cli or IDE tools

```bash
flutter run
```

<!-- Deployment -->

### Deployment

To deploy this project with docker run

```bash
docker build -t myRepo/myAppName . && docker run -p 8000:8000 myRepo/myAppName
```

To set a different port in docker image set `PORT` environment variable

```bash
PORT=1324 docker build -t myRepo/myAppName . && docker run -p 8000:8000 myRepo/myAppName
```

<!-- Contributing -->

## Contributing

<a href="https://github.com/danielpayetdev/vite-ma-pompe/graphs/contributors">
  <img src="https://contrib.rocks/image?repo=danielpayetdev/vite-ma-pompe" />
</a>

Contributions are always welcome!

## Contact

Daniel Payet - [@dpayet_dev](https://twitter.com/dpayet_dev)

Project Link:
[https://github.com/danielpayetdev/vite-ma-pompe](https://github.com/danielpayetdev/vite-ma-pompe)
