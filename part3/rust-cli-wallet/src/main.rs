use clap::{App, Arg, SubCommand};
use ed25519_dalek::{Keypair, PublicKey, SecretKey, Signature, Signer, Verifier};
use rand::rngs::OsRng;
use serde::{Deserialize, Serialize};
use std::fs::File;
use std::io::{self, Read, Write};
use std::path::Path;

const WALLET_FILE: &str = "wallet.json";

#[derive(Serialize, Deserialize)]
struct WalletData {
    public_key: String,
    private_key: String,
}

fn main() -> Result<(), Box<dyn std::error::Error>> {
    let matches = App::new("Rust CLI Wallet")
        .version("1.0")
        .author("Claude")
        .about("A simple CLI cryptocurrency wallet")
        .subcommand(SubCommand::with_name("create").about("Create a new wallet"))
        .subcommand(SubCommand::with_name("show").about("Show wallet public key"))
        .subcommand(
            SubCommand::with_name("sign")
                .about("Sign a message with your private key")
                .arg(Arg::with_name("message").required(true).help("Message to sign")),
        )
        .subcommand(
            SubCommand::with_name("verify")
                .about("Verify a signed message")
                .arg(Arg::with_name("message").required(true).help("Original message"))
                .arg(Arg::with_name("signature").required(true).help("Signature in hex")),
        )
        .get_matches();

    match matches.subcommand() {
        ("create", _) => create_wallet()?,
        ("show", _) => show_public_key()?,
        ("sign", Some(sign_matches)) => {
            let message = sign_matches.value_of("message").unwrap();
            sign_message(message)?;
        }
        ("verify", Some(verify_matches)) => {
            let message = verify_matches.value_of("message").unwrap();
            let signature_hex = verify_matches.value_of("signature").unwrap();
            verify_signature(message, signature_hex)?;
        }
        _ => {
            println!("Please specify a valid command. Use --help for usage information.");
        }
    }

    Ok(())
}

fn create_wallet() -> Result<(), Box<dyn std::error::Error>> {
    println!("Creating a new wallet...");

    // Check if wallet already exists
    if Path::new(WALLET_FILE).exists() {
        println!("A wallet already exists. Do you want to overwrite it? (y/n)");
        let mut input = String::new();
        io::stdin().read_line(&mut input)?;
        if input.trim().to_lowercase() != "y" {
            println!("Wallet creation canceled.");
            return Ok(());
        }
    }

    // Generate a new random keypair
    // Fixed: Use OsRng correctly for ed25519-dalek v1.0
    let mut csprng = OsRng {};
    let keypair: Keypair = Keypair::generate(&mut csprng);

    // Convert keys to storable format
    let wallet_data = WalletData {
        public_key: hex::encode(keypair.public.as_bytes()),
        private_key: hex::encode(keypair.secret.as_bytes()),
    };

    // Serialize and save to file
    let json = serde_json::to_string_pretty(&wallet_data)?;
    let mut file = File::create(WALLET_FILE)?;
    file.write_all(json.as_bytes())?;

    println!("Wallet created successfully!");
    println!("Public key: {}", wallet_data.public_key);
    println!("Your wallet data is stored in {}", WALLET_FILE);
    println!("Keep your wallet file safe and secure.");

    Ok(())
}

fn show_public_key() -> Result<(), Box<dyn std::error::Error>> {
    if !Path::new(WALLET_FILE).exists() {
        println!("No wallet found. Please create a wallet first with 'create' command.");
        return Ok(());
    }

    let wallet_data = load_wallet_data()?;
    println!("Your public key: {}", wallet_data.public_key);
    Ok(())
}

fn sign_message(message: &str) -> Result<(), Box<dyn std::error::Error>> {
    if !Path::new(WALLET_FILE).exists() {
        println!("No wallet found. Please create a wallet first with 'create' command.");
        return Ok(());
    }

    let wallet_data = load_wallet_data()?;

    // Reconstruct keys from stored data
    let secret_bytes = hex::decode(&wallet_data.private_key)?;
    let secret_key = SecretKey::from_bytes(&secret_bytes)?;
    let public_bytes = hex::decode(&wallet_data.public_key)?;
    let public_key = PublicKey::from_bytes(&public_bytes)?;
    let keypair = Keypair {
        secret: secret_key,
        public: public_key,
    };

    // Sign the message
    let signature = keypair.sign(message.as_bytes());
    let signature_hex = hex::encode(signature.to_bytes());

    println!("Message: {}", message);
    println!("Signature: {}", signature_hex);

    Ok(())
}

fn verify_signature(message: &str, signature_hex: &str) -> Result<(), Box<dyn std::error::Error>> {
    if !Path::new(WALLET_FILE).exists() {
        println!("No wallet found. Please create a wallet first with 'create' command.");
        return Ok(());
    }

    let wallet_data = load_wallet_data()?;

    // Reconstruct public key
    let public_bytes = hex::decode(&wallet_data.public_key)?;
    let public_key = PublicKey::from_bytes(&public_bytes)?;

    // Reconstruct signature
    let signature_bytes = hex::decode(signature_hex)?;
    let signature = Signature::from_bytes(&signature_bytes)?;

    // Verify the signature
    match public_key.verify(message.as_bytes(), &signature) {
        Ok(_) => println!("Signature verification successful! The message is authentic."),
        Err(_) => println!("Signature verification failed! The message may have been tampered with."),
    }

    Ok(())
}

fn load_wallet_data() -> Result<WalletData, Box<dyn std::error::Error>> {
    let mut file = File::open(WALLET_FILE)?;
    let mut contents = String::new();
    file.read_to_string(&mut contents)?;
    let wallet_data: WalletData = serde_json::from_str(&contents)?;
    Ok(wallet_data)
}