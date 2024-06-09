"use client"

import { RiArrowLeftLine, RiArrowRightLine } from "@remixicon/react";
import {  Button } from "@tremor/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useMemo } from "react";

interface Props {
    className?: string
    count: number
}

export const Pagination = (props: Props) => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    const { limit, skip } = useMemo(() => {
        const limit = parseInt(searchParams.get('limit') || '10')
        const skip = parseInt(searchParams.get('skip') || '0')
        
        return { skip, limit }
    }, [searchParams])

    const move = useCallback((page: number) => {
        const params = new URLSearchParams(searchParams)

        const nextSkip = (skip + (page * limit)) >= 0 ? (skip + (page * limit)) : 0;
        
        if (limit !== 10) params.set('limit', limit.toString())
        else if (params.has('limit')) params.delete('limit')

        if (nextSkip !== 0) params.set('skip', nextSkip.toString())
        else if (params.has('skip')) params.delete('skip')

        router.push(`${pathname}?${params.toString()}`)
    }, [limit, skip, searchParams, pathname, router])

    return <div className={props.className}>
        <div className="flex flex-row gap-2 p-2 w-full align-center justify-center">
            <Button 
                disabled={skip === 0}
                icon={RiArrowLeftLine} 
                iconPosition="right" 
                variant="light"
                onClick={() => move(-1)}
            />
            <div className={"w-20 text-center"}>
                {skip} - {skip + limit}
            </div>
            <Button
                disabled={skip + limit > props.count}
                icon={RiArrowRightLine} 
                iconPosition="right" 
                variant="light"
                onClick={() => move(1)}
            />
        </div>
    </div>
}