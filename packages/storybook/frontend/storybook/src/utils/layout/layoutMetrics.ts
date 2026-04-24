/*******************************************************************************
 * Copyright (c) 2026 Obeo.
 * This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v2.0
 * which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *     Obeo - initial API and implementation
 *******************************************************************************/
import type { GQLDiagram } from "@eclipse-sirius/sirius-components-diagrams";

export interface LayoutMetrics {
  edgeCrossings: number;
  edgeNodeCrossings: number;
  nodeOverlap: number;
  averageBendingsPoints: number;
  spaceUtilization: number;
  edgeStandardDeviation: number;
  flowOrientation: number;
  spatialGrouping: number;
  score: number;
}

type Node = {
  id: string;
  parentId: string | null;
  x: number;
  y: number;
  width: number;
  height: number;
  childNodesList: string[];
};

type Edge = {
  id: string;
  sourceId: string;
  targetId: string;
  segments: Segment[];
};

type Point = { x: number; y: number };
type Segment = { p1: Point; p2: Point };
type Rect = { x: number; y: number; w: number; h: number; id?: string };

// GEOMETRIC CALCULATIONS

const orientation = (seg: Segment, pt: Point): number => {
  const val =
    (seg.p2.y - seg.p1.y) * (pt.x - seg.p2.x) -
    (seg.p2.x - seg.p1.x) * (pt.y - seg.p2.y);
  if (val === 0) return 0;
  return val > 0 ? 1 : 2;
};

const onSegment = (seg: Segment, pt: Point): boolean => {
  return (
    pt.x <= Math.max(seg.p1.x, seg.p2.x) &&
    pt.x >= Math.min(seg.p1.x, seg.p2.x) &&
    pt.y <= Math.max(seg.p1.y, seg.p2.y) &&
    pt.y >= Math.min(seg.p1.y, seg.p2.y)
  );
};

const doIntersect = (seg1: Segment, seg2: Segment): boolean => {
  const o1 = orientation(seg1, seg2.p1);
  const o2 = orientation(seg1, seg2.p2);
  const o3 = orientation(seg2, seg1.p1);
  const o4 = orientation(seg2, seg1.p2);

  if (o1 !== o2 && o3 !== o4) return true;
  if (o1 === 0 && onSegment(seg1, seg2.p1)) return true;
  if (o2 === 0 && onSegment(seg1, seg2.p2)) return true;
  if (o3 === 0 && onSegment(seg2, seg1.p1)) return true;
  if (o4 === 0 && onSegment(seg2, seg1.p2)) return true;

  return false;
};

const doIntersectRect = (seg: Segment, rect: Rect): boolean => {
  const isInside = (p: Point) =>
    p.x >= rect.x &&
    p.x <= rect.x + rect.w &&
    p.y >= rect.y &&
    p.y <= rect.y + rect.h;
  if (isInside(seg.p1) || isInside(seg.p2)) return true;

  const topLeft = { x: rect.x, y: rect.y };
  const topRight = { x: rect.x + rect.w, y: rect.y };
  const bottomLeft = { x: rect.x, y: rect.y + rect.h };
  const bottomRight = { x: rect.x + rect.w, y: rect.y + rect.h };

  const intersectsTopEdge = doIntersect(seg, { p1: topLeft, p2: topRight });
  const intersectsRightEdge = doIntersect(seg, {
    p1: topRight,
    p2: bottomRight,
  });
  const intersectsBottomEdge = doIntersect(seg, {
    p1: bottomRight,
    p2: bottomLeft,
  });
  const intersectsLeftEdge = doIntersect(seg, { p1: bottomLeft, p2: topLeft });

  return (
    intersectsTopEdge ||
    intersectsRightEdge ||
    intersectsBottomEdge ||
    intersectsLeftEdge
  );
};

// DATA EXTRACTION

