"use client"

import { Text } from "@tremor/react";

import { Filter } from "@app/components/filter";
import { Results } from "@app/components/results";

export default () => {
  return (
    <main className="p-2 flex flex-col gap-2">
      <Text className={"text-3xl text-center m-12"}>Global EdTech Evidence List</Text>
      <Filter />
      <Results />
    </main>
  );
}
