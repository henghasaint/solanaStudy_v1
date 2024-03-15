import {
    Connection,
    Transaction,
    SystemProgram,
    sendAndConfirmTransaction,
    PublicKey,
    LAMPORTS_PER_SOL
} from "@solana/web3.js";
import "dotenv/config";
import { getKeypairFromEnvironment } from "@solana-developers/helpers";

const suppliedToPubkey = process.argv[2] || null;

if (!suppliedToPubkey) {
    console.log(`Please provide a public key to send to`);
    process.exit(1);
}
const senderKeypair = getKeypairFromEnvironment("SECRET_KEY1");
console.log(`senderKeypair PubKey: ${senderKeypair.publicKey}`);
console.log(`suppliedToPubkey: ${suppliedToPubkey}`);
const toPubkey = new PublicKey(suppliedToPubkey);
const connection = new Connection("https://api.devnet.solana.com", "confirmed");

const address = new PublicKey(senderKeypair.publicKey);
const balance = await connection.getBalance(address);
const balanceInSol = balance / LAMPORTS_PER_SOL;
console.log(`The balance of ${address.toBase58()} is ${balanceInSol}`);

console.log(`✅ Loaded our own keypair, the destination public key, and connected to Solana`);
console.log(
    `✅ Loaded our own keypair, the destination public key, and connected to Solana`
);
const transaction = new Transaction();

const LAMPORTS_TO_SEND = 5000;

const sendSolInstruction = SystemProgram.transfer({
    fromPubkey: senderKeypair.publicKey,
    toPubkey,
    lamports: LAMPORTS_TO_SEND,
});

transaction.add(sendSolInstruction);

const signature = await sendAndConfirmTransaction(connection, transaction, [
    senderKeypair,
]);

console.log(
    `💸 Finished! Sent ${LAMPORTS_TO_SEND} to the address ${toPubkey}. `
);
// console.log(`Transaction signature is ${signature} !`);
console.log(`You can view your transaction on the Solana Explorer at:\nhttps://explorer.solana.com/tx/${signature}?cluster=devnet`)
// Important note:
// In Solana, accounts need to maintain a minimum balance to remain rent - exempt.
// This minimum balance is determined by the account's data size and the current rent exemption threshold. 
// If an account's balance falls below this threshold, it is not rent-exempt, and the network can purge it.