"use client";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useReadContract } from "wagmi";
import { IdleGameABI } from "@/constants/IdleGameABI";
import { IDLE_GAME_ADDRESS } from "@/constants/contracts";
import Link from "next/link";

export default function Leaderboard() {
    const { data: leaderboardData, isLoading } = useReadContract({
        address: IDLE_GAME_ADDRESS as `0x${string}`,
        abi: IdleGameABI,
        functionName: "getLeaderboard",
    });

    const [addresses, scores] = (leaderboardData as [string[], bigint[]]) || [[], []];

    // Combine and sort
    const data = addresses.map((addr, index) => ({
        address: addr,
        score: scores[index]
    })).sort((a, b) => Number(b.score - a.score));

    return (
        <main className="flex min-h-screen flex-col items-center p-24 bg-black text-white">
            <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex mb-12">
                <Link href="/" className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30 hover:bg-gray-300 transition">
                    Back to Game
                </Link>
                <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
                    <ConnectButton />
                </div>
            </div>

            <h1 className="text-4xl font-bold mb-8">LEADERBOARD</h1>

            <div className="w-full max-w-2xl bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-zinc-800 text-zinc-400">
                        <tr>
                            <th className="p-4 text-left">Rank</th>
                            <th className="p-4 text-left">Player</th>
                            <th className="p-4 text-right">Score</th>
                        </tr>
                    </thead>
                    <tbody>
                        {isLoading ? (
                            <tr><td colSpan={3} className="p-8 text-center text-zinc-500">Loading...</td></tr>
                        ) : data.length === 0 ? (
                            <tr><td colSpan={3} className="p-8 text-center text-zinc-500">No scores yet.</td></tr>
                        ) : (
                            data.map((item, index) => (
                                <tr key={item.address} className="border-t border-zinc-800 hover:bg-zinc-800/50">
                                    <td className="p-4 text-zinc-500">#{index + 1}</td>
                                    <td className="p-4 font-mono">{item.address.slice(0, 6)}...{item.address.slice(-4)}</td>
                                    <td className="p-4 text-right font-bold text-purple-400">{item.score.toString()}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    );
}
