import { ExposedApi } from "@/types/app";

declare global {
  interface Window {
    exposedApi: ExposedApi;
  }
}
