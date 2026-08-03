import { createServerFn } from "@tanstack/react-start";
import { probePvpHomepage } from "./pvpAdapter.server";

export const probePvp = createServerFn({ method: "GET" }).handler(async () => {
  return probePvpHomepage();
});
