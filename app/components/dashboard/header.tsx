import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import Image from 'next/image';
import SearchForm from "./search-form";
import { Suspense } from "react";

export default function Header() {
  return (
    <header className="flex flex-col sm:flex-row h-full mt-3 pt-3 md:py-3 text-primary-foreground justify-between sm:items-center">
      <Image
        className="w-[240px] lg:w-[300px]"
        src="/gamesalmanac_logo.svg"
        alt="Games Almanac"
        width={300}
        height={32}
        priority
      />

      <Suspense fallback={(<></>)}>
        <SearchForm />
      </Suspense>
    </header>
  );
}
