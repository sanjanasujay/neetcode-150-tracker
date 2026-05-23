import React, { useEffect, useMemo, useState } from "react";
import * as RadixSelect from "@radix-ui/react-select";
import { RotateCcw, CheckCircle2, ExternalLink, CalendarClock, Sparkles, Flame, TimerReset, ChevronDown, Check, Moon, Sun } from "lucide-react";

function useTheme() {
  const [dark, setDark] = useState(() => {
    const stored = localStorage.getItem("theme");
    return stored ? stored === "dark" : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });
  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
    localStorage.setItem("theme", dark ? "dark" : "light");
  }, [dark]);
  return [dark, setDark];
}

function Card({ className = "", children }) {
  return <div className={`bg-white dark:bg-zinc-900 border border-zinc-100 dark:border-zinc-800 ${className}`}>{children}</div>;
}
function CardContent({ className = "", children }) {
  return <div className={className}>{children}</div>;
}
function Button({ onClick, disabled, variant, className = "", children }) {
  const base = "inline-flex items-center justify-center px-4 py-2 text-sm font-medium transition-all focus:outline-none disabled:opacity-40 disabled:pointer-events-none";
  const styles = variant === "outline"
    ? "border border-violet-300 dark:border-violet-700 text-violet-700 dark:text-violet-300 bg-transparent hover:bg-violet-50 dark:hover:bg-violet-950"
    : "bg-gradient-to-r from-violet-600 to-purple-600 text-white hover:from-violet-500 hover:to-purple-500 shadow-md shadow-violet-200 dark:shadow-violet-900";
  return <button onClick={onClick} disabled={disabled} className={`${base} ${styles} ${className}`}>{children}</button>;
}
function DifficultyBadge({ difficulty }) {
  const styles = {
    Easy: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400",
    Medium: "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-400",
    Hard: "bg-rose-100 text-rose-700 dark:bg-rose-900/40 dark:text-rose-400",
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full ${styles[difficulty] ?? ""}`}>{difficulty}</span>;
}
function Badge({ variant, className = "", children }) {
  const styles = variant === "outline"
    ? "border border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-400"
    : variant === "secondary"
    ? "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300"
    : "bg-violet-600 text-white";
  return <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-medium rounded-full ${styles} ${className}`}>{children}</span>;
}
function Progress({ value = 0, className = "" }) {
  return (
    <div className={`w-full bg-zinc-100 dark:bg-zinc-800 rounded-full overflow-hidden ${className}`}>
      <div className="bg-gradient-to-r from-violet-500 to-purple-500 h-full rounded-full transition-all duration-500" style={{ width: `${value}%` }} />
    </div>
  );
}
function Select({ value, onValueChange, children }) {
  return <RadixSelect.Root value={value} onValueChange={onValueChange}>{children}</RadixSelect.Root>;
}
function SelectTrigger({ className = "", children }) {
  return (
    <RadixSelect.Trigger className={`inline-flex items-center justify-between w-full px-3 py-2 text-sm border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 rounded-xl focus:outline-none focus:ring-2 focus:ring-violet-400 ${className}`}>
      {children}
      <RadixSelect.Icon><ChevronDown className="h-4 w-4 opacity-50" /></RadixSelect.Icon>
    </RadixSelect.Trigger>
  );
}
function SelectValue() { return <RadixSelect.Value />; }
function SelectContent({ children }) {
  return (
    <RadixSelect.Portal>
      <RadixSelect.Content className="z-50 bg-white dark:bg-zinc-800 border border-zinc-200 dark:border-zinc-700 rounded-xl shadow-xl overflow-hidden">
        <RadixSelect.Viewport className="p-1">{children}</RadixSelect.Viewport>
      </RadixSelect.Content>
    </RadixSelect.Portal>
  );
}
function SelectItem({ value, children }) {
  return (
    <RadixSelect.Item value={value} className="relative flex items-center px-8 py-2 text-sm text-zinc-800 dark:text-zinc-200 cursor-pointer hover:bg-violet-50 dark:hover:bg-violet-900/30 focus:bg-violet-50 dark:focus:bg-violet-900/30 outline-none rounded-lg">
      <RadixSelect.ItemIndicator className="absolute left-2 text-violet-600"><Check className="h-4 w-4" /></RadixSelect.ItemIndicator>
      <RadixSelect.ItemText>{children}</RadixSelect.ItemText>
    </RadixSelect.Item>
  );
}

