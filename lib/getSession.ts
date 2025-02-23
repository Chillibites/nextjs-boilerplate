// By using cache(auth), you are optimizing the authentication process. Caching can improve performance by reducing the number of times the auth function needs to be called, especially if it involves expensive operations like network requests.

import { auth } from "@/auth";
import { cache } from "react";

export default cache(auth);

