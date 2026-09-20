/* ---------------------------------------------------------------------------
   Per-chapter "Tips & tricks" content, injected by tools/add-tips.js.

   Keyed by chapter number. Each tip is [kind, label, html]:
     kind   'trick'  a technique or shortcut            (teal)
            'gotcha' a trap that produces a wrong answer (red)
            'speed'  a performance or typing shortcut    (amber)
     label  short mono tag shown on the left
     html   one or two sentences; inline HTML allowed

   These are meant to be things you would not get from the prose: the muscle
   memory, the thing you check first, the line that is always wrong the first
   time. Keep them concrete.
   --------------------------------------------------------------------------- */

module.exports = {
  1: [
    ['trick', 'FIRST MOVE', 'Before anything else, write the <b>state sentence</b> or the <b>invariant</b> in one line of English. If you cannot finish that sentence, you do not yet have a solution — and no amount of typing will produce one.'],
    ['trick', 'BUDGET', 'Read the constraint, divide 10⁸ by it, and you have your allowed complexity <i>before</i> you pick a technique. n = 10⁵ buys you a log factor; n = 20 buys you 2ⁿ.'],
    ['gotcha', 'GLOBALS', 'A global <code>ans</code> works once and then silently breaks on the second call, which is exactly what judges that reuse a process will do. Driver owns the state, helper takes it by reference.'],
  ],
  2: [
    ['trick', 'DROP CONSTANTS', 'O(3n + 5) is O(n), but <b>never</b> drop the constant when comparing two solutions of the same class — a 4n pass and an n pass both being "linear" is how you lose a factor of four you needed.'],
    ['trick', 'MEMORY FIRST', 'Multiply the table out before you allocate: <code>int dp[5000][5000]</code> is 100 MB and will not fit. Memory, not time, is what usually kills a DP.'],
    ['speed', 'HARMONIC', 'A loop that steps by <code>i</code> inside a loop over <code>i</code> is O(n log n), not O(n²) — the harmonic sum. Worth recognising so you do not over-optimise something already fast enough.'],
  ],
  3: [
    ['trick', 'READ/WRITE', 'Every in-place filter is one pattern: a <code>read</code> pointer that always advances and a <code>write</code> pointer that advances only on a keeper. Remove-element, move-zeroes and dedupe are the same four lines.'],
    ['trick', 'THREE REVERSES', 'Rotating by <code>k</code> in O(1) space is reverse-all, reverse-first-k, reverse-rest. The same trick rotates a matrix: transpose, then reverse each row.'],
    ['gotcha', 'INDEX AS HASH', 'When a problem says values are in <code>[1..n]</code> and demands O(1) space, the array <i>is</i> your hash table — but mark by negating or swapping, and remember you have destroyed the input.'],
  ],
  4: [
    ['trick', 'SORTED ⇒ POINTERS', 'The moment the input is sorted and you want a pair, two pointers from the ends is almost always the answer: too small means move left up, too big means move right down.'],
    ['gotcha', 'DUPLICATE SKIP', 'In 3-sum the skip goes in <b>two</b> places — the outer loop and after a found triplet. Forget either and you emit duplicates; the failing test is always an array of equal values.'],
    ['trick', 'FAST/SLOW', 'Two pointers at different speeds finds the middle, detects a cycle, and locates the cycle entry. Same three lines, three problems.'],
  ],
  5: [
    ['trick', 'GROW THEN SHRINK', 'Always structure it as: extend <code>right</code> unconditionally, then <code>while</code> the window is invalid move <code>left</code>. An <code>if</code> instead of a <code>while</code> is the bug that passes the sample and fails the rest.'],
    ['trick', 'EXACTLY K', '"Exactly K distinct" has no direct window. Compute <code>atMost(K) − atMost(K−1)</code> — two runs of the same helper, and the subtraction does the work.'],
    ['gotcha', 'NEGATIVES', 'A sliding window needs the constraint to be monotone as the window grows. With negative numbers the sum is not monotone, so the window silently fails — that is a prefix-sum-plus-deque problem instead.'],
  ],
  6: [
    ['trick', 'SEEN[0] = 1', 'For "subarray summing to k" seed the map with <code>{0: 1}</code> before the loop. That single entry is what lets a prefix that <i>is</i> the answer be counted.'],
    ['trick', 'MAP 0 TO −1', 'Equal counts of two symbols becomes "sum equals zero" the moment you map one to +1 and the other to −1. Works for 0s/1s, and for any balanced-pair problem.'],
    ['speed', 'DIFFERENCE ARRAY', 'For q range-updates and one final read, do not touch the range: add at <code>l</code>, subtract at <code>r+1</code>, then prefix-sum once at the end. O(q + n) instead of O(q·n).'],
  ],
  7: [
    ['trick', 'ONE TEMPLATE', 'Use <code>while(low&lt;high)</code>, <code>high=mid</code> on success, <code>low=mid+1</code> otherwise, return <code>low</code>. It finds the first true in a monotone predicate and has no final comparison to get wrong.'],
    ['trick', 'ON THE ANSWER', '"Minimise the maximum" or "maximise the minimum" with a huge answer range means binary-search the <i>answer</i>, with an O(n) feasibility check. Verify monotonicity out loud before you code it.'],
    ['gotcha', 'MIDPOINT', 'Write <code>low + (high-low)/2</code>. <code>(low+high)/2</code> overflows once the bounds approach <code>INT_MAX</code>, which is exactly where binary-search-on-answer lives.'],
  ],
  8: [
    ['trick', 'SORT KEY FIRST', 'Put the value you sort by first in the pair or tuple, then the default lexicographic comparison is already correct and you need no comparator at all.'],
    ['gotcha', 'STRICT WEAK', 'A comparator must return false for equal elements. <code>return a&lt;=b</code> is undefined behaviour in <code>std::sort</code> and really does crash on large inputs.'],
    ['trick', 'MERGE COUNTS', 'Anything of the form "count pairs out of order" is merge sort with a counter in the merge step. Inversions, reverse pairs and count-of-smaller are one algorithm.'],
  ],
  9: [
    ['trick', 'COMPLEMENT', 'For two-sum, look up <code>target − x</code> <i>before</i> inserting <code>x</code>. That ordering is what stops an element pairing with itself, and it removes the need for a second pass.'],
    ['trick', 'COUNT-STRING KEY', 'For grouping anagrams, a 26-length count string is an O(L) key against O(L log L) for sorting. Same grouping, better complexity, and it generalises to larger alphabets.'],
    ['gotcha', 'ITERATION ORDER', 'Never rely on the order of an <code>unordered_map</code>. It varies between runs and compilers, and a test that depends on it will pass locally and fail on the judge.'],
  ],
  10: [
    ['trick', 'EXPAND CENTRES', 'For palindromic substrings, loop over <code>2n−1</code> centres and expand. O(n²) time, O(1) space, four lines — and it beats the DP table unless you need every answer.'],
    ['trick', 'FIXED WINDOW', 'Anagram search is a fixed-size window plus a 26-count array. Compare counts in O(26) — constant — rather than re-sorting each window.'],
    ['gotcha', 'IN-PLACE STRINGS', 'Reverse-words-in-place is reverse-whole then reverse-each-word, and the hard part is collapsing runs of spaces with a write pointer. Test a string with leading, trailing and doubled spaces.'],
  ],
  11: [
    ['trick', 'THREE QUESTIONS', 'For every recursion: what is the base case, does the argument strictly shrink, and what do I return upward? Answer those three and the body writes itself.'],
    ['trick', 'CHOOSE / UNDO', 'Backtracking is push, recurse, pop — and the pop must be the exact inverse of the push. If you mutate two things going down, restore both coming up.'],
    ['gotcha', 'DEPTH', 'Recursion depth is O(h), and <code>h</code> can be <code>n</code> on a chain. At 10⁵ nodes the default stack overflows, so know the iterative or reverse-BFS rewrite before you need it.'],
  ],
  12: [
    ['trick', 'DUMMY HEAD', 'Allocate a dummy node in front of every list you build or filter. It removes the "what if the head changes" branch entirely, and returning <code>dummy.next</code> is always correct.'],
    ['trick', 'THREE POINTERS', 'Reversal is <code>prev</code>, <code>cur</code>, <code>next</code> — save next, point cur back, advance both. Write it once from memory and you own half the linked-list problems.'],
    ['gotcha', 'MIDDLE OF TWO', 'With an even-length list, <code>fast &amp;&amp; fast-&gt;next</code> gives the second middle and <code>fast-&gt;next &amp;&amp; fast-&gt;next-&gt;next</code> gives the first. The problem cares which; check on a 2-node list.'],
  ],
  13: [
    ['trick', 'WHAT INVALIDATES', 'A monotonic stack is defined by one question: what makes an earlier element useless? For next-greater it is a bigger element arriving — so pop while the top is smaller.'],
    ['trick', 'STORE INDICES', 'Push indices, not values. You almost always need the distance between positions, and you can still read the value with one indirection.'],
    ['speed', 'SENTINELS', 'Append a 0 to a histogram (and treat −1 as a left sentinel) and the final flush loop disappears — every bar gets popped by the sentinel.'],
  ],
  14: [
    ['trick', 'CAPTURE SIZE', 'For level-order, take <code>int n = q.size();</code> <i>before</i> the inner loop. Reading <code>q.size()</code> inside a loop that pushes to <code>q</code> merges every level into one.'],
    ['trick', 'DEQUE FOR EXTREMES', 'Sliding-window maximum keeps a deque of indices with decreasing values: pop the back while smaller, pop the front when it leaves the window. O(n), and a heap is not needed.'],
    ['trick', '0-1 BFS', 'When edges cost only 0 or 1, a deque replaces the heap — push-front for 0, push-back for 1. Dijkstra without the log factor.'],
  ],
  15: [
    ['trick', 'SIZE-K HEAP', 'For k-th largest, keep a <b>min</b>-heap of size k and pop when it overflows. The root is the answer, it is O(n log k), and it works on a stream.'],
    ['trick', 'TWO HEAPS', 'A running median is a max-heap of the low half and a min-heap of the high half, rebalanced so the sizes differ by at most one. The same shape solves IPO and scheduling-by-two-keys.'],
    ['gotcha', 'MIN-HEAP SYNTAX', '<code>priority_queue</code> is a max-heap by default. A min-heap needs the full <code>greater&lt;&gt;</code> template argument — and the comparator is inverted relative to <code>sort</code>.'],
  ],
  16: [
    ['trick', 'CHOOSE THE ORDER', 'The traversal <i>is</i> the decision: in-order for BST sorted order, pre-order to copy or serialise, post-order to aggregate from children, level-order for anything about depth.'],
    ['trick', 'PASS DOWN, RETURN UP', 'Information that flows from ancestors (a running max, a path, a depth) is a parameter. Information that flows from descendants (heights, sums, counts) is a return value. Mixing them up is most tree bugs.'],
    ['speed', 'MORRIS', 'O(1)-space in-order traversal exists: thread the tree through right pointers and undo them. Worth knowing the name even if you never need to write it.'],
  ],
  17: [
    ['trick', 'ONE LOOP, SIX VIEWS', 'Level-order, zig-zag, left view, right view, top view and bottom view are the same BFS with one line changed. Learn the loop, then vary the one line — do not learn six functions.'],
    ['trick', 'INDEX LIKE A HEAP', 'Give the root index 0 and each node <code>2i+1</code> / <code>2i+2</code>, and width, verticality and position questions become arithmetic instead of traversal.'],
    ['gotcha', 'VERTICAL TIE-BREAK', 'Vertical order ties must break on <code>(depth, value)</code>, not insertion order. A BFS that ignores the tie-break passes the samples and fails the hidden tests.'],
  ],
  18: [
    ['trick', 'RETURN ≠ ANSWER', 'For diameter and max-path-sum, what you report upward is a single chain; the answer that bends at this node goes into a by-reference accumulator. Conflating them is the classic failure.'],
    ['trick', 'MINUS-ONE SENTINEL', 'Check balance in one traversal by returning height, or −1 to mean "already unbalanced". Two traversals become one, and the early exit is free.'],
    ['gotcha', 'INT_MIN START', 'Max-path-sum with negative values must start the answer at <code>INT_MIN</code>, not 0 — and the clamp goes on the <i>child</i> (<code>max(child,0)</code>), never on the answer.'],
  ],
  19: [
    ['trick', 'IN-ORDER IS SORTED', 'Nearly every BST problem reduces to "the in-order traversal is sorted". Validate, k-th smallest, minimum difference and two-sum all fall out of that one fact.'],
    ['trick', 'RANGE, NOT PARENT', 'Validate a BST by passing down <code>(low, high)</code> bounds, not by comparing with the parent. The parent check accepts trees that are locally fine and globally wrong.'],
    ['gotcha', 'DELETE TWO CHILDREN', 'Deleting a two-child node means replacing it with its in-order successor and then deleting <i>that</i>. Handle the zero- and one-child cases first and the third becomes short.'],
  ],
  20: [
    ['trick', 'WHY ROTATE', 'A rotation changes the height but never the in-order sequence. That invariant is the whole reason balancing is allowed to move nodes around at all.'],
    ['trick', 'USE THE LIBRARY', 'In an interview, reach for <code>std::map</code> / <code>std::set</code> and say "this is a balanced BST". Hand-rolling AVL is almost never what is being tested.'],
    ['trick', 'ORDER STATISTICS', 'Augment each node with its subtree size and you get k-th smallest and rank in O(log n) — which is what turns a BST into a tool for counting problems.'],
  ],
  21: [
    ['trick', 'CHILDREN AS ARRAY', 'For a lowercase alphabet use <code>Node* next[26]</code>, not a map. It is faster, simpler, and the size is a constant you can afford.'],
    ['trick', 'TRIE + GRID DFS', 'Word Search II is one DFS over the grid walking a trie of all words simultaneously. Searching each word separately is the trap; the trie prunes whole branches at once.'],
    ['trick', 'BINARY TRIE FOR XOR', 'Maximum-XOR problems are a trie over bits, most significant first, greedily taking the opposite bit at each level. Recognising that is the entire difficulty.'],
  ],
  22: [
    ['trick', 'BOOL FROM UNITE', 'Make <code>unite</code> return whether it actually merged. That single boolean is the cycle test in Kruskal and the redundant-edge detector, for free.'],
    ['trick', 'GRID TO DSU', 'Flatten a grid cell to <code>r*cols + c</code> and any 2D connectivity problem becomes a 1D DSU. The same index trick works for any fixed-shape structure.'],
    ['gotcha', 'BOTH OPTIMISATIONS', 'Path compression <i>and</i> union by rank. With only one you get O(log n); with both it is effectively O(1), and the code is two extra lines.'],
  ],
  23: [
    ['trick', 'CHANGE ONE FUNCTION', 'A segment tree is generic over <code>merge</code> and its identity. Sum, min, max and gcd are the same tree with two lines swapped — write it once, parameterise it.'],
    ['trick', 'LAZY = DEFERRED', 'Lazy propagation is just "I promise to apply this later". The hard part is never the push-down; it is composing two pending tags correctly.'],
    ['gotcha', 'SIZE 4N', 'Allocate <code>4*n</code>, not <code>2*n</code>. The recursive layout wastes slots when <code>n</code> is not a power of two, and the overflow is silent.'],
  ],
  24: [
    ['trick', 'LOWBIT', 'Fenwick is two loops and <code>i += i &amp; -i</code> / <code>i -= i &amp; -i</code>. Fewer lines than a segment tree, several times faster, and 1-indexed by necessity.'],
    ['trick', 'COMPRESS FIRST', 'Counting problems over values up to 10⁹ become Fenwick problems the moment you sort the distinct values and index by rank. Coordinate compression is the enabling step.'],
    ['gotcha', 'FENWICK CANNOT MIN', 'A Fenwick tree does prefix operations with an inverse. Min and max have none, so point-update range-min needs a segment tree or a sparse table.'],
  ],
  25: [
    ['gotcha', 'MARK ON PUSH', 'Set <code>visited[neighbour]</code> when you <b>enqueue</b>, never when you dequeue. Marking on dequeue still returns the right answer while pushing each node once per incoming edge — silent, and quadratic on dense graphs.'],
    ['trick', 'BUILD ONCE', 'Build the adjacency list in the driver, pass it by reference everywhere, and add both directions for undirected edges. One missing <code>&amp;</code> turns O(V+E) into O(V·(V+E)).'],
    ['trick', 'IMPLICIT GRAPHS', 'Word ladder, jump games and state puzzles are graphs you never construct: the neighbour function generates edges on demand. Ask "what are the nodes and what are the edges?" before anything else.'],
  ],
  26: [
    ['trick', 'KAHN COUNTS', 'If Kahn emits fewer than V nodes, a cycle exists. That makes "is this schedulable?" and "give me an order" the same function with one extra check.'],
    ['trick', 'LEX SMALLEST', 'Swap the queue for a priority queue and Kahn gives the lexicographically smallest topological order. A one-word change to the container.'],
    ['trick', 'DAG DP', 'Longest path, path counts and critical paths are all DP in topological order — which is exactly the order that guarantees every dependency is already computed.'],
  ],
  27: [
    ['trick', 'DIRECTED NEEDS INSTACK', 'A directed cycle needs <i>on the current path</i>, not merely <i>visited</i>. Two arrays, or white/grey/black — a single visited array finds cross-edges and reports cycles that are not there.'],
    ['trick', 'UNDIRECTED: SKIP PARENT', 'For undirected graphs, ignore the edge you arrived on. On a tree that single guard replaces the visited array entirely.'],
    ['gotcha', 'PARALLEL EDGES', 'The skip-parent trick breaks with duplicate edges or self-loops — those <i>are</i> cycles. Track the edge id rather than the parent node when the input allows them.'],
  ],
  28: [
    ['trick', 'TWO-COLOUR BFS', 'Bipartite is BFS assigning alternating colours; a conflict means an odd cycle. "Is it bipartite" and "does an odd cycle exist" are the same question.'],
    ['trick', 'GRID PARITY', 'A grid graph is always bipartite by <code>(r+c) % 2</code> — no search needed. Recognising that kills a whole class of problems instantly.'],
    ['trick', 'DSU WITH PARITY', 'For mixed "same" and "different" constraints, store parity relative to the root in the DSU. It handles both kinds of edge in one structure.'],
  ],
  29: [
    ['trick', 'BFS ONLY IF UNIFORM', 'BFS gives shortest paths only when every edge costs the same. The moment weights differ, a queue processes nodes in the wrong order — that is the single most common wrong answer in this chapter.'],
    ['trick', 'LAZY DELETION', 'Do not implement decrease-key. Push duplicates and skip stale entries with <code>if(d &gt; dist[node]) continue;</code> — that one line is the whole idiom.'],
    ['trick', 'WIDEN THE STATE', 'When a path constraint exists (at most k stops, a key bitmask, fuel remaining), the node is not the state — <code>(node, extra)</code> is. Dijkstra over the widened graph, unchanged.'],
  ],
  30: [
    ['trick', 'V−1 THEN ONE MORE', 'Bellman-Ford relaxes V−1 rounds; a V-th round that still improves something proves a negative cycle. That extra pass <i>is</i> the detector.'],
    ['trick', 'DIST ALL ZERO', 'To find a negative cycle anywhere rather than only from a source, initialise every distance to 0. Neater than adding a virtual node, and one line.'],
    ['gotcha', 'FLOYD LOOP ORDER', 'In Floyd-Warshall, <code>k</code> must be the <b>outermost</b> loop. Any other order computes something that is not the shortest path, and it looks plausible.'],
  ],
  31: [
    ['trick', 'WHICH ALGORITHM', 'Sparse graph and an edge list you can sort: Kruskal with DSU. Dense graph or a complete graph on points: O(V²) Prim with no heap at all.'],
    ['trick', 'MAXIMUM SPANNING', 'Negate the weights and the same code gives the maximum spanning tree. No new algorithm needed.'],
    ['trick', 'BOTTLENECK', 'The minimum possible maximum edge between two nodes lies on the MST. That is why "minimise the largest edge" problems are MST problems in disguise.'],
  ],
  32: [
    ['trick', 'LOW-LINK', 'Bridges, articulation points and SCCs are all one DFS carrying a discovery time and a low-link value. Learn the low-link update once and three algorithms follow.'],
    ['gotcha', 'ROOT IS SPECIAL', 'The DFS root is an articulation point only if it has more than one child in the DFS tree. Forgetting that one case is the standard bug.'],
    ['trick', 'CONDENSE', 'Collapse each SCC to a node and you get a DAG, which you can then DP over. "Minimum edges to make it strongly connected" becomes <code>max(sources, sinks)</code> on that DAG.'],
  ],
  33: [
    ['trick', 'MODEL, DO NOT IMPLEMENT', 'The skill being tested is the reduction: what are the two sides, what is the capacity, what does a unit of flow mean. Naming max-flow and describing the graph is usually the whole answer.'],
    ['trick', 'MATCHING = FLOW', 'Bipartite matching is max-flow with unit capacities. Kőnig then gives minimum vertex cover, and the complement gives maximum independent set — three answers from one run.'],
    ['trick', 'NODE CAPACITY', 'To cap a node rather than an edge, split it into in- and out-halves joined by one edge of that capacity. A standard trick worth remembering.'],
  ],
  34: [
    ['trick', 'DIRECTION ARRAYS', 'Keep <code>dr[]</code> and <code>dc[]</code> and loop. Four branches become one loop, and switching to 8-connectivity is then a two-element edit rather than a rewrite.'],
    ['trick', 'MULTI-SOURCE', 'Push <b>every</b> source before the loop starts and BFS fans out from all of them at once. That converts "distance to the nearest X" from many searches into one.'],
    ['trick', 'FLOOD FROM OUTSIDE', 'For "regions not touching the border", start the flood at the border and invert. Far easier than testing enclosure from the inside.'],
  ],
  35: [
    ['trick', 'SORT TO DEDUPE', 'Sort first, then skip <code>i &gt; start &amp;&amp; a[i] == a[i-1]</code>. That is how you avoid duplicate subsets without a set — and the condition is on the <i>sibling</i>, not the parent.'],
    ['trick', 'PRUNE EARLY', 'Check feasibility before recursing, not at the leaf. A bound that cuts a branch at depth 2 saves more than any micro-optimisation at depth 12.'],
    ['gotcha', 'RESTORE EXACTLY', 'Whatever you changed going down must be undone coming up — including the grid cell you marked as visited. A missing unmark is the classic word-search bug.'],
  ],
  36: [
    ['trick', 'SORT BY END', 'For interval scheduling, sort by <b>end</b> time. Sorting by duration or by start is intuitive and wrong; the exchange argument only works for end time.'],
    ['gotcha', 'PROVE IT', 'Most plausible greedy rules are false. Either give the exchange argument in a sentence, or stress-test against brute force on n ≤ 8 — that finds a counterexample in seconds.'],
    ['trick', 'GREEDY + HEAP', 'When the greedy choice changes as you go, a heap supplies it: task scheduler, IPO, refuelling stops and connect-sticks are all "greedy, re-evaluated each step".'],
  ],
  37: [
    ['trick', 'WORK IN MERGE', 'The interesting divide-and-conquer algorithms do their real work in the <i>combine</i> step. If combining is trivial, you probably just have a loop.'],
    ['trick', 'MASTER THEOREM', 'T(n) = 2T(n/2) + O(n) is O(n log n); + O(1) is O(n). Recognising those two shapes covers nearly every recurrence you will meet.'],
    ['trick', 'BINARY EXPONENTIATION', 'Any associative operation applied n times is O(log n) by squaring — integers, matrices, even string hashes. One loop, endless reuse.'],
  ],
  38: [
    ['trick', 'STATE SENTENCE', 'Write <code>dp[i]</code> is … as an English sentence before any code. If the sentence needs two clauses, you need two dimensions — and you have just found them.'],
    ['trick', 'TOP-DOWN FIRST', 'Derive recursively and memoise; convert to a table only if you need the space optimisation. Top-down is far easier to get right and skips unreachable states for free.'],
    ['gotcha', 'KEY = STATE', 'The memo key must contain every parameter the answer depends on and nothing else. If two calls with the same key could legitimately differ, the key is incomplete.'],
  ],
  39: [
    ['trick', 'ENDING AT i', 'When the answer is a best subarray, define the state as "ending at <code>i</code>" and take the maximum over the whole table. That is Kadane, and it generalises.'],
    ['trick', 'ROLL TWO VARS', 'A 1D DP that reads only <code>i-1</code> and <code>i-2</code> needs two variables, not an array. Same complexity, O(1) space, and fewer places to be wrong.'],
    ['trick', 'PATIENCE LIS', 'LIS in O(n log n) is <code>lower_bound</code> into a tails array. The tails array is <i>not</i> the answer subsequence — recovering that needs parent pointers.'],
  ],
  40: [
    ['trick', 'TWO LOOP RULES', 'In 1D knapsack, capacity descending means each item once; ascending means unlimited reuse. And coins-outer counts combinations while capacity-outer counts permutations. Memorise those two sentences.'],
    ['trick', 'SIX DISGUISES', 'Subset sum, partition, target sum, coin change (min), coin change (count) and rod cutting are all one table. Learn the table, then map the problem onto it.'],
    ['gotcha', 'TARGET TOO BIG', 'Knapsack is O(n·target) — pseudo-polynomial. When the target is 10⁹ and n ≤ 40, it is meet-in-the-middle, not DP.'],
  ],
  41: [
    ['trick', '3×3 CORNER', 'Fill <code>dp[0..2][0..2]</code> by hand for two 2-character strings before writing the loops. Thirty seconds, and it settles the base cases and the indexing at once.'],
    ['gotcha', 'OFF BY ONE', 'Row <code>i</code> means "the first <code>i</code> characters", so the character is <code>s[i-1]</code>. Derive that from the state sentence rather than guessing.'],
    ['trick', 'LCS ANSWERS FOUR', 'Minimum insert/delete, shortest common supersequence, longest palindromic subsequence and minimum insertions to make a palindrome all reduce to one LCS call.'],
  ],
  42: [
    ['trick', 'REVERSE THE MOVES', 'Legal moves right and down means a cell is entered from left or above. Reversing the movement rules gives you both the transition and the loop order.'],
    ['gotcha', 'LEFT vs DIAGONAL', 'Rolling one row: "above" is <code>prev[j]</code> and "left" is <code>cur[j-1]</code>. <code>prev[j-1]</code> is the diagonal, and using it produces plausible wrong answers.'],
    ['trick', 'FOUR DIRECTIONS ⇒ NOT DP', 'If all four directions are allowed the dependencies are cyclic and no fill order exists. That is BFS, 0-1 BFS or Dijkstra — not a bigger table.'],
  ],
  43: [
    ['trick', 'POST-ORDER IS FREE', 'On a tree the recursion order <i>is</i> the topological order, so there is no fill order to arrange. That is why tree DP is the easiest DP.'],
    ['trick', 'RETURN A PAIR', 'When the choice depends on what the parent did, return two values — used and not-used. House robber III, max independent set and the camera problem are all this shape.'],
    ['gotcha', 'SKIP FREES CHILDREN', 'Skipping a node imposes nothing downward, so each child takes its own max. Writing <code>skipL + skipR</code> silently forbids the grandchildren too.'],
  ],
  44: [
    ['trick', 'n ≤ 20 IS THE HINT', 'A tiny bound plus "each item exactly once" is the bitmask signature. The bound is not a courtesy; it is telling you an exponential state is expected.'],
    ['trick', 'DERIVE, DO NOT STORE', 'If items are taken in a fixed order, the position is <code>popcount(mask)</code> — no second dimension. That alone divides the memory by n.'],
    ['gotcha', 'PARENTHESISE', '<code>mask &amp; 1&lt;&lt;i == 0</code> parses as <code>mask &amp; (1==0)</code> and is always false. Always parenthesise, and never do arithmetic on <code>INT_MAX</code>.'],
  ],
  45: [
    ['trick', 'NAME k FIRST', 'Write a comment saying exactly what <code>k</code> is — the last operation, the first cut, the root — before the loop. The bounds and the two recursive terms then follow mechanically.'],
    ['trick', 'THINK LAST', 'When splitting on the first operation makes the halves interact, split on the <b>last</b> one instead. That inversion solves burst balloons, merge stones and remove boxes.'],
    ['gotcha', 'LENGTH OUTER', 'Both indices increasing reads a row that has not been filled and fails silently. Iterate by increasing length, or <code>i</code> downward with <code>j</code> upward.'],
  ],
  46: [
    ['trick', 'f(R) − f(L−1)', 'Count over a range by counting two prefixes. The same trick as prefix sums, applied to counting — and it halves the work you have to think about.'],
    ['gotcha', 'DO NOT MEMO TIGHT', 'A tight state’s value depends on the bound, not just the state. Memoise only the free states, and remember the <code>started</code> flag or leading zeros will bite.'],
    ['trick', 'DIFFERENCE, NOT TURN', 'For two-player games, store the score difference from the mover’s perspective. Minimax then collapses to one minus sign and the turn leaves the state.'],
  ],
  47: [
    ['trick', 'TWELVE IDIOMS', '<code>x&amp;-x</code> isolates the lowest set bit, <code>x&amp;(x-1)</code> clears it, and that pair gives you popcount, power-of-two and set iteration. Learn them as vocabulary.'],
    ['trick', 'XOR CANCELS PAIRS', 'XOR is self-inverse, so it deletes everything appearing an even number of times. That is the whole single-number family, in O(1) space and one pass.'],
    ['gotcha', 'PARITY BREAKS AT 3', 'With three copies XOR no longer cancels. Count each bit position mod 3 instead — and that version generalises to any k by changing one character.'],
  ],
  48: [
    ['trick', 'DIVIDE FIRST', 'Compute LCM as <code>(a/gcd)*b</code>, never <code>(a*b)/gcd</code>. Identical result, and the intermediate value stays inside 64 bits.'],
    ['gotcha', 'MODULAR MINUS', 'C++ <code>%</code> follows the sign of the dividend, so <code>(-7)%5</code> is −2. Every modular subtraction needs <code>((a-b)%m + m)%m</code>, and every product needs <code>1LL*</code>.'],
    ['trick', 'ONE INVERSE', 'Build inverse factorials with a single call to <code>power</code> and a downward loop (<code>invFact[i-1] = invFact[i]*i</code>). N calls to <code>power</code> is the wasteful way.'],
  ],
  49: [
    ['trick', 'ONE CROSS HELPER', 'Write <code>cross(O,A,B)</code> once; orientation, collinearity, polygon area and point-in-triangle are all its sign. A cascade of slope comparisons is how geometry code gets long and wrong.'],
    ['gotcha', 'STAY IN INTEGERS', 'Compare squared distances and return twice the area. Every float you introduce is a future failure on a collinear or touching case.'],
    ['trick', 'RESERVOIR PROOF', 'Keeping the i-th item with probability 1/i is uniform because the survival product telescopes to 1/n. Short enough to say out loud, which is why it is worth knowing.'],
  ],
  50: [
    ['trick', 'lps BY HAND', 'Build the table for <code>"aabaaab"</code> on paper — it is <code>0 1 0 1 2 2 3</code>. That settles both traps: the prefix must be <i>proper</i>, and the fallback is <code>lps[len-1]</code>, not <code>len-1</code>.'],
    ['trick', 'SEPARATOR TRICK', 'Combining two strings as <code>a + &#39;#&#39; + b</code> and running the prefix or Z function answers a surprising number of problems. The separator must appear in neither string.'],
    ['gotcha', 'VERIFY HASHES', 'Equal hashes do not mean equal strings, and setters write anti-hash tests. Verify the characters on a match, or use two independent moduli.'],
  ],
  51: [
    ['trick', 'TABULATE FIRST', 'Write operation → required complexity → structure before declaring a single member. The hard operation reveals the design, and the table becomes your explanation.'],
    ['trick', 'getRandom ⇒ ARRAY', 'O(1) uniform random forces a contiguous array. Deletion then becomes swap-with-last — and the line people forget is updating the moved element’s index.'],
    ['gotcha', 'UPDATE BOTH', 'Every bug in an LRU is one structure updated and the other not. State the invariant — the map holds a valid iterator into the list — and check it at every exit.'],
  ],
  52: [
    ['trick', 'FOUR QUESTIONS', 'Shape, output, constraints, redundancy — in that order. Most problems are pinned down by the second, and the fourth hands you the technique.'],
    ['trick', 'NAME THE WASTE', 'Every optimisation removes one kind of repeated work: overlapping subproblems → DP, recomputed window → sliding window, repeated "nearest bigger" → monotonic stack.'],
    ['trick', 'MAKE IT A GRAPH', 'When nothing matches, ask what the nodes and edges are. Scheduling, currency conversion, word ladders and equation consistency are all graph problems in costume.'],
  ],
  53: [
    ['trick', 'ONE INVARIANT PER LOOP', 'Write what is always true at the top of the loop. It settles where guards go, proves termination, and gives you one thing to print when it breaks.'],
    ['trick', 'STRESS TEST', 'Brute force, tiny random inputs (n ≤ 8, with negatives and duplicates), fixed seed, stop at the first mismatch. Thirty lines that settle a greedy argument in seconds.'],
    ['gotcha', 'TRACE n = 1', 'Walk your actual code on <code>n = 1</code> and <code>n = 2</code> before declaring it done. That catches nearly every off-by-one in twenty seconds.'],
  ],
  54: [
    ['trick', 'BRUTE FORCE ALOUD', 'State the brute force even when you know the optimal answer. It proves you understand the problem, gives you a baseline to test against, and <i>produces</i> the optimisation.'],
    ['trick', 'NARRATE DECISIONS', '"I am choosing between a heap and sorting; sorting is simpler but the streaming requirement rules it out" is worth more than two minutes of silent correctness.'],
    ['gotcha', 'TAKE THE HINT', 'Hints are given deliberately. Using one well is a positive signal; arguing with a correct one is the fastest way to fail a round you were passing.'],
  ],
  55: [
    ['trick', 'STRIP THE STORY', 'Rain and swimming are decoration; "minimise the maximum along a path" is the problem. Restate in your own words before choosing a tool.'],
    ['trick', 'MONOTONE COMBINER', 'Dijkstra needs only that extending a path never lowers its cost. Swap <code>+</code> for <code>max</code> and you have bottleneck paths; <code>min</code> gives widest path.'],
    ['trick', 'PICK FOR FOLLOW-UPS', 'Three solutions were correct; choose the one that survives "what if elevations repeat?" or "now minimise the sum". That judgement is what is actually being assessed.'],
  ],
  56: [
    ['trick', 'FACTOR OUT', 'When an inner loop recomputes a maximum that changes by one element, pull out what does not depend on the inner index and carry the rest. That is O(n²k) → O(n·k).'],
    ['trick', 'READ IT AS A MACHINE', 'The rolled solution is 2k states with edges between them. Cooldown adds a state, a fee subtracts on one edge, unlimited drops the counter — six problems, one framework.'],
    ['gotcha', 'SENTINEL HEADROOM', 'Initialise <code>buy</code> to <code>INT_MIN/2</code>, not <code>INT_MIN</code>, so <code>buy + price</code> cannot wrap. And guard <code>k ≥ n/2</code> or a huge k allocates a huge table.'],
  ],
};
