import React from "react";
import {utils, write, read} from "xlsx";
import FileSaver from 'file-saver'
import ReactToPrint from "react-to-print";
import {ComponentToPrint} from "./ComponentPrint";
import Layout from "./card_layouts/front/Layout";
import MainLayout from "./card_layouts/MainLayout";
import LayoutBack from "./card_layouts/LayoutBack";
import BackClearConnect from './assets/back_clear_connect.jpg'
import BackInternational from './assets/back_international.jpg'
import {config} from "./config";
import clsx from 'clsx'

function ExcelCard() {

    const fileRef = React.useRef();

    const [fileName, setFileName] = React.useState('');

    const [data, setData] = React.useState([]);

    const [selectedLayoutIndex, setSelectedLayoutIndex] = React.useState(0);

    const printableRef = React.useRef();

    const printableBackRef = React.useRef();

    //number of elements that does not fill a row

    const [remainingItems, setRemainingItems] = React.useState([]);

    const [numberOfItemsPerPage, setNumberOfItemsPerPage] = React.useState(3);

    const [validationError, setValidationError] = React.useState('');

    //layouts
    const layouts = [{
        title: 'layout1',
        width: 50,
        height: 20,
        backImage: BackClearConnect,
    }, {
        title: 'layout2',
        width: 50,
        height: 20,
        backImage: BackClearConnect,
    }, {
        title: 'layout3',
        width: 50,
        height: 20,
        backImage: BackInternational,
    }];

    React.useEffect(() => {

    }, []);

    const onFileSelect = async (event) => {
        const file = event.target.files[0];

        setFileName(file.name);

        const fileData = await file.arrayBuffer();

        const wb = read(fileData);

        let sheets = wb.SheetNames;

        let allData = [];

        for (let sheet of sheets) {
            let ws = wb.Sheets[sheet];
            const data = utils.sheet_to_json(ws);
            allData = [...allData, ...data];
        }

        //now validate

        let isValid = validate(allData, ['serial_no', 'batch_no', 'pin', 'password']);

        if (!isValid) {
            return;
        }
        setValidationError("");

        let layout = layouts[selectedLayoutIndex];

        let itemsPerRow = Math.floor(config.paperSize.width / layout.width);

        setNumberOfItemsPerPage(itemsPerRow);

        let count = allData.length % (itemsPerRow);

        setRemainingItems(allData.slice(Math.max(allData.length - count, 0)));

        setData(allData.slice(0, allData.length - count))

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

    const validate = (data, requiredKeys) => {

        for (let item of data) {

            let check = requiredKeys.every(key => {

                if (item.hasOwnProperty(key)) {
                    let value = item[key];

                    let length = typeof value === 'number' ? value.toString().length : value.length;

                    return length > 0;
                } else {
                    return false;
                }
            })
            if (!check) {
                setValidationError('Validation Error: Row Number ' + +(item.__rowNum__ + 1));
                return false;
            }
        }

        return true;
    }

    function remove() {
        setFileName('');
        setData([]);
        setRemainingItems([]);
    }

    return (
        <div className={'container max-w-screen-lg mx-auto'}>

            <div className={'flex items-center justify-between bg-blue-700 py-2 px-2'}>
                <h3 className={'text-white text-lg'}>ExcelCard</h3>
                <select className={'w-32 p-1 bg-white'} value={selectedLayoutIndex}
                        onChange={(event) => setSelectedLayoutIndex(event.target.value)}>
                    {layouts.map((item, index) => (
                        <option value={index}>
                            <div className={'capitalize'}>
                                {item.title}
                            </div>
                        </option>
                    ))}
                </select>
            </div>

            <div className={'shadow-sm border border-gray-50 bg-white py-2'}>
                <div
                    className={'text-center capitalize text-lg font-semibold'}>{layouts[selectedLayoutIndex].title}({layouts[selectedLayoutIndex].width}x{layouts[selectedLayoutIndex].height})
                </div>

                <div className={'flex justify-around'}>
                    <LayoutBack layout={layouts[selectedLayoutIndex]}/>
                    <Layout item={{serial_no: 'SERIAL_NO', batch_no: 'BATCH_NO', pin: "PIN", password: 'PASSWORD'}}
                            layout={layouts[selectedLayoutIndex]}/>
                </div>
            </div>


            {/*<div className={'my-1 flex justify-between border border-gray-200 py-3 px-2 shadow-sm rounded-md'}>
                <h4 className={'text-lg'}>Import Excel File</h4>
                <button className={'btn btn-primary'} onClick={() => fileRef.current.click()}>Import</button>
            </div>*/}

            <input type={'file'} style={{display: 'none'}}
                   onChange={onFileSelect}
                   accept=".xlsx, .csv, .xls"
                   ref={fileRef}/>

            <div className={'flex justify-end space-x-1 my-3'}>

                <button className={'btn btn-primary'} onClick={() => fileRef.current.click()}>Import</button>

                <button className={'btn btn-primary'} onClick={downloadFile}>Download Template</button>

                {/*<ComponentToPrint ref={printableRef}/>*/}

                <ReactToPrint
                    trigger={() => <button className={'btn btn-primary'}>Print Back
                        Side</button>}
                    content={() => printableBackRef.current}
                />


            </div>

            {
                /* section for showing data */
            }

            {fileName &&

                <div
                    className={'flex justify-between items-center my-2 shadow-sm rounded-md p-2 border border-gray-200 bg-white'}>
                    <h4 className={'font-semibold'}>{fileName}</h4>
                    {validationError ? <div>{validationError}</div>
                        :
                        <div className={'font-semibold'}>{data.length + remainingItems.length} Records</div>
                    }

                    <div className={'flex space-x-1'}>
                        <button className={'btn bg-red-400'} onClick={remove}>Remove</button>
                        <ReactToPrint
                            trigger={() => <button
                                className={clsx('btn btn-primary', {'hover:cursor-not-allowed': !data.length})}
                                disabled={!data.length}>Print</button>}
                            content={() => printableRef.current}
                        />
                    </div>

                </div>
            }

            {/*<div>

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

            </div>*/}

            {
                //Printable
            }

            <div style={{display: 'none'}}>
                <div ref={printableRef}>
                    <MainLayout>
                        {data.map((d, index) => {
                            return <Layout key={index} item={d} layout={layouts[selectedLayoutIndex]}/>
                        })}
                    </MainLayout>
                    <div>
                        <MainLayout width={remainingItems.length / numberOfItemsPerPage}>
                            {remainingItems.map((d, index) => {
                                return <Layout layout={layouts[selectedLayoutIndex]} key={index} item={d}/>
                            })}
                        </MainLayout>
                    </div>
                </div>
            </div>


            {
                //Print backside
            }

            <div style={{display: 'none'}}>
                <div ref={printableBackRef}>
                    <MainLayout>
                        {Array.from(Array(52), (e, i) => {
                            return <LayoutBack layout={layouts[selectedLayoutIndex]}/>
                        })}
                    </MainLayout>
                </div>
            </div>


        </div>
    );
}

export default ExcelCard;
