import { api } from "~/utils/api";
import type { ContactInput } from "../logic/ContactSchema";
import { TRPCClientError } from "@trpc/client";
export const  useContact = ({
    onSuccess,
    onError,
    onDuplicate
} : {
    onSuccess?: ( data: unknown ) => void,
    onError?: (message: string) => void,
    onDuplicate?: () => void
} = {}) => {
    const mutation = api.contact.submit.useMutation();
    const submit = async (formData: ContactInput) => {
        try {
            const result = await mutation.mutateAsync(formData)
            onSuccess?.(result);
            return
        } catch (error) {
            // console.log(error)
            if (error instanceof TRPCClientError  && error.data?.code === "CONFLICT") {
                console.log("TRPC Error");
                console.log("TRPC Code:", error.data?.code);
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