import { ExposedApi } from "@/types/exposedApi";

declare global {
  interface Window {
    exposedApi: ExposedApi;
  }
}
