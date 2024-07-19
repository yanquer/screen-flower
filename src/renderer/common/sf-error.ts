
export class SFError extends Error {
    constructor(data: { type?: string, error?: string, why?: string }) {
        super();
    }

}
