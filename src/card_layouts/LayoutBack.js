import React from "react";

function Layout1({layout}) {

    let {width, height, backImage} = layout;

    let style = {width: width+'mm', height: height+"mm"}

    return (
        <div style={style}>
            <img className={'layout-image'} src={backImage} alt={'back'}/>
        </div>
    )

}

export default Layout1;
