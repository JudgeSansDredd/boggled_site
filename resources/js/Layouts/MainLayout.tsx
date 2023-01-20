import { Head } from "@inertiajs/inertia-react";
import React from "react";

interface PropType {
    pageName: string;
}

export default function MainLayout(props: React.PropsWithChildren<PropType>) {
    return (
        <>
            <Head title={props.pageName} />
            <div className="min-h-screen overflow-y-auto min-w-screen">
                <div className="container min-h-screen mx-auto">
                    {props.children}
                </div>
            </div>
        </>
    );
}
