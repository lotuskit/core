import Redis from "redis";
import { Leaf, HandshakeLeaf, MessageLeaf } from "./Leaf";
import { Session } from "./Session";
import { Message } from "./Message";

/**
 * The Striper go through all Leafs,
 * and ask them for response
 */
export class Striper {
    public static strip(redis: Redis.RedisClient,
                        session_or_message: Session | Message,
                        leafClasses: { new(redis: Redis.RedisClient): Leaf }[]): Promise<void> {

        return new Promise((resolve, reject) => {

            // If no leafs, return payload
            if (leafClasses.length === 0) {
                resolve();
                return;
            }

            // Fetch & instanciate first leaf
            const leafClass = leafClasses[0];
            const leaf = new leafClass(redis);

            // Remove instanciated leafClass
            const reduced_leafClasses = [...leafClasses];
            reduced_leafClasses.shift();

            // Create next callback
            const next = () => {
                // If it was the lad leaf, resolve with payload
                if (reduced_leafClasses.length === 0) {
                    resolve();
                }
                
                // Else, create new stripe and do it again
                else {
                    Striper.strip(redis, session_or_message, reduced_leafClasses)
                    .then(
                        () => resolve()
                    ).catch(
                        (err: any) => reject(err)
                    );
                }
            }

            // Handle data
            leaf.handle(session_or_message, next, reject);
        });
    }
}
