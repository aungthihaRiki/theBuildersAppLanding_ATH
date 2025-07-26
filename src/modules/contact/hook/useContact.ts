import { api } from "~/utils/api";
import type { ContactInput } from "../logic/ContactSchema";
import { TRPCClientError } from "@trpc/client";

type ContactOutputs = {
  onSuccess?: (data: unknown) => void;
  onError?: (message: string) => void;
  onDuplicate?: () => void;
};

export const useContact = ({
  onSuccess,
  onDuplicate,
  onError,
}: ContactOutputs = {}) => {
  const mutation = api.contact.submit.useMutation();
  const submit = async (formData: ContactInput) => {
    try {
      const result = await mutation.mutateAsync(formData);
      void onSuccess?.(result);
      return;
    } catch (error: unknown) {
      // if (error instanceof TRPCClientError && error.data?.code === "CONFLICT") {
      //   void onDuplicate?.();
      //   return;
      // }
      // console.dir(error);

      if (
        error instanceof TRPCClientError &&
        typeof error.data === "object" &&
        error.data !== null &&
        "code" in error.data &&
        (error.data as { code?: string }).code === "CONFLICT"
      ) {
        void onDuplicate?.();
        return;
      }
    }
    void onError?.("Failed to submit contact form");
  };
  return {
    submit,
    isLoading: mutation.isPending,
  };
};
