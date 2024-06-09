"use client"

import { MultiSelect, MultiSelectItem, TextInput, Button } from "@tremor/react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useCallback, useEffect, useState } from "react";

export interface Filter {
    query?: string;
    status?: { key: string; label: string }[];
    country?: { key: string; label: string }[];
    totalScore?: { key: string; label: string }[];
}

interface Props {}

export const Filter = (props: Props) => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    
    const [query, setQuery] = useState<string>("");
    const [status, setStatus] = useState<string[]>([]);
    const [country, setCountry] = useState<string[]>([]);
    const [totalScore, setTotalScore] = useState<string[]>([]);

    const [statusOptions, setStatusOptions] = useState<{ key: string; label: string }[]>([]);
    const [countryOptions, setCountryOptions] = useState<{ key: string; label: string }[]>([]);
    const [totalScoreOptions, setTotalScoreOptions] = useState<{ key: string; label: string }[]>([]);

    useEffect(() => {
        fetch('/api/filters')
            .then(res => res.json())
            .then((result) => {
                setStatusOptions(result.data.status);
                setCountryOptions(result.data.country);
                setTotalScoreOptions(result.data.totalScore);
            })
    }, [])

    useEffect(() => {
        if (searchParams.has('query')) setQuery(searchParams.get('query') ?? "")
        if (searchParams.has('status')) setStatus((searchParams.get('status') ?? "").split(','))
        if (searchParams.has('country')) setCountry((searchParams.get('country') ?? "").split(','))
        if (searchParams.has('totalScore')) setTotalScore((searchParams.get('totalScore') ?? "").split(','))
    }, [searchParams])

    const submit = useCallback((e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const params = new URLSearchParams()
        
        if (query.length > 0) params.set('query', query)
        else if (params.has('query')) params.delete('query') 

        if (status.length > 0) params.set('status', status.join(','))
        else if (params.has('status')) params.delete('status') 

        if (country.length > 0) params.set('country', country.join(','))
        else if (params.has('country')) params.delete('country') 

        if (totalScore.length > 0) params.set('totalScore', totalScore.join(','))
        else if (params.has('totalScore')) params.delete('totalScore') 

        router.push(`${pathname}?${params.toString()}`)
    }, [router.push, pathname, query, status, country, totalScore])

    return <form className={"flex flex-col gap-1 p-1 max-w-3xl m-auto w-full"} onSubmit={submit}>
        <TextInput value={query} onValueChange={setQuery} placeholder={"Query"} />
        <div className={"flex flex-row gap-1 flex-wrap"}>
            <MultiSelect className={"flex-1"} value={status} onValueChange={setStatus} placeholder={"Status"}>
                {statusOptions.map((row, index) => (
                    <MultiSelectItem key={`status_${index}`} value={row.key}>
                        {row.label}
                    </MultiSelectItem>
                ))}
            </MultiSelect>
            <MultiSelect className={"flex-1"} value={country} onValueChange={setCountry} placeholder={"Country"}>
                {countryOptions.map((row, index) => (
                    <MultiSelectItem key={`country_${index}`} value={row.key}>
                        {row.label}
                    </MultiSelectItem>
                ))}
            </MultiSelect>
            <MultiSelect className={"flex-1"} value={totalScore} onValueChange={setTotalScore} placeholder={"Total Score"}>
                {totalScoreOptions.map((row, index) => (
                    <MultiSelectItem key={`total_score_${index}`} value={row.key}>
                        {row.label}
                    </MultiSelectItem>
                ))}
            </MultiSelect>
        </div>
        <Button>Search</Button>
    </form>
}