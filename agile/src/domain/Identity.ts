/**
 *
 */
export default class Identity {

    static generateWithPrefix(prefix: string): string {
        return `${prefix}-${this.date()}-${this.generateUID()}`
    }

    static generate(): string {
        return `${this.date()}-${this.generateUID()}`
    }

    private static date = (): string => {
        const now = new Date();
        const d = now.getDate();
        const m = now.getMonth() + 1; //Month from 0 to 11
        const y = now.getFullYear().toString().substr(-2);
        return `${y}${ m<=9 ? '0'+m : m }${ d <= 9 ? '0'+d : d}`;
    };

    private static generateUID = () => {
        let firstPart = (Math.random() * 46656) | 0;
        let secondPart = (Math.random() * 46656) | 0;
        return ("000" + firstPart.toString(36)).slice(-3) +
            ("000" + secondPart.toString(36)).slice(-3);
    }
}
