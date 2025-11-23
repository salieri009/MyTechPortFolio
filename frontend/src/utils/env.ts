export const getEnv = (key: string): string | undefined => {
    return (import.meta as any).env[key]
}
