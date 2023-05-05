import { log } from "console";
import { SocksProxyAgent , SocksProxyAgentOptions } from "socks-proxy-agent";

const info:SocksProxyAgentOptions = {
    hostname: '127.0.0.1',
    port:"8888",
  
};
const agent = new SocksProxyAgent(info);
export default agent