const extractNodes = (diagram: GQLDiagram, container: HTMLElement): Node[] => {
  const domNodes = new Map<string, HTMLElement>();
  container.querySelectorAll(".react-flow__node").forEach((node) => {
    const id = node.getAttribute("data-id");
    if (id) domNodes.set(id, node as HTMLElement);
  });

  const containerRect = container.getBoundingClientRect();
  const allNodes: Node[] = [];

  const walk = (nodes: any[], parentId: string | null = null) => {
    for (const n of nodes) {
      const domNode = domNodes.get(n.id);
      if (domNode) {
        const rect = domNode.getBoundingClientRect();
        allNodes.push({
          id: n.id,
          parentId,
          x: rect.left - containerRect.left,
          y: rect.top - containerRect.top,
          width: rect.width,
          height: rect.height,
          childNodesList: n.childNodes?.map((c: any) => c.id) || [],
        });
        if (n.childNodes) walk(n.childNodes, n.id);
      }
    }
  };

  if (diagram.nodes) walk(diagram.nodes);
  return allNodes;
};

const extractEdges = (diagram: GQLDiagram, container: HTMLElement): Edge[] => {
  const allEdges: Edge[] = [];
  const containerRect = container.getBoundingClientRect();

  container.querySelectorAll(".react-flow__edge").forEach((edgeElement) => {
    const id = edgeElement.getAttribute("data-id");
    const originalEdge = diagram.edges.find((e) => e.id === id);
    if (!id || !originalEdge) return;

    const path = edgeElement.querySelector(
      ".react-flow__edge-path",
    ) as SVGPathElement;
    if (!path) return;

    const d = path.getAttribute("d");
    if (!d) return;

    const ctm = path.getScreenCTM();
    const svgElement = path.ownerSVGElement;
    if (!ctm || !svgElement) return;

    const points: Point[] = [];
    const matches = d.match(/[-+]?[0-9]*\.?[0-9]+/g);

    if (matches) {
      for (let i = 0; i < matches.length - 1; i += 2) {
        const pt = svgElement.createSVGPoint();
        pt.x = parseFloat(matches[i]);
        pt.y = parseFloat(matches[i + 1]);

        const screenPt = pt.matrixTransform(ctm);
        points.push({
          x: screenPt.x - containerRect.left,
          y: screenPt.y - containerRect.top,
        });
      }
    }

    const segments: Segment[] = [];
    for (let i = 0; i < points.length - 1; i++) {
      segments.push({ p1: points[i], p2: points[i + 1] });
    }

    if (segments.length > 0) {
      allEdges.push({
        id,
        sourceId: originalEdge.sourceId,
        targetId: originalEdge.targetId,
        segments,
      });
    }
  });

  return allEdges;
};

// METRICS CALCULATION ALGORITHMS

const isAncestor = (
  ancestorId: string,
  nodeId: string,
  nodes: Node[],
): boolean => {
  const node = nodes.find((n) => n.id === nodeId);
  if (!node || !node.parentId) return false;
  if (node.parentId === ancestorId) return true;
  return isAncestor(ancestorId, node.parentId, nodes);
};

const calculateEdgeCrossings = (edges: Edge[]): number => {
  let crossings = 0;
  for (let i = 0; i < edges.length; i++) {
    for (let j = i + 1; j < edges.length; j++) {
      for (const segA of edges[i].segments) {
        for (const segB of edges[j].segments) {
          if (doIntersect(segA, segB)) {
            crossings++;
          }
        }
      }
    }
  }
  return crossings;
};

const calculateEdgeNodeCrossings = (edges: Edge[], nodes: Node[]): number => {
  let totalCrossings = 0;

  for (const edge of edges) {
    const hitNodesForThisEdge = new Set<string>();
    for (const node of nodes) {
      for (let i = 0; i < edge.segments.length; i++) {
        const seg = edge.segments[i];
        if (i === 0 && node.id === edge.sourceId) {
          continue;
        }
        if (i === edge.segments.length - 1 && node.id === edge.targetId) {
          continue;
        }
        if (
          doIntersectRect(seg, {
            x: node.x,
            y: node.y,
            w: node.width,
            h: node.height,
          })
        ) {
          hitNodesForThisEdge.add(node.id);
        }
      }
    }
    totalCrossings += hitNodesForThisEdge.size;
  }

  return totalCrossings;
};

