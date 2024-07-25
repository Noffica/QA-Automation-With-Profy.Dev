import { useQuery } from "@tanstack/react-query";
import { getIssues } from "@api/issues";
import type { Page } from "@typings/page.types";
import type { Issue } from "@api/issues.types";

export function useGetIssues(page?: number) {
  const query = ["issues", page];

  return useQuery<Page<Issue>, Error>(query, () =>
    getIssues(page).then((data) => {
      return { items: data.items, meta: data.meta };
    }),
  );
}
