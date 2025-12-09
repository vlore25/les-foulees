import { getSeasons } from "../dal"; 
import { SeasonManager } from "./SeasonManager"; 

export default async function SeasonsList() {
  const seasons = await getSeasons();

  return <SeasonManager seasons={seasons} />;
}