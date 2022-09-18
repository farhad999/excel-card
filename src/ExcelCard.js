import React from "react";
import {utils, write, read} from "xlsx";
import FileSaver from 'file-saver'

function ExcelCard() {

    const fileRef = React.useRef();

    const [fileName, setFileName] = React.useState();

    const [data, setData] = React.useState([]);

    const onFileSelect = async (event) => {
        const file = event.target.files[0];

        setFileName(file.name);

        const fileData = await file.arrayBuffer();

        const wb = read(fileData);

        console.log("array", wb);

        let sheets = wb.SheetNames;

        let allData = [];

        for (let sheet of sheets) {
            let ws = wb.Sheets[sheet];
            const data = utils.sheet_to_json(ws);
            console.log("sheet", sheet);
            allData = [...allData, ...data];
        }

        setData(allData);
        console.log(allData);
    };

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

            <div>
                <h4>Import Excel File</h4>
                <button onClick={() => fileRef.current.click()}>Import</button>
            </div>

            <input type={'file'} style={{display: 'none'}}
                   onChange={onFileSelect}
                   accept=".xlsx, .csv, .xls"
                   ref={fileRef}/>

            {fileName &&

                <div>
                    <h4>{fileName}</h4>
                    <button>Clear</button>
                </div>
            }



            <table>
                <thead>
                {data.length > 0 && (
                    <tr>
                        {Object.keys(data[0]).map((col, index) => (
                            <th key={index}>{col}</th>
                        ))}
                    </tr>
                )}
                </thead>
                <tbody>
                {data.map((row, rowIndex) => (
                    <tr key={rowIndex}>
                        {Object.keys(row).map((col, index) => (
                            <td key={index}>{row[col]}</td>
                        ))}
                    </tr>
                ))}
                </tbody>
            </table>

        </div>
    );
}

export default ExcelCard;
