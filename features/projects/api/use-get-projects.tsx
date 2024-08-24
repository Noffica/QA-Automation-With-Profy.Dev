import { useQuery } from "@tanstack/react-query";
import { getProjects } from "@api/projects";
import type { Project } from "@api/projects.types";
import type { Response } from "@typings/response.types";

export function useGetProjects() {
  return useQuery<Response<Project>, Error>(["projects"], getProjects);
}
