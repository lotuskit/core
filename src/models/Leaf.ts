import Redis from "redis";
import { Session } from "./Session";
import { Message } from "./Message";

/**
 * Types
 */
export type LeafNext = () => void
export type LeafReject = (error: any) => void

/**
 * Interfaces
 */
export interface Leaf {
    handle(session_or_message: Session | Message, next: LeafNext, reject?: LeafReject): void;
}
export interface HandshakeLeaf {
    handle(session: Session, next: LeafNext, reject?: LeafReject): void;
}
export interface MessageLeaf {
    handle(message: Message, next: LeafNext, reject?: LeafReject): void;
}

/**
 * Abstract Classes
 */
abstract class AbstractLeaf implements Leaf {
    constructor(private redis: Redis.RedisClient) {}

    /**
     * Handle incoming demand
     */
    public abstract handle(session_or_message: Session | Message, next: LeafNext, reject?: LeafReject): void;
}

export abstract class AbstractHandshakeLeaf extends AbstractLeaf implements HandshakeLeaf {
    /**
     * Handle incoming demand
     */
    public abstract handle(session: Session, next: LeafNext, reject?: LeafReject): void;
}

export abstract class AbstractMessageLeaf extends AbstractLeaf implements MessageLeaf {
    /**
     * Handle incoming demand
     */
    public abstract handle(message: Message, next: LeafNext, reject?: LeafReject): void;
}
