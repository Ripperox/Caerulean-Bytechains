# ERC-20 Token Contract with Role-Based Access Control (Dockerized)

This project implements an **ERC-20 token** using Solidity with a **customized minting mechanism and role-based access control**. It includes a **burn function, mint event logging, and admin-controlled minting permissions**. The project is built and tested using **Hardhat** and can be run inside a Docker container.

---

## Features

- **ERC-20 Token Implementation**
  - Name, Symbol, Decimals, and Initial Supply.
  - Minting function (restricted to Admin role).
  - Burn function for token holders.
  - Event logging for mint and burn actions.

- **Role-Based Access Control**
  - Admin can assign and revoke minting privileges.
  - Only assigned roles can mint new tokens.

- **Comprehensive Testing**
  - Deployment verification.
  - Token transfers.
  - Role-based minting and burning validations.

- **Dockerized Setup**
  - No need to install Node.js or Hardhat locally.
  - Easily deploy and test within a container.

---
# ERC-20 Token Contract with Role-Based Access Control (Dockerized)

This project implements an **ERC-20 token** using Solidity with a **customized minting mechanism and role-based access control**. It includes a **burn function, mint event logging, and admin-controlled minting permissions**. The project is built and tested using **Hardhat** and can be run inside a Docker container.

---

## Features

- **ERC-20 Token Implementation**
  - Name, Symbol, Decimals, and Initial Supply.
  - Minting function (restricted to Admin role).
  - Burn function for token holders.
  - Event logging for mint and burn actions.

- **Role-Based Access Control**
  - Admin can assign and revoke minting privileges.
  - Only assigned roles can mint new tokens.

- **Comprehensive Testing**
  - Deployment verification.
  - Token transfers.
  - Role-based minting and burning validations.

- **Dockerized Setup**
  - No need to install Node.js or Hardhat locally.
  - Easily deploy and test within a container.

---

## Installation & Setup

### Prerequisites

Ensure you have **Docker** installed and running on your system.

### Clone the Repository
```sh
git clone https://github.com/Ripperox/Caerulean-Bytechains.git
cd Caerulean-Bytechains/part1


### Prerequisites

Ensure you have **Docker** installed and running on your system.
```

### Build the Docker Image


## Build & Run with Docker
### Build the Docker image using the following command:
```sh
docker build -t hardhat-tests .
```
## Compile the Contract
### Run the container to compile the Solidity contract:

```sh
docker run --rm hardhat-tests npx hardhat compile
```
## Run Tests
### Execute the test suite within the Docker container:

```sh
docker run --rm hardhat-tests npx hardhat test
```
![image](https://github.com/user-attachments/assets/c6bd0410-be63-4ee7-94bd-a645c8fee5f2)





