import { ExposedApi } from "./exposedApi";

declare global {
  interface Window {
    exposedApi: ExposedApi;
  }
}
