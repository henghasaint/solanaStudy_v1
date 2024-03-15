import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { getHashedName, NameRegistryState } from '@solana/spl-name-service';

const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

type Domain = string;

const resolveSNSDomainToPublicKey = async (domain: Domain) => {
    try {
        console.log(`Processing domain: ${domain}`);
        const hashedDomainName = await getHashedName(domain.replace(".sol", ""));
        const domainPublicKey = new PublicKey(Buffer.from(hashedDomainName));

        console.log(`Hashed domain name: ${domainPublicKey.toBase58()}`);      // Fetch the account info for the domainPublicKey
        const accountInfo = await connection.getAccountInfo(domainPublicKey);
        if (accountInfo === null) {
            console.error(`The public key ${domainPublicKey.toBase58()} for SNS domain ${domain} does not exist`);
            return;
        }

        const registryState = await NameRegistryState.retrieve(connection, domainPublicKey);
        console.log(`The Solana public key address for SNS domain ${domain} is: ${registryState.owner.toBase58()}`);
    } catch (error) {
        console.error(`Error processing domain ${domain}:`, error);
    }
};

const snsDomains: Domain[] = ["toly.sol", "shaq.sol", "mccann.sol"];

for (const domain of snsDomains) {
    await resolveSNSDomainToPublicKey(domain);
}
