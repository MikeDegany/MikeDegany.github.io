/**
 * Pure pose-graph sampling shared by the hero background and the explore game.
 *
 * Nodes are sampled only once the cursor/robot has travelled `minStep` from the last
 * node; consecutive nodes get an odometry edge, and any older node (excluding the
 * `loopSkip` most recent) within `loopRadius` gets a loop-closure edge.
 */

export type GNode = { id: number; x: number; y: number }
export type GEdge = { id: string; a: number; b: number; loop: boolean }
export type Graph = { nodes: GNode[]; edges: GEdge[]; nextId: number }

export type PoseGraphParams = {
  /** Minimum distance from the last node before a new one is sampled. */
  minStep: number
  /** A new node links back to older nodes within this distance (loop closure). */
  loopRadius: number
  /** The most recent nodes are skipped when looking for loop closures. */
  loopSkip: number
  /** Cap on loop edges per node so scribbling doesn't turn into a hairball. */
  maxLoopsPerNode: number
  /** FIFO cap on the graph size. */
  maxNodes: number
}

export const HERO_POSE_GRAPH_PARAMS: PoseGraphParams = {
  minStep: 34,
  loopRadius: 70,
  loopSkip: 4,
  maxLoopsPerNode: 2,
  maxNodes: 120,
}

export const EMPTY_GRAPH: Graph = { nodes: [], edges: [], nextId: 0 }

export function addSample(g: Graph, x: number, y: number, p: PoseGraphParams): Graph {
  const { nodes, edges, nextId } = g

  if (nodes.length === 0) {
    return { nodes: [{ id: nextId, x, y }], edges, nextId: nextId + 1 }
  }

  const last = nodes[nodes.length - 1]
  if (Math.hypot(x - last.x, y - last.y) < p.minStep) return g

  const node: GNode = { id: nextId, x, y }
  const fresh: GEdge[] = [{ id: `${last.id}-${node.id}`, a: last.id, b: node.id, loop: false }]

  nodes
    .slice(0, Math.max(0, nodes.length - p.loopSkip))
    .map((n) => ({ n, d: Math.hypot(x - n.x, y - n.y) }))
    .filter((c) => c.d <= p.loopRadius)
    .sort((a, b) => a.d - b.d)
    .slice(0, p.maxLoopsPerNode)
    .forEach((c) => fresh.push({ id: `${c.n.id}-${node.id}`, a: c.n.id, b: node.id, loop: true }))

  let nextNodes = [...nodes, node]
  let nextEdges = [...edges, ...fresh]

  if (nextNodes.length > p.maxNodes) {
    const dropped = new Set(nextNodes.slice(0, nextNodes.length - p.maxNodes).map((n) => n.id))
    nextNodes = nextNodes.slice(nextNodes.length - p.maxNodes)
    nextEdges = nextEdges.filter((e) => !dropped.has(e.a) && !dropped.has(e.b))
  }

  return { nodes: nextNodes, edges: nextEdges, nextId: nextId + 1 }
}

/** Rescale every node (used when the containing panel resizes). */
export function scaleGraph(g: Graph, sx: number, sy: number): Graph {
  if (g.nodes.length === 0 || (sx === 1 && sy === 1)) return g
  return { ...g, nodes: g.nodes.map((n) => ({ ...n, x: n.x * sx, y: n.y * sy })) }
}