const STORAGE_KEY = "neetcode-150-revision-tracker-v2";
const MAX_REVISIONS = 3;
const REVIEW_INTERVAL_DAYS = [0, 3, 7, 14]; // after revision 1 -> 3 days, revision 2 -> 7 days, revision 3 -> complete

const rawProblems = [
  ["Contains Duplicate", "Easy", "Arrays & Hashing"],
  ["Valid Anagram", "Easy", "Arrays & Hashing"],
  ["Two Sum", "Easy", "Arrays & Hashing"],
  ["Group Anagrams", "Medium", "Arrays & Hashing"],
  ["Top K Frequent Elements", "Medium", "Arrays & Hashing"],
  ["Product of Array Except Self", "Medium", "Arrays & Hashing"],
  ["Valid Sudoku", "Medium", "Arrays & Hashing"],
  ["Encode and Decode Strings", "Medium", "Arrays & Hashing"],
  ["Longest Consecutive Sequence", "Medium", "Arrays & Hashing"],

  ["Valid Palindrome", "Easy", "Two Pointers"],
  ["Two Sum II - Input Array Is Sorted", "Medium", "Two Pointers"],
  ["3Sum", "Medium", "Two Pointers"],
  ["Container With Most Water", "Medium", "Two Pointers"],
  ["Trapping Rain Water", "Hard", "Two Pointers"],

  ["Best Time to Buy and Sell Stock", "Easy", "Sliding Window"],
  ["Longest Substring Without Repeating Characters", "Medium", "Sliding Window"],
  ["Longest Repeating Character Replacement", "Medium", "Sliding Window"],
  ["Permutation in String", "Medium", "Sliding Window"],
  ["Minimum Window Substring", "Hard", "Sliding Window"],
  ["Sliding Window Maximum", "Hard", "Sliding Window"],

  ["Valid Parentheses", "Easy", "Stack"],
  ["Min Stack", "Medium", "Stack"],
  ["Evaluate Reverse Polish Notation", "Medium", "Stack"],
  ["Generate Parentheses", "Medium", "Stack"],
  ["Daily Temperatures", "Medium", "Stack"],
  ["Car Fleet", "Medium", "Stack"],
  ["Largest Rectangle in Histogram", "Hard", "Stack"],

  ["Binary Search", "Easy", "Binary Search"],
  ["Search a 2D Matrix", "Medium", "Binary Search"],
  ["Koko Eating Bananas", "Medium", "Binary Search"],
  ["Find Minimum in Rotated Sorted Array", "Medium", "Binary Search"],
  ["Search in Rotated Sorted Array", "Medium", "Binary Search"],
  ["Time Based Key-Value Store", "Medium", "Binary Search"],
  ["Median of Two Sorted Arrays", "Hard", "Binary Search"],

  ["Reverse Linked List", "Easy", "Linked List"],
  ["Merge Two Sorted Lists", "Easy", "Linked List"],
  ["Linked List Cycle", "Easy", "Linked List"],
  ["Reorder List", "Medium", "Linked List"],
  ["Remove Nth Node From End of List", "Medium", "Linked List"],
  ["Copy List with Random Pointer", "Medium", "Linked List"],
  ["Add Two Numbers", "Medium", "Linked List"],
  ["Find the Duplicate Number", "Medium", "Linked List"],
  ["LRU Cache", "Medium", "Linked List"],
  ["Merge k Sorted Lists", "Hard", "Linked List"],
  ["Reverse Nodes in k-Group", "Hard", "Linked List"],

  ["Invert Binary Tree", "Easy", "Trees"],
  ["Maximum Depth of Binary Tree", "Easy", "Trees"],
  ["Diameter of Binary Tree", "Easy", "Trees"],
  ["Balanced Binary Tree", "Easy", "Trees"],
  ["Same Tree", "Easy", "Trees"],
  ["Subtree of Another Tree", "Easy", "Trees"],
  ["Lowest Common Ancestor of a Binary Search Tree", "Medium", "Trees"],
  ["Binary Tree Level Order Traversal", "Medium", "Trees"],
  ["Binary Tree Right Side View", "Medium", "Trees"],
  ["Count Good Nodes in Binary Tree", "Medium", "Trees"],
  ["Validate Binary Search Tree", "Medium", "Trees"],
  ["Kth Smallest Element in a BST", "Medium", "Trees"],
  ["Construct Binary Tree from Preorder and Inorder Traversal", "Medium", "Trees"],
  ["Binary Tree Maximum Path Sum", "Hard", "Trees"],
  ["Serialize and Deserialize Binary Tree", "Hard", "Trees"],

  ["Kth Largest Element in a Stream", "Easy", "Heap / Priority Queue"],
  ["Last Stone Weight", "Easy", "Heap / Priority Queue"],
  ["K Closest Points to Origin", "Medium", "Heap / Priority Queue"],
  ["Kth Largest Element in an Array", "Medium", "Heap / Priority Queue"],
  ["Task Scheduler", "Medium", "Heap / Priority Queue"],
  ["Design Twitter", "Medium", "Heap / Priority Queue"],
  ["Find Median from Data Stream", "Hard", "Heap / Priority Queue"],

  ["Subsets", "Medium", "Backtracking"],
  ["Combination Sum", "Medium", "Backtracking"],
  ["Permutations", "Medium", "Backtracking"],
  ["Subsets II", "Medium", "Backtracking"],
  ["Combination Sum II", "Medium", "Backtracking"],
  ["Word Search", "Medium", "Backtracking"],
  ["Palindrome Partitioning", "Medium", "Backtracking"],
  ["Letter Combinations of a Phone Number", "Medium", "Backtracking"],
  ["N-Queens", "Hard", "Backtracking"],

  ["Implement Trie (Prefix Tree)", "Medium", "Tries"],
  ["Design Add and Search Words Data Structure", "Medium", "Tries"],
  ["Word Search II", "Hard", "Tries"],

  ["Number of Islands", "Medium", "Graphs"],
  ["Clone Graph", "Medium", "Graphs"],
  ["Max Area of Island", "Medium", "Graphs"],
  ["Pacific Atlantic Water Flow", "Medium", "Graphs"],
  ["Surrounded Regions", "Medium", "Graphs"],
  ["Rotting Oranges", "Medium", "Graphs"],
  ["Walls and Gates", "Medium", "Graphs"],
  ["Course Schedule", "Medium", "Graphs"],
  ["Course Schedule II", "Medium", "Graphs"],
  ["Redundant Connection", "Medium", "Graphs"],
  ["Number of Connected Components in an Undirected Graph", "Medium", "Graphs"],
  ["Graph Valid Tree", "Medium", "Graphs"],
  ["Word Ladder", "Hard", "Graphs"],

  ["Reconstruct Itinerary", "Hard", "Advanced Graphs"],
  ["Min Cost to Connect All Points", "Medium", "Advanced Graphs"],
  ["Network Delay Time", "Medium", "Advanced Graphs"],
  ["Swim in Rising Water", "Hard", "Advanced Graphs"],
  ["Alien Dictionary", "Hard", "Advanced Graphs"],
  ["Cheapest Flights Within K Stops", "Medium", "Advanced Graphs"],

  ["Climbing Stairs", "Easy", "1-D Dynamic Programming"],
  ["Min Cost Climbing Stairs", "Easy", "1-D Dynamic Programming"],
  ["House Robber", "Medium", "1-D Dynamic Programming"],
  ["House Robber II", "Medium", "1-D Dynamic Programming"],
  ["Longest Palindromic Substring", "Medium", "1-D Dynamic Programming"],
  ["Palindromic Substrings", "Medium", "1-D Dynamic Programming"],
  ["Decode Ways", "Medium", "1-D Dynamic Programming"],
  ["Coin Change", "Medium", "1-D Dynamic Programming"],
  ["Maximum Product Subarray", "Medium", "1-D Dynamic Programming"],
  ["Word Break", "Medium", "1-D Dynamic Programming"],
  ["Longest Increasing Subsequence", "Medium", "1-D Dynamic Programming"],
  ["Partition Equal Subset Sum", "Medium", "1-D Dynamic Programming"],

  ["Unique Paths", "Medium", "2-D Dynamic Programming"],
  ["Longest Common Subsequence", "Medium", "2-D Dynamic Programming"],
  ["Best Time to Buy and Sell Stock with Cooldown", "Medium", "2-D Dynamic Programming"],
  ["Coin Change II", "Medium", "2-D Dynamic Programming"],
  ["Target Sum", "Medium", "2-D Dynamic Programming"],
  ["Interleaving String", "Medium", "2-D Dynamic Programming"],
  ["Longest Increasing Path in a Matrix", "Hard", "2-D Dynamic Programming"],
  ["Distinct Subsequences", "Hard", "2-D Dynamic Programming"],
  ["Edit Distance", "Medium", "2-D Dynamic Programming"],
  ["Burst Balloons", "Hard", "2-D Dynamic Programming"],
  ["Regular Expression Matching", "Hard", "2-D Dynamic Programming"],

  ["Maximum Subarray", "Medium", "Greedy"],
  ["Jump Game", "Medium", "Greedy"],
  ["Jump Game II", "Medium", "Greedy"],
  ["Gas Station", "Medium", "Greedy"],
  ["Hand of Straights", "Medium", "Greedy"],
  ["Merge Triplets to Form Target Triplet", "Medium", "Greedy"],
  ["Partition Labels", "Medium", "Greedy"],
  ["Valid Parenthesis String", "Medium", "Greedy"],

  ["Insert Interval", "Medium", "Intervals"],
  ["Merge Intervals", "Medium", "Intervals"],
  ["Non-overlapping Intervals", "Medium", "Intervals"],
  ["Meeting Rooms", "Easy", "Intervals"],
  ["Meeting Rooms II", "Medium", "Intervals"],
  ["Minimum Interval to Include Each Query", "Hard", "Intervals"],

  ["Rotate Image", "Medium", "Math & Geometry"],
  ["Spiral Matrix", "Medium", "Math & Geometry"],
  ["Set Matrix Zeroes", "Medium", "Math & Geometry"],
  ["Happy Number", "Easy", "Math & Geometry"],
  ["Plus One", "Easy", "Math & Geometry"],
  ["Pow(x, n)", "Medium", "Math & Geometry"],
  ["Multiply Strings", "Medium", "Math & Geometry"],
  ["Detect Squares", "Medium", "Math & Geometry"],

  ["Single Number", "Easy", "Bit Manipulation"],
  ["Number of 1 Bits", "Easy", "Bit Manipulation"],
  ["Counting Bits", "Easy", "Bit Manipulation"],
  ["Reverse Bits", "Easy", "Bit Manipulation"],
  ["Missing Number", "Easy", "Bit Manipulation"],
  ["Sum of Two Integers", "Medium", "Bit Manipulation"],
  ["Reverse Integer", "Medium", "Bit Manipulation"],
];

