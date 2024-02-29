import { useState, useEffect } from "react";
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
  const [loading,  setLoading] = useState(false);
 
 
  const handlePlayClick = () => {
    setLoading(true);
    setTimeout(() => {
      start(difficulty);
    }, 5000);
    setShowPlayImage(true); 
  };

  
  return (
   <div className="border space-y-2 m-8 rounded-xl max-w-sm mx-auto px-8 py-8 h-[26rem] w-full md:w-400px bg-pink-50 transition-colors
   duration-300 hover:bg-gray-900">
    <div className="space-y-1.5">
      <p className="text-2xl py-5 text-pink-500 text-center font-bold">
        Memory 
      </p>
      <div className="space-y-3.5">
        <p className="text-md py-4 text-pink-400 text-center font-normal">
          Flip over tiles looking for pairs 
        </p>
        <div className="flex justify-center mx-auto">
          <button onClick={start} className="bg-pink-400 py-1 px-8 text-white m-2 border rounded-full shadow-pink-900 bg-blue hover:bg-pink-500">
            Play
          </button>
        </div>
        <h2 class="text-[#EC4899] text-xl text-center font-[500] hidden -1024:block">For the best experience, please play on a laptop screen</h2>
        <div class="w-full h-[500px] absolute translate-x-[110%] flex flex-col gap-4 items-center justify-center bg-[#FDF3F8] rounded-xl -1024:scale-[0.8] px-3 ">
        <h2 class="difficulty text-4xl font-[600] mb-8 text-[#E4458F] text-center" style="translate: none; rotate: none; scale: none; opacity: 1; transform: translate(0px, 0px);">Select Difficulty</h2>
        <div class="bg-white  modal opacity-0 pointer-events-none rounded w-80 p-4 flex flex-col justify-between z-20 shadow-xl fixed left-[45%] top-[20%] translate-x-[-50%] translate-y-[0%] duration-200">
        <div class="py-4">
          <h2 class="font-bold text-xl">Easy mode</h2>
          <p class="my-2">-Unlimited Lives</p>
          <p class="my-2">-Timer at 2:00</p></div></div>
          <div class="flex gap-4 justify-center items-center w-full difficulty" style="translate: none; rotate: none; scale: none; opacity: 1; transform: translate(0px, 0px);">
            <button class="rounded-lg w-[70%] bg-[#E4458F] text-white p-3 px-6 text-2xl font-[500] play-btn relative">Easy</button>
            <div class="bg-white p-2 px-4 text-2xl rounded-lg font-[700] cursor-pointer">?</div></div>
            <div class="bg-white modal opacity-0 pointer-events-none rounded w-80 p-4 flex flex-col justify-between z-20 shadow-xl fixed left-[45%] top-[20%] translate-x-[-50%] translate-y-[0%] duration-200">
              <div class="py-4">
                <h2 class="font-bold text-xl">Medium mode</h2>
                <p class="my-2">-Limited Lives(10)</p>
                <p class="my-2">-Timer at 1:45</p></div></div>
                <div class="flex gap-4 justify-center items-center w-full difficulty" style="translate: none; rotate: none; scale: none; opacity: 1; transform: translate(0px, 0px);">
                  <button class="rounded-lg w-[70%] bg-[#E4458F] text-white p-3 px-6 text-2xl font-[500] play-btn relative">Medium</button>
                  <div class="bg-white p-2 px-4 text-2xl rounded-lg font-[700] cursor-pointer">?</div></div>
                  <div class="bg-white  modal opacity-0 pointer-events-none rounded w-80 p-4 flex flex-col justify-between z-20 shadow-xl fixed left-[45%] top-[20%] translate-x-[-50%] translate-y-[0%] duration-200">
                    <div class="py-4">
                      <h2 class="font-bold text-xl">Hard mode</h2><p class="my-2">-Limited Lives(6)</p><p class="my-2">-Timer at 1:15</p></div></div>
                      <div class="flex gap-4 justify-center items-center w-full difficulty" style="translate: none; rotate: none; scale: none; opacity: 1; transform: translate(0px, 0px);">
                        <button class="rounded-lg w-[70%] bg-[#E4458F] text-white p-3 px-6 text-2xl font-[500] play-btn relative">Hard</button>
                        <div class="bg-white p-2 px-4 text-2xl rounded-lg font-[700] cursor-pointer">?</div></div></div>
      </div>
    </div>
   </div>
  );
}



export function PlayScreen({ end }) {
  const [tiles, setTiles] = useState(null);
  const [tryCount, setTryCount] = useState(0);
  const [time, setTime] = useState(0);
  

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

 useEffect(() => {
  const timer = setInterval(()=> {
    setTime((prevTime) => prevTime + 1);
  }, 1000);

  return () => clearInterval(timer);
 }, []);

  return (
    <>
      <div className="flex items-center justify-center h-[26rem] w-full md:w-400px mx-auto px-8 space-y-2 py-8 m-10">
        <div className="border border-gray-100 rounded-xl p-3 transition-colors duration-300 ease-in-out hover:bg-black">
          <div className="grid grid-cols-4 gap-4">
        {getTiles(16).map((tile, i) => (
          <Tile key={i} flip={() => flip(i)} {...tile} />
        ))}
      </div> 
      <span className="text-indigo-400 flex center absolute top-12 ml-16">Tries 
      <p className="border rounded-md mx-2 h-6 w-8 text-center bg-indigo-200">{tryCount}</p></span>
      <span className="text-gray-900 flex center absolute bottom bottom-4 ml-16"> 
        <p className="border rounded-md mx-2 h-6 w-16 text-center bg-indigo-200">{formatTime(time)}</p>
      </span>
      </div>
      </div>
    </>
  );
}

// Function to format time in MM:SS Format
function formatTime(seconds){
  const minutes = Math.floor(seconds/60);
  const remainingSeconds = seconds % 60;
  return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
}

