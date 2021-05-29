export declare const setCORS: (CORSURL: string) => typeof translate;
export declare const setHTTPService: (customHTTPService: {
    get: (url: string, data: any, header: any) => Promise<any>;
}) => typeof translate;
export declare function translate(text: string, opts_?: {
    from?: string;
    to?: string;
    hl?: string;
    tld?: string;
    raw?: boolean;
}): Promise<unknown>;
export default translate;
