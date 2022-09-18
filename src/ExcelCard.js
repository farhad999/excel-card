import React from "react";
import {utils, write} from "xlsx";
import FileSaver from 'file-saver'

function ExcelCard() {


    async function downloadFile() {
        //template

        const fileType = "application/vnd.ms-excel;charset=utf-8";

        let json = [{
            serial_no: '',
            batch_no: '',
            pin: '',
            password: '',
        }];

        const ws = utils.json_to_sheet(json);
        const wb = {Sheets: {data: ws}, SheetNames: ["data"]};
        const excelBuffer = write(wb, {bookType: "xlsx", type: "array"});
        const data = new Blob([excelBuffer], {type: fileType});

        FileSaver.saveAs(data, 'template.xlsx');
    }

    return (
        <div>
            <h3>ExcelCard</h3>

            <button onClick={downloadFile}>Download Template</button>

        </div>
    );
}

export default ExcelCard;
