import Redis from "redis";
import { Session } from "./Session";
import { Message } from "./Message";
import { Metrics } from "../lib/metrics";
import { HandshakeLeaf, MessageLeaf } from "./Leaf";

/**
 * The Striper go through all Leafs,
 * and ask them for response
 */
export class Striper {
    public static strip(config: any,
                        redis: Redis.RedisClient,
                        metrics: Metrics,
                        session_or_message: Session | Message,
                        leafs: (HandshakeLeaf | MessageLeaf)[]): Promise<void> {

        return new Promise((resolve, reject) => {
            // If no leafs, return payload
            if (leafs.length === 0) {
                resolve();
                return;
            }

            // Fetch first leaf
            const leaf: (HandshakeLeaf | MessageLeaf) = leafs[0];

            // Remove instanciated leafClass
            const reduced_leafs = [...leafs];
            reduced_leafs.shift();

            const started_at = new Date().getTime();

            // Determine scope
            const scope = (session_or_message.constructor.name === 'Session' ? 'H' : 'M');

            // Create next callback
            const leafNext = () => {
                metrics.add(`leaf:[${scope}] ${leaf.name}`, new Date().getTime() - started_at);

                // If it was the lad leaf, resolve with payload
                if (reduced_leafs.length === 0) {
                    resolve();
                }
                
                // Else, create new stripe and do it again
                else {
                    Striper.strip(config, redis, metrics, session_or_message, reduced_leafs)
                    .then(
                        () => resolve()
                    ).catch(
                        (err: any) => reject(err)
                    );
                }
            }

            // Create reject callback
            const leafReject = (reason: any) => {
                metrics.add(`leaf:[${scope}] ${leaf.name}`, new Date().getTime() - started_at);
                reject(reason);
            }

            // Handle data
            const leafEnv = { config, redis };
            if (session_or_message.constructor.name === 'Session') {
                (<HandshakeLeaf> leaf).engine(leafEnv, <Session> session_or_message, leafNext, leafReject);
            } else {
                (<MessageLeaf> leaf).engine(leafEnv, <Message> session_or_message, leafNext, leafReject);
            }
        });
    }
}