const slugOverrides = {
  "3Sum": "3sum",
  "Encode and Decode Strings": "encode-and-decode-strings",
  "Two Sum II - Input Array Is Sorted": "two-sum-ii-input-array-is-sorted",
  "Kth Largest Element in a Stream": "kth-largest-element-in-a-stream",
  "Implement Trie (Prefix Tree)": "implement-trie-prefix-tree",
  "Design Add and Search Words Data Structure": "design-add-and-search-words-data-structure",
  "Number of Connected Components in an Undirected Graph": "number-of-connected-components-in-an-undirected-graph",
  "Graph Valid Tree": "graph-valid-tree",
  "Alien Dictionary": "alien-dictionary",
  "Meeting Rooms": "meeting-rooms",
  "Meeting Rooms II": "meeting-rooms-ii",
  "Pow(x, n)": "powx-n",
  "Number of 1 Bits": "number-of-1-bits",
};

function slugify(title) {
  return (slugOverrides[title] ?? title)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

const PROBLEMS = rawProblems.map(([title, difficulty, category], index) => ({
  id: index + 1,
  title,
  difficulty,
  category,
  tags: [category, difficulty],
  slug: slugify(title),
}));

function todayKey(date = new Date()) {
  return date.toISOString().slice(0, 10);
}

function addDays(date, days) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function emptyProblemProgress() {
  return Object.fromEntries(
    PROBLEMS.map((p) => [
      p.id,
      {
        revisionCount: 0,
        history: [],
        lastRevisedAt: null,
        nextDueAt: null,
      },
    ])
  );
}

function emptyProgress() {
  return {
    problems: emptyProblemProgress(),
    meta: {
      completionDates: [],
    },
  };
}

function normalizeProgress(stored) {
  const blank = emptyProgress();
  if (!stored) return blank;

  if (!stored.problems) {
    return {
      problems: { ...blank.problems, ...stored },
      meta: blank.meta,
    };
  }

  return {
    problems: { ...blank.problems, ...stored.problems },
    meta: {
      ...blank.meta,
      ...stored.meta,
      completionDates: Array.from(new Set(stored.meta?.completionDates ?? [])),
    },
  };
}

function loadProgress() {
  try {
    return normalizeProgress(JSON.parse(localStorage.getItem(STORAGE_KEY)));
  } catch {
    return emptyProgress();
  }
}

function formatDateTime(value) {
  if (!value) return "Not revised yet";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function formatDate(value) {
  if (!value) return "Available now";
  return new Intl.DateTimeFormat(undefined, { dateStyle: "medium" }).format(new Date(value));
}

function pickRandom(items, count) {
  return [...items].sort(() => Math.random() - 0.5).slice(0, count);
}

function isDue(item) {
  if (!item || item.revisionCount === 0) return false;
  if (item.revisionCount >= MAX_REVISIONS) return false;
  if (!item.nextDueAt) return true;
  return new Date(item.nextDueAt) <= new Date();
}

function generateSet(progress, filters = { category: "all", difficulty: "all" }) {
  const problemProgress = progress.problems;
  const pool = PROBLEMS.filter((p) => {
    const categoryMatch = filters.category === "all" || p.category === filters.category;
    const difficultyMatch = filters.difficulty === "all" || p.difficulty === filters.difficulty;
    return categoryMatch && difficultyMatch;
  });

  const newProblems = pool.filter((p) => problemProgress[p.id]?.revisionCount === 0);
  const dueOldProblems = pool.filter((p) => isDue(problemProgress[p.id]));
  const anyOldProblems = pool.filter((p) => {
    const count = problemProgress[p.id]?.revisionCount ?? 0;
    return count > 0 && count < MAX_REVISIONS;
  });

  const selectedNew = pickRandom(newProblems, 2);
  const selectedOld = pickRandom(dueOldProblems.length ? dueOldProblems : anyOldProblems, 1);

  const used = new Set([...selectedNew, ...selectedOld].map((p) => p.id));
  const fallback = pickRandom(pool.filter((p) => !used.has(p.id) && (problemProgress[p.id]?.revisionCount ?? 0) < MAX_REVISIONS), 3 - used.size);

  return [...selectedNew, ...selectedOld, ...fallback];
}

function calculateStreak(completionDates) {
  const dates = new Set(completionDates);
  let streak = 0;
  let cursor = new Date();

  while (dates.has(todayKey(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }

  if (streak === 0) {
    cursor.setDate(cursor.getDate() - 1);
    while (dates.has(todayKey(cursor))) {
      streak += 1;
      cursor.setDate(cursor.getDate() - 1);
    }
  }

  return streak;
}

export default function NeetCodeRevisionTracker() {
  const [progress, setProgress] = useState(loadProgress);
  const [filters, setFilters] = useState({ category: "all", difficulty: "all" });
  const [todaySet, setTodaySet] = useState(() => generateSet(loadProgress()));
  const [dark, setDark] = useTheme();

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  }, [progress]);

  const categories = useMemo(() => ["all", ...Array.from(new Set(PROBLEMS.map((p) => p.category)))], []);
  const difficulties = ["all", "Easy", "Medium", "Hard"];

  const stats = useMemo(() => {
    const totalSlots = PROBLEMS.length * MAX_REVISIONS;
    const completedSlots = PROBLEMS.reduce((sum, p) => sum + Math.min(progress.problems[p.id]?.revisionCount ?? 0, MAX_REVISIONS), 0);
    const fullyDone = PROBLEMS.filter((p) => (progress.problems[p.id]?.revisionCount ?? 0) >= MAX_REVISIONS).length;
    const dueCount = PROBLEMS.filter((p) => isDue(progress.problems[p.id])).length;
    const streak = calculateStreak(progress.meta.completionDates);

    return {
      completedSlots,
      totalSlots,
      fullyDone,
      dueCount,
      streak,
      percentage: Math.round((completedSlots / totalSlots) * 100),
    };
  }, [progress]);

  function markRevised(problemId) {
    setProgress((current) => {
      const item = current.problems[problemId] ?? { revisionCount: 0, history: [], lastRevisedAt: null, nextDueAt: null };
      if (item.revisionCount >= MAX_REVISIONS) return current;

      const now = new Date();
      const nextRevisionCount = item.revisionCount + 1;
      const nextDueAt = nextRevisionCount >= MAX_REVISIONS ? null : addDays(now, REVIEW_INTERVAL_DAYS[nextRevisionCount]).toISOString();
      const date = todayKey(now);

      return {
        problems: {
          ...current.problems,
          [problemId]: {
            revisionCount: nextRevisionCount,
            lastRevisedAt: now.toISOString(),
            nextDueAt,
            history: [
              ...item.history,
              {
                attempt: nextRevisionCount,
                revisedAt: now.toISOString(),
                nextDueAt,
              },
            ],
          },
        },
        meta: {
          ...current.meta,
          completionDates: Array.from(new Set([...(current.meta.completionDates ?? []), date])).sort(),
        },
      };
    });
  }

  function resetAll() {
    const fresh = emptyProgress();
    setProgress(fresh);
    setTodaySet(generateSet(fresh));
  }

  function regenerate() {
    setTodaySet(generateSet(progress));
  }

  function updateFilter(key, value) {
    setFilters((prev) => ({ ...prev, [key]: value }));
  }

  const filteredProblems = useMemo(() => {
    return PROBLEMS.filter((p) => {
      const categoryMatch = filters.category === "all" || p.category === filters.category;
      const difficultyMatch = filters.difficulty === "all" || p.difficulty === filters.difficulty;
      return categoryMatch && difficultyMatch;
    });
  }, [filters]);

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 p-4 md:p-6 text-zinc-900 dark:text-zinc-100 transition-colors">
      <div className="mx-auto max-w-7xl space-y-6">

        {/* Header */}
        <header className="flex flex-col gap-4 rounded-2xl bg-gradient-to-br from-violet-600 via-purple-600 to-fuchsia-600 p-6 shadow-lg shadow-violet-200 dark:shadow-violet-950 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm font-medium text-violet-200">
              <Sparkles className="h-4 w-4" /> NeetCode 150 revision system
            </div>
            <h1 className="text-3xl font-bold tracking-tight text-white">2 new + 1 spaced-review problem</h1>
            <p className="mt-2 max-w-2xl text-violet-200 text-sm">
              Randomly generate problems, revise each one 3 times, track timestamps, maintain a streak, and use due dates for spaced repetition.
            </p>
          </div>
          <div className="flex flex-wrap gap-2 items-center">
            <button onClick={() => setDark(d => !d)} className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors">
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
            <Button onClick={regenerate} className="rounded-xl">✨ Generate random set</Button>
            <Button variant="outline" onClick={resetAll} className="rounded-xl !border-white/30 !text-white hover:!bg-white/10">
              <RotateCcw className="mr-2 h-4 w-4" /> Reset
            </Button>
          </div>
        </header>

        {/* Today's set */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-zinc-700 dark:text-zinc-300">Today&apos;s random set</h2>
          <div className="grid gap-4 md:grid-cols-3">
            {todaySet.map((problem) => {
              const item = progress.problems[problem.id] ?? { revisionCount: 0, history: [], lastRevisedAt: null, nextDueAt: null };
              const nextAttempt = Math.min(item.revisionCount + 1, MAX_REVISIONS);
              const isDone = item.revisionCount >= MAX_REVISIONS;
              const link = `https://leetcode.com/problems/${problem.slug}/`;
              return (
                <Card key={problem.id} className="rounded-2xl shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="flex h-full flex-col gap-4 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="mb-2 flex flex-wrap gap-2">
                          <Badge variant="secondary" className="rounded-full">{problem.category}</Badge>
                          <DifficultyBadge difficulty={problem.difficulty} />
                        </div>
                        <h3 className="text-base font-bold leading-tight text-zinc-900 dark:text-zinc-100">{problem.title}</h3>
                      </div>
                      <span className="shrink-0 text-xs font-semibold text-violet-500 dark:text-violet-400 bg-violet-50 dark:bg-violet-900/30 px-2 py-1 rounded-full">
                        {isDone ? "✓ Done" : `Rev ${nextAttempt}/3`}
                      </span>
                    </div>
                    <div className="space-y-1.5 rounded-xl bg-zinc-50 dark:bg-zinc-800 p-3 text-xs text-zinc-500 dark:text-zinc-400">
                      <div className="flex items-center gap-2"><CalendarClock className="h-3.5 w-3.5 text-violet-400" /> Last: {formatDateTime(item.lastRevisedAt)}</div>
                      <div className="flex items-center gap-2"><TimerReset className="h-3.5 w-3.5 text-fuchsia-400" /> Due: {isDone ? "Complete 🎉" : formatDate(item.nextDueAt)}</div>
                    </div>
                    <div className="mt-auto flex flex-col gap-2">
                      <a href={link} target="_blank" rel="noreferrer">
                        <Button variant="outline" className="w-full rounded-xl text-xs">Open LeetCode <ExternalLink className="ml-1.5 h-3.5 w-3.5" /></Button>
                      </a>
                      <Button onClick={() => markRevised(problem.id)} disabled={isDone} className="w-full rounded-xl text-xs">
                        <CheckCircle2 className="mr-1.5 h-3.5 w-3.5" />
                        {isDone ? "Completed 3 revisions" : `Mark revision ${nextAttempt} done`}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </section>

        {/* Stats */}
        <div className="grid gap-4 md:grid-cols-4">
          <Card className="rounded-2xl shadow-sm md:col-span-2">
            <CardContent className="p-5">
              <div className="mb-3 flex items-center justify-between">
                <div>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Overall progress</p>
                  <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stats.completedSlots}<span className="text-sm font-normal text-zinc-400">/{stats.totalSlots}</span></p>
                </div>
                <span className="text-xs font-semibold bg-emerald-100 dark:bg-emerald-900/40 text-emerald-700 dark:text-emerald-400 px-3 py-1 rounded-full">{stats.fullyDone}/150 done</span>
              </div>
              <Progress value={stats.percentage} className="h-2.5" />
              <p className="mt-2 text-xs text-zinc-400">{stats.percentage}% toward completing all 3 rounds</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardContent className="flex h-full items-center gap-4 p-5">
              <div className="p-2.5 rounded-xl bg-orange-100 dark:bg-orange-900/30">
                <Flame className="h-6 w-6 text-orange-500" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Streak</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stats.streak}<span className="text-sm font-normal text-zinc-400"> day{stats.streak === 1 ? "" : "s"}</span></p>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-sm">
            <CardContent className="flex h-full items-center gap-4 p-5">
              <div className="p-2.5 rounded-xl bg-sky-100 dark:bg-sky-900/30">
                <TimerReset className="h-6 w-6 text-sky-500" />
              </div>
              <div>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">Due for review</p>
                <p className="text-2xl font-bold text-zinc-900 dark:text-zinc-100">{stats.dueCount}</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card className="rounded-2xl shadow-sm">
          <CardContent className="grid gap-4 p-5 md:grid-cols-2">
            <div>
              <p className="mb-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Category</p>
              <Select value={filters.category} onValueChange={(value) => updateFilter("category", value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {categories.map((c) => <SelectItem key={c} value={c}>{c === "all" ? "All categories" : c}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
            <div>
              <p className="mb-2 text-xs font-semibold text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">Difficulty</p>
              <Select value={filters.difficulty} onValueChange={(value) => updateFilter("difficulty", value)}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {difficulties.map((d) => <SelectItem key={d} value={d}>{d === "all" ? "All difficulties" : d}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Problems table */}
        <section>
          <h2 className="mb-3 text-lg font-semibold text-zinc-700 dark:text-zinc-300">All {filteredProblems.length} problems</h2>
          <div className="overflow-hidden rounded-2xl border border-zinc-100 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-sm">
            <table className="w-full text-left text-sm">
              <thead className="bg-zinc-50 dark:bg-zinc-800/60 text-xs text-zinc-500 dark:text-zinc-400 uppercase tracking-wide">
                <tr>
                  <th className="px-4 py-3">#</th>
                  <th className="px-4 py-3">Problem</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Difficulty</th>
                  <th className="px-4 py-3">Revision</th>
                  <th className="px-4 py-3">Last revised</th>
                  <th className="px-4 py-3">Next due</th>
                  <th className="px-4 py-3">Link</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100 dark:divide-zinc-800">
                {filteredProblems.map((problem) => {
                  const item = progress.problems[problem.id] ?? { revisionCount: 0, history: [], lastRevisedAt: null, nextDueAt: null };
                  const done = item.revisionCount >= MAX_REVISIONS;
                  return (
                    <tr key={problem.id} className={`transition-colors hover:bg-zinc-50 dark:hover:bg-zinc-800/50 ${done ? "opacity-60" : ""}`}>
                      <td className="px-4 py-3 text-zinc-400 text-xs">{problem.id}</td>
                      <td className="px-4 py-3 font-medium text-zinc-900 dark:text-zinc-100">{problem.title}</td>
                      <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400 text-xs">{problem.category}</td>
                      <td className="px-4 py-3"><DifficultyBadge difficulty={problem.difficulty} /></td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                          done ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-400"
                               : item.revisionCount > 0 ? "bg-violet-100 text-violet-700 dark:bg-violet-900/40 dark:text-violet-300"
                               : "bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400"
                        }`}>{item.revisionCount}/3</span>
                      </td>
                      <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400 text-xs">{formatDateTime(item.lastRevisedAt)}</td>
                      <td className="px-4 py-3 text-zinc-500 dark:text-zinc-400 text-xs">{done ? "Complete 🎉" : formatDate(item.nextDueAt)}</td>
                      <td className="px-4 py-3">
                        <a className="text-violet-600 dark:text-violet-400 hover:underline font-medium text-xs" href={`https://leetcode.com/problems/${problem.slug}/`} target="_blank" rel="noreferrer">LeetCode ↗</a>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
