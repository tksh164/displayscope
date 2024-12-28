export function IsRunInDevelopmentEnv(): boolean {
  return process.env.NODE_ENV === "development";
}
