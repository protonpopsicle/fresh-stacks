import React from "react";

function Profile() {
    return (
        <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/330px-React-icon.svg.png" alt="React"/>
    );
}

export default function Gallery() {
    return (
        <section>
            <h1>Fresh Stacks</h1>
            <Profile />
            <Profile />
            <Profile />
        </section>
    );
}
