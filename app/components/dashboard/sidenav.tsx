'use client';

import { DEFAULT_PLATFORMS, MONTHS, PLATFORMS, YEARS } from "@/lib/constants";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useSearchParams, useRouter, useParams } from "next/navigation";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Heart, SlidersHorizontal } from "lucide-react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import Filters from "./filters";
import { useState } from "react";
import { Badge } from "../ui/badge";

const monthLinks = (searchParams: URLSearchParams, params: Record<string, string>) => Object.keys(MONTHS).map((monthInd: string) => {
  const { year } = params;
  const name = MONTHS[parseInt(monthInd)];
  const searchParamsObj = new URLSearchParams(searchParams);
  searchParamsObj.delete('ids');
  searchParamsObj.delete('query');

  if (searchParamsObj.get('platforms') === null) {
    searchParamsObj.set('platforms', DEFAULT_PLATFORMS.join('-'));
  }

  const paramStr = `?${searchParamsObj.toString()}`;
  const fallbackYear = new Date().getFullYear();

  return {
    name,
    path: `/${monthInd}/${year || fallbackYear}`,
    href: `/${monthInd}/${year || fallbackYear}${searchParamsObj.size ? paramStr : ''}`,
  }
});

const yearLinks = (searchParams: URLSearchParams, params: Record<string, string>) => Object.keys(YEARS).map((yearInd: string) => {
  const { month } = params;
  const name = YEARS[parseInt(yearInd)];
  const searchParamsObj = new URLSearchParams(searchParams);
  searchParamsObj.delete('ids');
  searchParamsObj.delete('query');

  if (searchParamsObj.get('platforms') === null) {
    searchParamsObj.set('platforms', DEFAULT_PLATFORMS.join('-'));
  }

  const paramStr = `?${searchParamsObj.toString()}`;
  const now = new Date();
  const fallbackMonth = now.getFullYear() === name ? now.getMonth() : 1;

  return {
    name,
    path: `/${month || fallbackMonth}/${name}`,
    href: `/${month || fallbackMonth}/${name}${searchParamsObj.size ? paramStr : ''}`,
  }
});

export default function SideNav() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams<{ tag: string; item: string }>();
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  const linkToFavoritesPage = () => {
    const searchParamsObj = new URLSearchParams(searchParams);
    const favorites = JSON.parse(localStorage.getItem('favorites') || '') || [];
    searchParamsObj.set('ids', favorites.join('-'));
    router.push(`/favorites?${searchParamsObj.toString()}`);
  };

  const triggerLink = (href: string) => {
    if (href === 'favorites') {
      linkToFavoritesPage();
    } else {
      router.push(href);
    }
  };

  const filtersActive = !['/search', '/favorites'].includes(pathname);
  const activePlatforms = searchParams?.get('platforms');

  return (
    <div className="flex md:h-full flex-col mt-3">
      <div className="lg:sticky lg:top-3">
        <Card>
          <CardContent className="pb-3 pt-6">
            <div>
              {/* Year selector */}
              <Select
                value={filtersActive ? yearLinks(searchParams, params)?.find(link => link.path === pathname)?.href || '' : ''}
                onValueChange={triggerLink}
                name="select year"
              >
                <SelectTrigger className="mb-3 md:mb-6 z-20">
                  <SelectValue placeholder="Select a year" />
                </SelectTrigger>
                <SelectContent>
                  {yearLinks(searchParams, params).map((link) => (
                    <SelectItem key={link.href} value={link.href}>{link.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {/* Desktop month selector */}
              <div className="hidden md:block font-semibold">
                {monthLinks(searchParams, params).map((link) => (
                  <Button
                    key={link.href}
                    variant={ pathname === link.path ? 'default' : 'secondary' }
                    className="mb-3 w-full justify-start text-semibold"
                    asChild
                  >
                    <Link href={link.href} className={cn(
                      {
                        'text-primary-foreground': pathname === link.path
                      }
                      )}>
                      {link.name}
                    </Link>
                  </Button>
                ))}
              </div>
              
              {/* Mobile month select */}
              <div className="w-full flex md:hidden gap-4">
                <Select
                  value={filtersActive ? monthLinks(searchParams, params)?.find(link => link.path === pathname)?.href || '' : ''}
                  onValueChange={triggerLink}
                  name="select-month"
                >
                  <SelectTrigger className="z-20">
                    <SelectValue placeholder="Select a month" />
                  </SelectTrigger>
                  <SelectContent>
                    {monthLinks(searchParams, params).map((link) => (
                      <SelectItem key={link.href} value={link.href}>{link.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Mobile Favorites link */}
            <Button
              className="block md:hidden px-0 py-0 mt-2 flex items-center justify-start z-10"
              variant="link"
              onClick={linkToFavoritesPage}
              animate={false}
            >
              <Heart
                width={16}
                height={16}
                fill="#7541E5"
                color="#7541E5"
                className="mr-2"
              />
              View favorites
            </Button>
          </CardContent>
        </Card>

        {/* Desktop Favorites link */}
        <Card className="mt-3 hidden md:block">
          <CardContent className="py-4">
            <Button
              className="w-full text-left"
              variant="brand"
              onClick={linkToFavoritesPage}
            >
              <Heart
                width={16}
                height={16}
                fill="#FCFFFE"
                color="#FCFFFE"
                className="mr-3"
              />
              View favorites
            </Button>
          </CardContent>
        </Card>

        {/* Mobile Filters */}
        {filtersActive && (
          <Card className="mt-3 block lg:hidden">
            <CardContent className="py-4">
              <div>
                <Popover
                  open={mobileFiltersOpen}
                  onOpenChange={(open) => setMobileFiltersOpen(open)}
                >
                  <PopoverTrigger asChild>
                    <Button variant="link" className="flex items-center p-0 h-auto" animate={false} disabled={!filtersActive}>
                      <SlidersHorizontal size={16} className="mr-2" />
                      Edit Filters
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent align="end" alignOffset={-35} className="p-0">
                    <Filters card={false} onFiltersChange={() => setMobileFiltersOpen(false)} />
                  </PopoverContent>
                </Popover>

                {activePlatforms && activePlatforms.length > 0 ? (
                  <ul className="flex flex-wrap gap-2 mt-2">
                    {searchParams.get('platforms')?.split('-').map((platform: string) => (
                      <li key={platform}>
                        <Badge variant="outline" className="whitespace-nowrap">
                          {PLATFORMS.find(plat => plat.id === Number(platform))?.name}
                        </Badge>
                      </li>
                    ))}
                  </ul>
                ): (
                  <Badge variant="outline" className="whitespace-nowrap mt-2">
                    No platforms active
                  </Badge>
                )}
                </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
