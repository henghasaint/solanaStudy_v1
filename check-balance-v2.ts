import { Connection, clusterApiUrl, PublicKey } from '@solana/web3.js';
import { getHashedName, getNameAccountKey, NameRegistryState } from '@solana/spl-name-service';

// 设置连接到 Solana 主网
const connection = new Connection(clusterApiUrl("mainnet-beta"), "confirmed");

const resolveSNSDomainToPublicKey = async (domain) => {
    try {
        // 首先，获取域名的哈希值
        const hashedDomainName = await getHashedName(domain.replace(".sol", ""));
        // 然后，获取该哈希值对应的名称账户的公钥
        const domainPublicKey = await getNameAccountKey(hashedDomainName, undefined);

        // 获取域名注册状态
        const registryState = await NameRegistryState.retrieve(connection, domainPublicKey);

        console.log(`SNS 域名 ${domain} 对应的 Solana 公钥地址是: ${registryState.owner.toBase58()}`);
    } catch (error) {
        console.error(`解析 SNS 域名时出错: ${error}`);
    }
};

// 示例：解析几个 SNS 域名
const snsDomains = ["toly.sol", "shaq.sol", "mccann.sol"];
snsDomains.forEach(domain => {
    resolveSNSDomainToPublicKey(domain);
});
