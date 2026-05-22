import axios from "axios";

declare module "axios" {
  export interface AxiosRequestConfig {
    noCache?: boolean; // <-- your custom field
  }
}