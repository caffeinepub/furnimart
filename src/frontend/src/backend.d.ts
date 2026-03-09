import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export class ExternalBlob {
    getBytes(): Promise<Uint8Array<ArrayBuffer>>;
    getDirectURL(): string;
    static fromURL(url: string): ExternalBlob;
    static fromBytes(blob: Uint8Array<ArrayBuffer>): ExternalBlob;
    withUploadProgress(onProgress: (percentage: number) => void): ExternalBlob;
}
export type Time = bigint;
export interface UserProfile {
    name: string;
}
export interface Product {
    id: string;
    inStock: boolean;
    name: string;
    createdAt: Time;
    description: string;
    category: Category;
    imageId: ExternalBlob;
    price: bigint;
}
export enum Category {
    home = "home",
    office = "office"
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    createProduct(product: Product): Promise<void>;
    deleteProduct(productId: string): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getProduct(productId: string): Promise<Product | null>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isCallerAdmin(): Promise<boolean>;
    listAllProducts(): Promise<Array<Product>>;
    listProductsByCategory(category: Category): Promise<Array<Product>>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    updateProduct(product: Product): Promise<void>;
}
