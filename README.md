# NodeJS Project

Welcome to the NodeJS project! This README provides all the information you need to get started and understand the structure of the project.

## Table of Contents

-   [Project Overview](#project-overview)
-   [Docker Setup](#docker-setup)
-   [Libraries Used](#libraries-used)
    -   [Dependencies](#dependencies)
    -   [DevDependencies](#devdependencies)
-   [How to Start the Project](#how-to-start-the-project)
-   [Project Scripts](#project-scripts)
-   [License](#license)

## Project Overview

This project is built with NodeJS and includes a variety of libraries to facilitate development. The project is configured to use Docker for easy setup and deployment.

## Docker Setup

To run the project using Docker, follow these steps:

1. Download the [docker-compose.dev.yml](https://raw.githubusercontent.com/Unknown-Gravity/tbtc-arb-relayer/dev/docker-compose.dev.yml) file from this repository.

2. Edit `docker-compose.dev.yml` with your customizations.

3. Run the following command to start the project:
    ```bash
    docker compose -f docker-compose.dev.yml up
    ```

## Libraries Used

### Dependencies

-   **@ethersproject/experimental**: ^5.7.0
-   **axios**: ^1.7.2
-   **bitcoinjs-lib**: ^6.0.1
-   **compression**: ^1.7.4
-   **cors**: ^2.8.5
-   **eth-crypto**: ^2.6.0
-   **ethers**: ^5.7.2
-   **express**: ^4.18.2
-   **helmet**: ^6.1.4
-   **node-cron**: ^3.0.3
-   **rimraf**: ^6.0.1

### DevDependencies

-   **@types/axios**: ^0.14.0
-   **@types/compression**: ^1.7.5
-   **@types/express**: ^4.17.21
-   **@types/helmet**: ^6.0.1
-   **@types/node**: ^20.1.4
-   **@types/node-cron**: ^3.0.11
-   **ts-node**: ^10.9.2
-   **ts-node-dev**: ^2.0.0
-   **typescript**: ^5.5.3

## How to Start the Project (Local)

### Development Mode

To start the application in development mode, run:

```bash
npm run dev
```

## Project Scripts

The following npm scripts are avaliable:

    -   `npm run dev`: Runs the application in development mode.
    -   `npm start`: Runs the application in production mode

## License
