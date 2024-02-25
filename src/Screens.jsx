import { useState } from "react";
import confetti from "canvas-confetti";
import * as icons from "react-icons/gi";
import { Tile } from "./Tile";

export const possibleTileContents = [
  icons.GiHearts,
  icons.GiWaterDrop,
  icons.GiDiceSixFacesFive,
  icons.GiUmbrella,
  icons.GiCube,
  icons.GiBeachBall,
  icons.GiDragonfly,
  icons.GiHummingbird,
  icons.GiFlowerEmblem,
  icons.GiOpenBook,
];

export function StartScreen({ start }) {
  const [showPlayImage, setShowPlayImage] = useState(false);

  const handlePlayClick = () => {
    setShowPlayImage(true);
  };

  return (
    <div className="py-8 px-8 max-w-sm mx-auto h-[26rem] w-full md:w-400px border space-y-2 m-8  rounded-xl bg-pink-50">
      <div className="space-y-1.5">
        <p className="text-2xl py-5 text-pink-500 text-center font-bold">
          Memory 
        </p>
        <div className="space-y-3.5">
          <p className="text-md py-4 text-pink-400 text-center font-normal">
            Flip over tiles looking for pairs 
          </p>
        <div className="flex justify-center mx-auto">
          <button onClick={start} className="bg-pink-400 py-1 px-8 text-white m-12 border rounded-full">
            Play
          </button>
          </div>
          
        </div>
      </div>
    </div>
  );
}


export function PlayScreen({ end }) {
  const [tiles, setTiles] = useState(null);
  const [tryCount, setTryCount] = useState(0);

  const getTiles = (tileCount) => {
    // Throw error if count is not even.
    if (tileCount % 2 !== 0) {
      throw new Error("The number of tiles must be even.");
    }

    // Use the existing list if it exists.
    if (tiles) return tiles;

    const pairCount = tileCount / 2;

    // Take only the items we need from the list of possibilities.
    const usedTileContents = possibleTileContents.slice(0, pairCount);

    // Double the array and shuffle it.
    const shuffledContents = usedTileContents
      .concat(usedTileContents)
      .sort(() => Math.random() - 0.5)
      .map((content) => ({ content, state: "start" }));

    setTiles(shuffledContents);
    return shuffledContents;
  };

  const flip = (i) => {
    // Is the tile already flipped? We don’t allow flipping it back.
    if (tiles[i].state === "flipped") return;

    // How many tiles are currently flipped?
    const flippedTiles = tiles.filter((tile) => tile.state === "flipped");
    const flippedCount = flippedTiles.length;

    // Don't allow more than 2 tiles to be flipped at once.
    if (flippedCount === 2) return;

    // On the second flip, check if the tiles match.
    if (flippedCount === 1) {
      setTryCount((c) => c + 1);

      const alreadyFlippedTile = flippedTiles[0];
      const justFlippedTile = tiles[i];

      let newState = "start";

      if (alreadyFlippedTile.content === justFlippedTile.content) {
        confetti({
          ticks: 100,
        });
        newState = "matched";
      }

      // After a delay, either flip the tiles back or mark them as matched.
      setTimeout(() => {
        setTiles((prevTiles) => {
          const newTiles = prevTiles.map((tile) => ({
            ...tile,
            state: tile.state === "flipped" ? newState : tile.state,
          }));

          // If all tiles are matched, the game is over.
          if (newTiles.every((tile) => tile.state === "matched")) {
            setTimeout(end, 0);
          }

          return newTiles;
        });
      }, 1000);
    }

    setTiles((prevTiles) => {
      return prevTiles.map((tile, index) => ({
        ...tile,
        state: i === index ? "flipped" : tile.state,
      }));
    });
  };

  return (
    <>
      <div className="flex items-center justify-center h-[26rem] w-full md:w-400px mx-auto px-8 space-y-2 py-8 m-10">
        <div className="border border-gray-100 rounded-xl p-3">
          <div className="grid grid-cols-4 gap-4">
        {getTiles(16).map((tile, i) => (
          <Tile key={i} flip={() => flip(i)} {...tile} />
        ))}
      </div>
      <span className="text-indigo-400 flex center absolute top-12">Tries 
      <p className="border rounded-md mx-2 h-6 w-8 text-center bg-indigo-200">{tryCount}</p></span>
      </div>
      </div>
    </>
  );
}

export function DarkModeToggle() {
  const [isDarkMode, ...setIsDarkMode] = useState(false);

  // function to toggle dark mode 
  const toggleDarkMode = () => {
    setIsDarkMode(prevMode => !prevMode);
  }


return (
  <div className="flex items-center justify-center mt-8">
    <label htmlFor="darkModeToggle" className="flex items-center cursor-pointer">
      <span className="relative"/>
        <input 
        type="checkbox" 
        id="darkModeToggle"
        className="hidden"
        checked={isDarkMode}
        onChange={toggleDarkMode}
        />
        <span className="{`w-10 h-4 bg-gray-400 rounded-full shadow-inner transition duration-300 ease-in-out ${isDarkMode ? 'bg-indigo-600' : 'bg-gray-300'}`"/>
          <span 
          className="{`absolute left-0 inline-block w-6 h-6 bg-blue-300 rounded-full shadow-md transform transition duration-300 ease-in-out ${isDarkMode ? 'translate-x-6' : 'translate-x-0'}`"
          />
         <span className="ml-3 text-gray=700"{...isDarkMode ? 'Dark Mode': 'Light Mode'}></span> 
    </label>
  </div>
);

}