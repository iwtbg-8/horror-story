/*
  Central API client and base URL
  Usage:
    import { apiClient } from './api';
    const r = await apiClient.get('/your-endpoint');
*/
export const API_URL =
  process.env.REACT_APP_API_URL || "https://horror-story.onrender.com";

import axios from "axios";
export const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000
});
