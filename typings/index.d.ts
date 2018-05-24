export declare class ValidationError extends Error {
    name: any;
    constructor(message: any, name: any);
}
export declare class FormatError extends Error {
    name: any;
    constructor(message: any, name: any);
}
declare const enforce: (definition: any, ...params: any[]) => undefined;
export default enforce;
