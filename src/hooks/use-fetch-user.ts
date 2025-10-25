import { BASEURL } from "@/constants";
import { useQuery } from "@tanstack/react-query";

export interface User {
  first_name: string;
  last_name: string;
  email: string;
}

async function fetchUser() {
  const user = await fetch(`${BASEURL}/user`);
  return user.json();
}

export function useFetchUser() {
  return useQuery<User>({
    queryKey: [`user`],
    queryFn: () => fetchUser(),
  });
}
