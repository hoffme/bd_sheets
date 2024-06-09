import { Button, Card, Icon, Table, TableBody, TableCell, TableFoot, TableFooterCell, TableHead, TableHeaderCell, TableRow } from "@tremor/react";
import { RiArrowDownCircleFill, RiArrowRightCircleLine, RiArrowUpCircleFill, RiLoader2Fill } from '@remixicon/react';
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

interface Row {
    company: string;
    country: string;
    effectiveness: string;
    efficacy: string;
    environment: string;
    equity: string;
    ethics: string;
    product: string;
    status: string;
    totalScore: string
    url: string;
}

import { Pagination } from "../pagination";
import Link from "next/link";

export const Results = () => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    
    const [loading, setLoading] = useState(true);
    const [result, setResult] = useState<{ data: Row[]; count: number; limit: number; skip: number }>({
        data: [],
        count: 0,
        limit: 10,
        skip: 0
    });

    useEffect(() => {
        setLoading(true)

        fetch(`/api/search?${searchParams.toString()}`)
            .then(res => res.json())
            .then(result => setResult(result.data))
            .finally(() => setLoading(false))
    }, [searchParams])

    const sort = useMemo(() => {
        const by = searchParams.get('sortBy');
        const dir = parseInt(searchParams.get('sortDir') || '-1');
        return { by, dir }
    }, [searchParams])

    const setSort = useMemo(() => (key: string) => {
        let sortBy: string | null = key;
        let sortDir: number | null = -1;

        if (sortBy === sort.by) sortDir = sort.dir + 2;
        if (sortDir > 1) sortBy = null, sortDir = null;

        const params = new URLSearchParams(searchParams)
        
        if (sortBy) params.set('sortBy', sortBy)
        else if (params.has('sortBy')) params.delete('sortBy');

        if (sortDir) params.set('sortDir', sortDir.toString())
        else if (params.has('sortDir')) params.delete('sortDir');

        router.push(`${pathname}?${params.toString()}`)
    }, [pathname, router, sort])

    const columns = useMemo(() => {
        return [
            { key: 'company', label: 'Company' },
            { key: 'product', label: 'Product' },
            { key: 'efficacy', label: 'Efficacy' },
            { key: 'effectiveness', label: 'Effectiveness' },
            { key: 'ethics', label: 'Ethics' },
            { key: 'equity', label: 'Equity' },
            { key: 'enviroment', label: 'Enviroment' },
            { key: 'status', label: 'Status' },
            { key: 'country', label: 'Country' },
            { key: 'totalScore', label: 'Total Score' },
            { 
                key: 'url', 
                label: 'URL', 
                child: (row: Row) => (
                    <Button variant={"light"} onClick={() => window.open(row.url, "_blank")}>
                        Link
                    </Button>
                )
            },
        ];
    }, [])

    if (loading) {
        return <div className={"p-10 flex align-center justify-center"}>
            <Icon icon={RiLoader2Fill} />
        </div>
    }

    return <Card className={"box-border max-w-7xl mx-auto p-0 mt-4"}>
        <Table>
            <TableHead>
                <TableRow>
                    {columns.map((col, index) => (
                        <TableHeaderCell key={`col_${index}_${col.key}`}>
                            <Button 
                                color={sort.by === col.key && sort.dir !== 0 ? undefined : "gray"}
                                icon={
                                    (sort.by === col.key && sort.dir !== 0) ? 
                                        (sort.dir > 0 ? RiArrowUpCircleFill : RiArrowDownCircleFill) : 
                                        undefined
                                } 
                                iconPosition={"right"} 
                                variant={"light"}
                                onClick={() => setSort(col.key)}
                            >
                                {col.label}
                            </Button>
                        </TableHeaderCell>
                    ))}
                </TableRow>
            </TableHead>
            <TableBody>
                {result.data.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={11} className={"text-center"}>
                            Not results
                        </TableCell>
                    </TableRow>
                )}
                {result.data.map((row, i) => (
                    <TableRow key={`row_${i}`}>
                        {columns.map((col, j) => (
                            <TableCell key={`cell_${i}_${j}_${col.key}`}>
                                {col.child ? col.child(row) : row[col.key as keyof typeof row]}
                            </TableCell>
                        ))}
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        <Pagination count={result.count} className={"w-full flex flex-row align-center justify-center"} />
    </Card>
}