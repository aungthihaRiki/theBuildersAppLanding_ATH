import { api } from "~/utils/api";
import type { ContactInput } from "../logic/ContactSchema";
import { TRPCClientError } from "@trpc/client";

type ContactOutputs = {
    onSuccess?: ( data: unknown ) => void,
    onError?: (message: string) => void,
    onDuplicate?: () => void
}

export const  useContact = ({onSuccess, onDuplicate, onError}: ContactOutputs = {}) => {
    const mutation = api.contact.submit.useMutation();
    const submit = async (formData: ContactInput) => {
        try {
            const result = await mutation.mutateAsync(formData)
            onSuccess?.(result);
            return
        } catch (error) {
            if (error instanceof TRPCClientError  && error.data?.code === "CONFLICT") {
                onDuplicate?.();
                return
            }
            console.dir(error)

        }
        onError?.("Failed to submit contact form");
    }
    return {
        submit,
        isLoading: mutation.isPending,
    }
}