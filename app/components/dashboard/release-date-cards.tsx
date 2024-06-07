'use client';

import { CATEGORIES } from "@/lib/constants";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import type { Game } from '@/lib/types';
import { Group } from "@/lib/data";
import { motion } from "framer-motion";
import { Heart } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { useState } from "react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

export default function ReleaseDateCards ({ groupedGames }: { groupedGames: Group }): React.ReactNode {
  const initialFavorites = typeof localStorage !== undefined ? JSON.parse(localStorage?.getItem('favorites') || '') : [];
  const [favoritesState, setFavoritesState] = useState(initialFavorites);

  const onFavorite = (gameId: number) => {
    const favoritesStr: string | null = localStorage?.getItem('favorites') || '';
    const favoritesArr = favoritesStr ? JSON.parse(favoritesStr) : [];

    if (favoritesArr?.includes(gameId)) {
      favoritesArr.splice(favoritesArr.indexOf(gameId), 1);
    } else {
      favoritesArr.push(gameId);
    }

    localStorage?.setItem('favorites', JSON.stringify(favoritesArr));
    setFavoritesState(favoritesArr);
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
            exit={{ opacity: 0, y: -100, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 40 }}
            viewport={{ once: true }}
          >
            <Card className="mb-3">
              <CardHeader className="top-0 sticky rounded-tl-lg rounded-tr-lg bg-card border-tl border-tr shadow-sm">
                <CardTitle id={`${date.getMonth()}-${date.getDay()}-${date.getFullYear()}`}>
                  {date.toLocaleDateString('en', { weekday: 'long', month: 'long', day: 'numeric' })}
                </CardTitle>
              </CardHeader>

              <CardContent>
                {entry.games.map((game: Game) => (
                  <div key={game.id} className="py-4 px-6 w-[calc(100%+3rem)] -ml-6 odd:bg-secondary/40 flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="w-10 overflow-hidden rounded-sm mr-3">
                        {game?.cover?.url ? (
                          <Image
                            width={game.cover.width}
                            height={game.cover.height}
                            src={`https:${game.cover.url}`}
                            alt={`Cover thumbnail for ${game.name}`}
                          />
                        ) : (
                          <div className="w-10 h-10 bg-secondary-foreground/20" />
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
                              <Button onClick={() => onFavorite(game.id)} variant={ favoritesState.includes(game.id) ? 'link' : 'ghost' }>
                                <Heart fill={ favoritesState.includes(game.id) ? 'var(--heart)' : 'transparent' } color={ favoritesState.includes(game.id) ? 'var(--heart)' : '#BBB' } />
                              </Button>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>{`${favoritesState.includes(game.id) ? 'Remove from' : 'Add to'} favorites`}</p>
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
