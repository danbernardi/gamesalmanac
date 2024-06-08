'use client';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import type { Game } from '@/lib/types';
import { Group } from "@/lib/data";
import { motion } from "framer-motion";
import { Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function ReleaseDateCards ({ groupedGames }: { groupedGames: Group }): React.ReactNode {
  const [favorites, setFavorites] = useState<number[]>([]);

  useEffect(() => {
    const localStorageFavorites = localStorage?.getItem('favorites');
    const favoritesArr = JSON.parse(localStorageFavorites as string) || [];
    if (
      favoritesArr &&
      JSON.stringify(favoritesArr) !== JSON.stringify(favorites)
    ) {
      setFavorites(favoritesArr);
    }
  }, [favorites]);

  const onFavorite = (gameId: number) => {
    const favoritesArr: number[] = [...favorites];
    if (favoritesArr?.includes(gameId)) {
      favoritesArr.splice(favoritesArr.indexOf(gameId), 1);
    } else {
      favoritesArr.push(gameId);
    }

    localStorage.setItem('favorites', JSON.stringify(favoritesArr));
    setFavorites(favoritesArr);
  };

  return (
    <ul>
      {Object.keys(groupedGames).map((isoDate: string) => {
        const entry = groupedGames[isoDate];
        const date = new Date(isoDate);

        return (
          <motion.li
            key={isoDate}
            initial={{ opacity: 0, y: 100, scale: 0.9 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ type: 'spring', stiffness: 40 }}
            viewport={{ once: true }}
          >
            <Card className="mb-3">
              <CardHeader className="top-0 sticky rounded-tl-lg rounded-tr-lg bg-card border-tl border-tr shadow-sm py-4">
                <CardTitle id={`${date.getMonth()}-${date.getDay()}-${date.getFullYear()}`} className="text-lg">
                  {date.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric', timeZone: 'UTC' })}
                </CardTitle>
              </CardHeader>

              <CardContent>
                {entry.games.map((game: Game) => (
                  <div key={game.id} className="py-4 px-6 w-[calc(100%+3rem)] -ml-6 odd:bg-secondary/40 flex items-center justify-between">
                    <div className="grid grid-cols-[57px,1fr] items-center">
                      <div className="overflow-hidden rounded-sm mr-3 flex-shink-0">
                        {game?.cover?.url ? (
                          <Image
                            width={45}
                            height={45}
                            className="max-w-full"
                            src={`https:${game.cover.url}`}
                            alt={`Cover thumbnail for ${game.name}`}
                            unoptimized
                          />
                        ) : (
                          <div className="h-10 bg-secondary-foreground/20" />
                        )}
                      </div>
                      <div>
                        <strong className="flex items-center">
                          {game.name}
                        </strong>
                        <span className="text-sm text-foreground/75">
                          {game?.platforms?.map(plat => plat?.abbreviation || plat.alternative_name || plat.name).join(', ')}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center">
                      <motion.div
                        className="ml-3"
                        whileHover={ { scale: 0.8 } }
                        whileTap={ { scale: 1.25 } }
                      >
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger>
                              <Heart onClick={() => onFavorite(game.id)} fill={ favorites.includes(game.id) ? 'var(--heart)' : 'transparent' } color={ favorites.includes(game.id) ? 'var(--heart)' : '#BBB' } />
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{`${favorites.includes(game.id) ? 'Remove from' : 'Add to'} favorites`}</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </motion.div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.li>
        )
      })}
    </ul>
  )
};
