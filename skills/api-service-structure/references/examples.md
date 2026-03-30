# File Layout

```text
src/services/
  api-handler.ts
  route/
    assessment.route.ts
  client/
    assessment.client.ts
  queries/
    assessment.query.ts
  functions/
    assessment.fns.ts
src/util/
  get-error-message.ts
  query-key-factory.ts
src/types/
  assessment.type.ts
```

# Type Example

```ts
export type AssessmentType = {
  id: string;
  name: string;
};

export type CreateAssessmentType = {
  name: string;
};

export type ApiResponse<T> = {
  data: T;
  message?: string;
  status?: string;
};
```

# Route Example

```ts
const baseUrl = "/assessment";

const AssessmentRoute = {
  root: baseUrl,
};

export default AssessmentRoute;
```

# Client Example

Read-side requests only.

```ts
import apiHandler from "@/services/api-handler";
import AssessmentRoute from "@/services/route/assessment.route";
import type { ApiResponse, AssessmentType } from "@/types/assessment.type";

export const fetchAssessment = async (query?: string) => {
  const { data } = await apiHandler.get<ApiResponse<AssessmentType[]>>(
    `${AssessmentRoute.root}${query ? `?${query}` : ""}`
  );

  return data.data;
};
```

# Query Example

Use `client/` fetchers only.

```ts
import { getQueryClient } from "@/services/query-client";
import { fetchAssessment } from "@/services/client/assessment.client";
import { keyFactory } from "@/util/query-key-factory";

export const prefetchAssessment = () => {
  const queryClient = getQueryClient();

  return queryClient.prefetchQuery({
    queryKey: keyFactory.assessment.all,
    queryFn: () => fetchAssessment("maxPerPage=200"),
  });
};
```

# Function Hook Example

Write-side requests belong here, not in `client/`.

```ts
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import apiHandler from "@/services/api-handler";
import AssessmentRoute from "@/services/route/assessment.route";
import getErrorMessage from "@/util/get-error-message";
import { keyFactory } from "@/util/query-key-factory";
import type { CreateAssessmentType } from "@/types/assessment.type";

const useAssessmentFns = () => {
  const queryClient = useQueryClient();

  const [loading, setLoading] = useState({
    CREATE_ASSESSMENT: false,
  });

  const loadingFn = (state: keyof typeof loading, value: boolean) => {
    setLoading(prev => ({ ...prev, [state]: value }));
  };

  const fns = {
    createAssessment: async (body: CreateAssessmentType, callback: () => void) => {
      loadingFn("CREATE_ASSESSMENT", true);

      try {
        await apiHandler.post(AssessmentRoute.root, body);
        queryClient.invalidateQueries({ queryKey: keyFactory.assessment.all });

        callback();
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        loadingFn("CREATE_ASSESSMENT", false);
      }
    },
  };

  return { ...fns, loading };
};

export default useAssessmentFns;
```

# Auth Write Example

`POST /login` should stay in `functions/`.

```ts
import { useState } from "react";
import { toast } from "sonner";
import apiHandler from "@/services/api-handler";
import AuthRoute from "@/services/route/auth.route";
import Storage from "@/util/storage";
import getErrorMessage from "@/util/get-error-message";
import type { LoginType } from "@/types/auth.type";

const useAuthFns = () => {
  const [loading, setLoading] = useState({
    SIGNIN: false,
  });

  const loadingFn = (state: keyof typeof loading, value: boolean) => {
    setLoading(prev => ({ ...prev, [state]: value }));
  };

  const fns = {
    login: async (data: LoginType, path = "/") => {
      loadingFn("SIGNIN", true);

      try {
        const res = await apiHandler.post(AuthRoute.login, data);
        const accessToken = res.data.data.accessToken;

        Storage.setCookie("token", accessToken);
        toast.success("Login successful!");
        window.location.href = path;
      } catch (error) {
        toast.error(getErrorMessage(error));
      } finally {
        loadingFn("SIGNIN", false);
      }
    },
  };

  return { ...fns, loading };
};

export default useAuthFns;
```
