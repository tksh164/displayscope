import { ExposedApi } from "@/@type/exposedApi";

declare global {
  interface Window {
    exposedApi: ExposedApi;
  }
}
