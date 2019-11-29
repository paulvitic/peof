import shortid from "shortid";

export default class Identity {

    static generateWithPrefix(prefix: string): string {
        return `${prefix}-${this.date}-${shortid.generate()}`
    }

    static generate(): string {
        return `${this.date}-${shortid.generate()}`
    }

    private static date = (): string => {
        const now = new Date();
        const d = now.getDate();
        const m = now.getMonth() + 1; //Month from 0 to 11
        const y = now.getFullYear().toString().substr(-2);
        return `"${y}${ m<=9 ? '0'+m : m }${ d <= 9 ? '0'+d : d}"`;
    }
}
