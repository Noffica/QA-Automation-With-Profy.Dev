// import assert from "assert";
import Axios from "axios";

// TODO Set NEXT_PUBLIC_API_BASE_URL in Git repo
// assert(
//   process.env.NEXT_PUBLIC_API_BASE_URL,
//   "env variable not set: NEXT_PUBLIC_API_BASE_URL (did you forget to create a .env file from .env.template?)",
// );

export const axios = Axios.create({
  baseURL:
    process.env.NEXT_PUBLIC_API_BASE_URL ||
    "https://hidden-bastion-18291-71157d9a31ff.herokuapp.com",
});

axios.interceptors.response.use(
  (response) => {
    response.data.items = transformDataItems(response.data.data);

    return response;
  },
  function (error) {
    Promise.reject(error).catch((err) =>
      console.error("Axios interceptor error:", err),
    );
  },
);

interface DataItem {
  id: string;
  attributes: Record<string, number>;
}

function transformDataItems(data: DataItem[]) {
  return data.map((item) => {
    return { id: item.id, ...item.attributes };
  });
}
