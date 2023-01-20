import React from "react";
import MainLayout from "../Layouts/MainLayout";

export default function Login() {
    return (
        <MainLayout pageName="Login">
            <div className="flex flex-col items-center w-full">
                <div className="text-2xl">Word Search or Something</div>
                <div className="flex">
                    <input type="text" className="p-2 rounded-full" />
                </div>
            </div>
        </MainLayout>
    );
}
