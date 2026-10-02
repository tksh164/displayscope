export function isRunInDevelopmentEnv(): boolean {
  return process.env.NODE_ENV === "development";
}
