
# Sensors Back-end

  <p align="center">A back-end service that includes generation and processing sensor data and API, which allows to get aggregated information</p>

## Description

There are two parts of back-end service:

- Main application that contains API and generation of sensor requests
- Worker application that is connected with main by queues, processes sensor requests and stores information in database 

## Installation

There is docker-compose.yml file, which contains all necessary information about installing a service.

To build a project:

```bash
$ docker compose build
```

## Running the app

Before running the app, make sure that old containers are deleted. You can delete them with:

```bash
$ docker compose down
```

To start a project:

```bash
$ docker compose up
```

## Test

```bash
$ npm run test
```

## Stay in touch

- Author - Sviatoslav Shesterov
