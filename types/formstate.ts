export type FormState =
  | {
      errors?: {
        name?: string[];
        lastname?: string[];
        email?: string[];
        password?: string[];
        phone?: string[];
        day?: string[];
        month?: string[];
        year?: string[];
        gender?: string[];
        userIdentityType?: string[];
        userIdentity?: string[];
        operationCenter?: string[];
        operationPoint?: string[];
      };
      message?: string;
    }
  | undefined;
