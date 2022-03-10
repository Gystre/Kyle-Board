import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/graphql";

//use this hook on every page that the user needs to be logged in
//it will redirect them to the login page
export const useIsAuth = (redirectUser: boolean = false) => {
    const { data, loading } = useMeQuery();
    const router = useRouter();

    useEffect(() => {
        // not logged in
        if (!loading && !data?.me && redirectUser) {
            router.replace("/login?next=/");
        }
    }, []);

    return data?.me;
};
