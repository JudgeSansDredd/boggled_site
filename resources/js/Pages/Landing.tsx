import React, { MouseEventHandler } from "react";
import Button from "../Components/Button";
import MainLayout from "../Layouts/MainLayout";

export default function Login() {
    const SubmitButtonHandler: MouseEventHandler<HTMLButtonElement> = (e) => {};

    return (
        <MainLayout pageName="Login">
            <div className="flex flex-col items-center w-full space-y-4">
                <div className="mb-4 text-2xl">Word Search or Something</div>
                <Button text="Create a New Room" />
                <div className="flex items-center space-x-4">
                    <label htmlFor="room-code">Room Code</label>
                    <input
                        type="text"
                        className="p-2 rounded-full"
                        name="room-code"
                    />
                    <Button
                        text="Enter Existing Room"
                        onClick={SubmitButtonHandler}
                    />
                </div>
            </div>
        </MainLayout>
    );
}
