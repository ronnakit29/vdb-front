import React from "react";
import { Table, TableHeader, TableColumn, TableBody, TableRow, TableCell, getKeyValue, Input, Button } from "@nextui-org/react";
import { FaFileExcel, FaRedo } from "react-icons/fa";
import exportToExcel from "../../plugins/excel";
import { headers } from "../../next.config";

export default function TableComponent({ rows, columns, onReload }) {
    const [search, setSearch] = React.useState("");
    // using regex to filter
    const filterRows = (rows, search) => {
        if (search === "") return rows;
        const regex = new RegExp(search, "gi");
        return rows.filter((row) => {
            return Object.keys(row).some((key) => {
                return regex.test(getKeyValue(row, key));
            });
        }
        );
    };
    function excelExport() {
        const fileName = `export_data.xlsx`
        return exportToExcel(rows, columns, fileName)
    }
    return (
        <div>
            <div className="flex justify-end mb-3 gap-4 items-center">
                <Input placeholder="ค้นหา" variant="bordered" color="primary" value={search} onChange={(e) => setSearch(e.target.value)} />
                <Button color="success" className="text-white gap-2 items-center" onClick={() => excelExport()}><FaFileExcel className="text-lg" />ส่งออก Excel</Button>
                {onReload && <Button color="secondary" className="" onClick={() => onReload && onReload()}><FaRedo /></Button>}
            </div>
            <Table aria-label="Example table with dynamic content" isStriped>
                <TableHeader columns={columns}>
                    {(column) => <TableColumn key={column.key}>{column.label}</TableColumn>}
                </TableHeader>
                <TableBody items={filterRows(rows, search)} emptyContent="ไม่มีข้อมูล">
                    {(item) => {
                        return (
                            <TableRow key={item.key}>
                                {(columnKey) => {
                                    const column = columns.find((c) => c.key === columnKey);
                                    return <TableCell ><span className="whitespace-nowrap truncate">{column.format ? column.format({ value: getKeyValue(item, columnKey), item: item }) : getKeyValue(item, columnKey)}</span></TableCell>
                                }}
                            </TableRow>
                        )
                    }}
                </TableBody>
            </Table>
        </div>
    );
}
