import React from "react";
import BoggleBoard from "../Components/BoggleBoard";
import MainLayout from "../Layouts/MainLayout";

export default function Home() {
    return (
        <MainLayout pageName="Home">
            <div className="flex justify-center mt-4">
                <BoggleBoard boardLayout="abcdefghijklmnopqrstuvwxy" />
            </div>
        </MainLayout>
    );
}
