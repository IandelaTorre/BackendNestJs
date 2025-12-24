export class CodeGeneratorUtil {
    static generateUserCode(name: string): string {
        const cleanName = name.replace(/[^a-zA-Z]/g, '').toUpperCase().substring(0, 3).padEnd(3, 'X');
        const random = Math.random().toString(36).substring(2, 7);
        return `${cleanName}-${random}`;
    }
}
