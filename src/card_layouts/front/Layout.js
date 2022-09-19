import React from "react";

function Layout(props) {

    let {item} = props;

    console.log('props', item);

    return (
        <div className={'layout1 flex items-center justify-center'}>
            <div style={{padding: '2px 4px'}}>
                <div style={{padding: '5px 5px', backgroundColor:"grey"}}>
                    <div>{item.pin} {item.password}</div>
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
