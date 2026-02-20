import { addEdge, addNode, buildDiagram, createMockClient } from "./DiagramConstructor";

export const FiveNodeDiagram = () => {
  let d = buildDiagram('First Diagram');
  d = addNode(d, { id: 'n1', label: 'Noeud 1-1', x: 0, y: 0, width: 120, height: 60 });
  d = addNode(d, { id: 'n2', label: 'Noeud 2-1', x: 150, y: 0, width: 120, height: 60 });
  d = addNode(d, { id: 'n3', label: 'Noeud 2-2', x: 0, y: 80, width: 120, height: 60 });
  d = addNode(d, { id: 'n4', label: 'Noeud 3-1', x: 300, y: 0, width: 120, height: 60 });
  d = addNode(d, { id: 'n5', label: 'Noeud 3-2', x: 150, y: 80, width: 120, height: 60 });
  d = addEdge(d, { id: 'e1', sourceId: 'n1', targetId: 'n2' });
  d = addEdge(d, { id: 'e2', sourceId: 'n1', targetId: 'n3' });
  d = addEdge(d, { id: 'e3', sourceId: 'n2', targetId: 'n4' });
  d = addEdge(d, { id: 'e4', sourceId: 'n2', targetId: 'n5' });
  return { diagram: d, client: createMockClient(d) };
};

export const TwoNodeGroupDiagram = () => {
  let d = buildDiagram('Second Diagram');
  d = addNode(d, { id: 'n1', label: 'Noeud 1-1', x: 0, y: 0, width: 120, height: 60 });
  d = addNode(d, { id: 'n2', label: 'Noeud 2-1', x: 150, y: 0, width: 120, height: 60 });
  d = addNode(d, { id: 'n3', label: 'Noeud 2-2', x: 0, y: 80, width: 120, height: 60 });
  d = addNode(d, { id: 'n4', label: 'Noeud 3-1', x: 300, y: 0, width: 120, height: 60 });
  d = addNode(d, { id: 'n5', label: 'Noeud 3-2', x: 150, y: 80, width: 120, height: 60 });
  d = addEdge(d, { id: 'e1', sourceId: 'n1', targetId: 'n2' });
  d = addEdge(d, { id: 'e2', sourceId: 'n1', targetId: 'n3' });
  d = addEdge(d, { id: 'e3', sourceId: 'n2', targetId: 'n4' });
  d = addEdge(d, { id: 'e4', sourceId: 'n2', targetId: 'n5' });

  d = addNode(d, { id: 'n6', label: 'Noeud 4-1', x: 0, y: 200, width: 120, height: 60 });
  d = addNode(d, { id: 'n7', label: 'Noeud 5-1', x: 150, y: 200, width: 120, height: 60 });
  d = addNode(d, { id: 'n8', label: 'Noeud 5-2', x: 0, y: 280, width: 120, height: 60 });
  d = addNode(d, { id: 'n9', label: 'Noeud 6-1', x: 300, y: 200, width: 120, height: 60 });
  d = addNode(d, { id: 'n10', label: 'Noeud 6-2', x: 150, y: 280, width: 120, height: 60 });
  d = addEdge(d, { id: 'e5', sourceId: 'n6', targetId: 'n7' });
  d = addEdge(d, { id: 'e6', sourceId: 'n6', targetId: 'n8' });
  d = addEdge(d, { id: 'e7', sourceId: 'n8', targetId: 'n9' });
  d = addEdge(d, { id: 'e8', sourceId: 'n8', targetId: 'n10' });
  return { diagram: d, client: createMockClient(d) };
}

export const ThreeNodeGroupDiagram = () => {
  let d = buildDiagram('Third Diagram');
  d = addNode(d, { id: 'n1', label: 'Noeud 1-1', x: 0, y: 0, width: 120, height: 60 });
  d = addNode(d, { id: 'n2', label: 'Noeud 1-2', x: 150, y: 0, width: 120, height: 60 });
  d = addEdge(d, { id: 'e1', sourceId: 'n1', targetId: 'n2' });

  d = addNode(d, { id: 'n3', label: 'Noeud 2-1', x: 0, y: 80, width: 120, height: 60 });
  d = addNode(d, { id: 'n4', label: 'Noeud 2-2', x: 150, y: 80, width: 120, height: 60 });
  d = addEdge(d, { id: 'e2', sourceId: 'n3', targetId: 'n4' });

  d = addNode(d, { id: 'n5', label: 'Noeud 3-1', x: 0, y: 160, width: 120, height: 60 });
  d = addNode(d, { id: 'n6', label: 'Noeud 3-2', x: 150, y: 160, width: 120, height: 60 });
  d = addEdge(d, { id: 'e3', sourceId: 'n5', targetId: 'n6' });

  return { diagram: d, client: createMockClient(d) };
};