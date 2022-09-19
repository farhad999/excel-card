import React from "react";
import {utils, write, read} from "xlsx";
import FileSaver from 'file-saver'
import ReactToPrint from "react-to-print";
import {ComponentToPrint} from "./ComponentPrint";
import Layout from "./card_layouts/front/Layout";
import MainLayout from "./card_layouts/MainLayout";
import Back from './assets/back.jpg'
import LayoutBack from "./card_layouts/LayoutBack";
import {config} from "./config";

function ExcelCard() {

    const fileRef = React.useRef();

    const [fileName, setFileName] = React.useState();

    const [data, setData] = React.useState([]);

    const [selectedLayout, setSelectedLayout] = React.useState('layout1');

    const printableRef = React.useRef();

    const printableBackRef = React.useRef();

    //number of elements that does not fill a row

    const [remainingItems, setRemainingItems] = React.useState([]);

    const [numberOfItemsPerPage, setNumberOfItemsPerPage] = React.useState(3);

    //layouts
    const layouts = [{
        title: 'layout1',
        width: 50,
        height: 20,
        backImage: <Back/>
    }];

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

        let layout = layouts.find(item => item.title === selectedLayout);

        let itemsPerRow = Math.floor(config.paperSize.width / layout.width);

        setNumberOfItemsPerPage(itemsPerRow);

        let count = allData.length % (itemsPerRow);

        setRemainingItems(allData.slice(Math.max(allData.length - count, 0)));

        setData(allData.slice(0, allData.length - count))

        console.log('fraction', count, numberOfItemsPerPage);

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

        FileSaver.saveAs(data, new Date().toLocaleDateString() + 'template.xlsx');
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
            <div>
                <ReactToPrint
                    trigger={() => <button>Print this out!</button>}
                    content={() => printableRef.current}
                />
                <div>

                </div>
                <ComponentToPrint ref={printableRef}/>
            </div>

            <div>
                <ReactToPrint
                    trigger={() => <button>Print Back Side</button>}
                    content={() => printableBackRef.current}
                />
                <div>

                </div>
                <ComponentToPrint ref={printableBackRef}/>
            </div>

            <div style={{display: 'none'}}>

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

            {
                //Printable
            }

            <div ref={printableRef}>
                <MainLayout>
                    {data.map((d, index) => {
                        return <Layout key={index} item={d}/>
                    })}
                </MainLayout>
                <div>
                    <MainLayout width={remainingItems.length/numberOfItemsPerPage}>
                        {remainingItems.map((d, index) => {
                            return <Layout key={index} item={d}/>
                        })}
                    </MainLayout>
                </div>
            </div>

            {
                //Print backside
            }

            <div style={{display: 'none'}}>
                <div ref={printableBackRef}>
                    <MainLayout>
                        {Array.from(Array(50), (e, i) => {
                            return <LayoutBack image={Back}/>
                        })}
                    </MainLayout>
                </div>
            </div>


        </div>
    );
}

export default ExcelCard;