const calculateNodeOverlap = (nodes: Node[]): number => {
  let overlaps = 0;

  for (let i = 0; i < nodes.length; i++) {
    for (let j = i + 1; j < nodes.length; j++) {
      const nodeA = nodes[i];
      const nodeB = nodes[j];

      if (
        isAncestor(nodeA.id, nodeB.id, nodes) ||
        isAncestor(nodeB.id, nodeA.id, nodes)
      ) {
        continue;
      }

      const aLeft = nodeA.x;
      const aRight = nodeA.x + nodeA.width;
      const aTop = nodeA.y;
      const aBottom = nodeA.y + nodeA.height;

      const bLeft = nodeB.x;
      const bRight = nodeB.x + nodeB.width;
      const bTop = nodeB.y;
      const bBottom = nodeB.y + nodeB.height;

      const isOverlappingHorizontally = aLeft < bRight && aRight > bLeft;
      const isOverlappingVertically = aTop < bBottom && aBottom > bTop;

      if (isOverlappingHorizontally && isOverlappingVertically) {
        overlaps++;
      }
    }
  }

  return overlaps;
};

const calculateAverageBendingPoint = (edges: Edge[]): number => {
  let totalBendingsPts = 0;

  for (const edge of edges) {
    const ptsPerEdges = edge.segments.length - 1;
    totalBendingsPts += ptsPerEdges;
  }

  return totalBendingsPts / edges.length;
};

const calculateSpaceUtilization = (nodes: Node[]): number => {
  let minX = Infinity,
    minY = Infinity,
    maxX = -Infinity,
    maxY = -Infinity;
  let totalNodeArea = 0;

  const rootNodes = nodes.filter((n) => !n.parentId);
  for (const node of rootNodes) {
    minX = Math.min(minX, node.x);
    minY = Math.min(minY, node.y);
    maxX = Math.max(maxX, node.x + node.width);
    maxY = Math.max(maxY, node.y + node.height);
    totalNodeArea += node.width * node.height;
  }

  const globalWidth = maxX - minX;
  const globalHeight = maxY - minY;
  const globalArea = globalWidth * globalHeight;

  return (totalNodeArea / globalArea) * 100;
};

const calculateEdgeStandardDeviation = (edges: Edge[]): number => {
  const lengths: number[] = [];
  let totalLength = 0;

  for (const edge of edges) {
    let edgeLength = 0;
    for (const seg of edge.segments) {
      const dx = seg.p2.x - seg.p1.x;
      const dy = seg.p2.y - seg.p1.y;
      edgeLength += Math.sqrt(dx * dx + dy * dy);
    }
    lengths.push(edgeLength);
    totalLength += edgeLength;
  }

  const mean = totalLength / lengths.length;

  let sumOfSquares = 0;
  for (const length of lengths) {
    sumOfSquares += Math.pow(length - mean, 2);
  }

  const variance = sumOfSquares / lengths.length;
  return Math.sqrt(variance);
};

const calculateFlowOrientation = (edges: Edge[], nodes: Node[]): number => {
  let right = 0,
    down = 0,
    left = 0,
    up = 0;
  let validEdges = 0;

  for (const edge of edges) {
    const sourceNode = nodes.find((n) => n.id === edge.sourceId);
    const targetNode = nodes.find((n) => n.id === edge.targetId);

    if (sourceNode && targetNode) {
      validEdges++;

      const sourceCenterX = sourceNode.x + sourceNode.width / 2;
      const sourceCenterY = sourceNode.y + sourceNode.height / 2;
      const targetCenterX = targetNode.x + targetNode.width / 2;
      const targetCenterY = targetNode.y + targetNode.height / 2;

      if (targetCenterX > sourceCenterX) right++;
      else left++;
      if (targetCenterY > sourceCenterY) down++;
      else up++;
    }
  }

  const maxFlow = Math.max(right, down, left, up);
  return validEdges === 0 ? 100 : (maxFlow / validEdges) * 100;
};

