import React from "react";

function MainLayout({width = 1, children}) {

    console.log('width', width);

    return (
        <div className={'main-layout'} style={{width: `${width * 100}%`}}>
            {children}
        </div>
    )
}

export default MainLayout;
