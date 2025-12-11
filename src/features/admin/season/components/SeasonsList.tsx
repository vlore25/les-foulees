import { getSeasons } from "../dal"; 
import SeasonsManager from "./SeasonManager";

export default async function SeasonsList() {
  const seasons = await getSeasons();

  return <SeasonsManager seasons={seasons} />;
}