const calculateSpatialGrouping = (edges: Edge[], nodes: Node[]): number => {
  if (edges.length === 0) return 100;

  let totalDist = 0;
  let validEdges = 0;

  for (const edge of edges) {
    const sourceNode = nodes.find((n) => n.id === edge.sourceId);
    const targetNode = nodes.find((n) => n.id === edge.targetId);

    if (sourceNode && targetNode) {
      const sourceCenterX = sourceNode.x + sourceNode.width / 2;
      const sourceCenterY = sourceNode.y + sourceNode.height / 2;
      const targetCenterX = targetNode.x + targetNode.width / 2;
      const targetCenterY = targetNode.y + targetNode.height / 2;

      const dx = sourceCenterX - targetCenterX;
      const dy = sourceCenterY - targetCenterY;

      const dist = Math.sqrt(dx * dx + dy * dy);

      totalDist += dist;
      validEdges++;
    }
  }

  const avgDist = totalDist / validEdges;
  const score = 100 - avgDist / 10;

  return Math.max(0, Math.min(100, score));
};

const calculatedScore = (
  layoutMetrics: LayoutMetrics,
  allNodes: Node[],
  allEdges: Edge[],
) => {
  const safeNodes = Math.max(1, allNodes.length); //to block the division by 0
  const safeEdges = Math.max(1, allEdges.length);
  const u = layoutMetrics.spaceUtilization;

  return (
    (Math.max(0, 10 - (layoutMetrics.edgeCrossings / safeEdges) * 10) +
      Math.max(0, 10 - (layoutMetrics.edgeNodeCrossings / safeNodes) * 10) +
      Math.max(0, 10 - (layoutMetrics.nodeOverlap / safeNodes) * 20) +
      Math.max(0, 10 - layoutMetrics.averageBendingsPoints * 1) +
      Math.max(0, 10 - Math.max(0, 50 - u) * 0.2 - Math.max(0, u - 75) * 0.4) +
      Math.max(0, 10 - layoutMetrics.edgeStandardDeviation / 10) +
      layoutMetrics.spatialGrouping / 10 +
      layoutMetrics.flowOrientation / 10) /
    8
  );
};

// MAIN EXPORT FUNCTION

export const computeLayoutMetrics = (
  diagram: GQLDiagram,
  container: HTMLElement,
): LayoutMetrics => {
  const allNodes = extractNodes(diagram, container);
  const allEdges = extractEdges(diagram, container);

  const layoutMetrics: LayoutMetrics = {
    edgeCrossings: calculateEdgeCrossings(allEdges),
    edgeNodeCrossings: calculateEdgeNodeCrossings(allEdges, allNodes),
    nodeOverlap: calculateNodeOverlap(allNodes),
    averageBendingsPoints: calculateAverageBendingPoint(allEdges),
    spaceUtilization: calculateSpaceUtilization(allNodes),
    edgeStandardDeviation: calculateEdgeStandardDeviation(allEdges),
    flowOrientation: calculateFlowOrientation(allEdges, allNodes),
    spatialGrouping: calculateSpatialGrouping(allEdges, allNodes),
    score: 0,
  };

  layoutMetrics.score = calculatedScore(layoutMetrics, allNodes, allEdges);

  return {
    edgeCrossings: layoutMetrics.edgeCrossings,
    edgeNodeCrossings: layoutMetrics.edgeNodeCrossings,
    nodeOverlap: layoutMetrics.nodeOverlap,
    averageBendingsPoints: Number(
      layoutMetrics.averageBendingsPoints.toFixed(2),
    ),
    spaceUtilization: Number(layoutMetrics.spaceUtilization.toFixed(2)),
    edgeStandardDeviation: Number(
      layoutMetrics.edgeStandardDeviation.toFixed(2),
    ),
    flowOrientation: Number(layoutMetrics.flowOrientation.toFixed(2)),
    spatialGrouping: Number(layoutMetrics.spatialGrouping.toFixed(2)),
    score: Number(layoutMetrics.score.toFixed(2)),
  };
};
