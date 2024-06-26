import { Group, fetchGamesByFavorite, groupByDate } from "@/lib/data";
import ReleaseDateCards from "@/components/dashboard/release-date-cards";
import NoData from "@/components/dashboard/no-data";

interface PageProps {
  params: { month: number; year: string; };
  searchParams: Record<string, string>;
}

export default async function Page({ searchParams }: PageProps) {
  const games = await fetchGamesByFavorite(searchParams?.ids);

  if (!games.length) {
    return (
      <NoData message="You have no favorites. Favorite a game by clicking the heart." />
    );
  };

  const groupedGames: Group = groupByDate(games);

  return (
    <main>
      <ReleaseDateCards groupedGames={groupedGames} />
    </main>
  );
};
