"use client";
import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { IdleGameABI } from "@/constants/IdleGameABI";
import { IDLE_GAME_ADDRESS } from "@/constants/contracts";
import Link from "next/link";
import { parseEther } from "viem";

export default function Home() {
  const { isConnected } = useAccount();
  const [score, setScore] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);

  // Game Loop
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setScore((prev: number) => prev + 1);
      }, 100); // 10 points per second
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Contract Writes
  const { data: hash, writeContract, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash });

  const submitScore = () => {
    writeContract({
      address: IDLE_GAME_ADDRESS as `0x${string}`,
      abi: IdleGameABI,
      functionName: 'submitScore',
      args: [BigInt(score)],
      value: parseEther("0.0001"), // Fee
    });
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24 bg-black text-white">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          VoidLift Idle
        </p>
        <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
          <ConnectButton />
        </div>
      </div>

      <div className="relative flex flex-col place-items-center">
        <h1 className="text-6xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
          {score}
        </h1>
        <p className="mb-8 text-zinc-400">VOID POINTS</p>

        <div className="flex gap-4">
          {!isPlaying ? (
            <button
              onClick={() => setIsPlaying(true)}
              className="px-8 py-4 bg-white text-black font-bold rounded-full hover:bg-gray-200 transition"
            >
              START MINING
            </button>
          ) : (
            <button
              onClick={() => setIsPlaying(false)}
              className="px-8 py-4 bg-zinc-800 text-white font-bold rounded-full border border-zinc-700 hover:bg-zinc-700 transition"
            >
              PAUSE
            </button>
          )}
        </div>

        {isConnected && score > 0 && (
          <div className="mt-8 flex flex-col items-center gap-2">
            <button
              onClick={submitScore}
              disabled={isPending || isConfirming}
              className="px-6 py-2 bg-purple-600 rounded-lg font-semibold hover:bg-purple-500 disabled:opacity-50"
            >
              {isPending ? "Submitting..." : isConfirming ? "Confirming..." : "Submit Score On-Chain"}
            </button>
            <span className="text-xs text-zinc-500">Cost: 0.0001 ETH</span>
            {isConfirmed && <span className="text-green-400">Score Submitted!</span>}
          </div>
        )}
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
        <Link
          href="/leaderboard"
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            Leaderboard{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            See who rules the void.
          </p>
        </Link>
      </div>
    </main>
  );
}
