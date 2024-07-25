import { axios } from "./axios";
import type { Project } from "./projects.types";

const ENDPOINT = "/projects";

export async function getProjects() {
  const { data } = await axios.get<{ items: Project[] }>(ENDPOINT);

  return data.items;
}
