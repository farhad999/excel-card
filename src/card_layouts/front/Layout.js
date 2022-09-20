import React from "react";

function Layout({layout, item}) {

    let {width, height} = layout;

    let style = {width: width + "mm", height: height + 'mm'};

    return (
        <div style={style} className={'flex items-center justify-center'}>
            <div style={{padding: '2px 4px'}}>
                <div className={'flex items-center justify-between'} style={{padding: '5px 5px', backgroundColor: "grey"}}>
                    <div>{item.pin}</div>
                    <div>{item.password}</div>
                </div>
                <div className={'flex justify-between'}>
                    <div>{item.batch_no}</div>
                    <div>{item.serial_no}</div>
                </div>
            </div>
        </div>
    )

}

export default Layout;
