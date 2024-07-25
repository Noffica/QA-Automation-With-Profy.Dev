import { axios } from "./axios";
import type { Issue } from "./issues.types";
import type { Page } from "@typings/page.types";

const ENDPOINT = "/issues";

export async function getIssues(page?: number) {
  const { data } = await axios.get<Page<Issue>>(ENDPOINT, {
    params: {
      page: page,
    },
  });

  return data;
}
