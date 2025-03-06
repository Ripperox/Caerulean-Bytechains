# Rust CLI Wallet

A command-line wallet application built in Rust that allows users to generate cryptographic key pairs, sign messages, and verify signatures.

## Features

- **Key Pair Generation**: Create a new wallet with a unique cryptographic key pair
- **Message Signing**: Sign messages using your private key
- **Signature Verification**: Verify the authenticity of signed messages
- **Persistent Storage**: Save and load wallet data from files
- **User-friendly CLI**: Simple command-line interface for all operations

## Installation

### Prerequisites

- Rust and Cargo (install from [rustup.rs](https://rustup.rs/))

### Building from Source

## Installation & Setup

### Prerequisites

Ensure you have **Docker** installed and running on your system.

### Clone the Repository
```sh
git clone https://github.com/Ripperox/Caerulean-Bytechains.git
cd Caerulean-Bytechains/part3/rust-cli-wallet

```


## Build & Run with Cargo
### Build the Cargo container using the following command:
```sh
cargo build --release
```
## Run Container
```sh
cargo run -- --help
```
## Index
SUBCOMMANDS:

    cargo run -- --create    Create a new wallet
    cargo run -- --help      Prints this message or the help of the given subcommand(s)
    cargo run -- --show      Show wallet public key
    cargo run -- --sign      Sign a message with your private key
    cargo run -- --verify    Verify a signed message
