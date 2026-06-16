/*******************************************************************************
 * Copyright (c) 2024, 2026 Obeo.
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
import { Edge, Node } from '@xyflow/react';
import { LayoutOptions } from 'elkjs/lib/elk-api';
import { EdgeData, NodeData } from '../../DiagramRenderer.types';
import { RawDiagram } from '../layout.types';
import { GQLLayoutGroup } from './useLayoutGroups.types';

const getParentPosition = (node: Node<NodeData>, allNodes: Node<NodeData>[]): [number, number] => {
  if (node.parentId) {
    const parent = allNodes.find((n) => n.id === node.parentId);
    if (parent) {
      return getParentPosition(parent, allNodes);
    }
  }
  return [node.position.x, node.position.y];
};

export const useELKOnLayoutGroups = async (
  finalNodes: Node<NodeData>[],
  finalEdges: Edge<EdgeData>[],
  groups: GQLLayoutGroup[],
  layoutOptions: LayoutOptions,
  forceGlobalLayout: boolean,
  elkLayout: (nodes: Node<NodeData>[], edges: Edge<EdgeData>[], options: LayoutOptions) => Promise<RawDiagram>
): Promise<Node<NodeData>[]> => {
  const macroNodes: Node<NodeData>[] = [];
  const macroEdges: Edge<EdgeData>[] = [];
  const groupLayouts = new Map<string, { nodes: Node<NodeData>[]; minX: number; minY: number }>();

  for (let i = 0; i < groups.length; i++) {
    const group = groups[i];
    if (!group || !group.nodeIds || group.nodeIds.length === 0) continue;
    const groupId = group.id || `macro-group-${i}`;

    const nodesToLayout = finalNodes.filter((node) => group.nodeIds.includes(node.id));
    const edgesToLayout = finalEdges.filter(
      (edge) => group.nodeIds.includes(edge.source) && group.nodeIds.includes(edge.target)
    );

    const groupLayoutOptions = forceGlobalLayout
      ? layoutOptions
      : group.layoutConfiguration?.layoutOptions || layoutOptions;

    const laidOutGroup = await elkLayout(nodesToLayout, edgesToLayout, groupLayoutOptions);

    let minX = Infinity,
      minY = Infinity;
    let maxX = -Infinity,
      maxY = -Infinity;

    laidOutGroup.nodes.forEach((node) => {
      if (node.position.x < minX) minX = node.position.x;
      if (node.position.y < minY) minY = node.position.y;
      const nodeRight = node.position.x + (node.width || 0);
      const nodeBottom = node.position.y + (node.height || 0);
      if (nodeRight > maxX) maxX = nodeRight;
      if (nodeBottom > maxY) maxY = nodeBottom;
    });

    const groupWidth = maxX !== -Infinity ? maxX - minX : 0;
    const groupHeight = maxY !== -Infinity ? maxY - minY : 0;

    groupLayouts.set(groupId, { nodes: laidOutGroup.nodes, minX, minY });

    macroNodes.push({
      id: groupId,
      position: { x: 0, y: 0 },
      width: groupWidth,
      height: groupHeight,
      data: {
        targetObjectId: '',
        targetObjectKind: '',
        targetObjectLabel: '',
        descriptionId: '',
        insideLabel: null,
        faded: false,
        pinned: false,
        nodeDescription: {
          id: '',
          borderNodeDescriptionIds: [],
          childNodeDescriptionIds: [],
          userResizable: 'NONE',
          keepAspectRatio: false,
        },
        minComputedWidth: null,
        minComputedHeight: null,
        moving: false,
        decorators: [],
        defaultWidth: groupWidth,
        defaultHeight: groupHeight,
        isBorderNode: false,
        borderNodePosition: null,
        labelEditable: false,
        outsideLabels: {},
        deletable: false,
        style: {},
        connectionHandles: [],
        isNew: false,
        resizedByUser: false,
        movedByUser: false,
        isListChild: false,
        isDraggedNode: false,
        isDropNodeTarget: false,
        isDragNodeSource: false,
        isDropNodeCandidate: false,
        isHovered: false,
        isLastNodeSelected: false,
        connectionLinePositionOnNode: 'none',
        nodeAppearanceData: {
          customizedStyleProperties: [],
          gqlStyle: {
            __typename: 'GQLNodeStyle',
            childrenLayoutStrategy: {
              __typename: 'FreeFormLayoutStrategy',
              kind: 'FreeForm',
            },
          },
        },
      },
    });
  }

  finalEdges.forEach((edge) => {
    const sourceGroup = groups.find((g) => g.nodeIds?.includes(edge.source));
    const targetGroup = groups.find((g) => g.nodeIds?.includes(edge.target));

    if (sourceGroup && targetGroup && sourceGroup.id !== targetGroup.id) {
      const sourceGroupId = sourceGroup.id || `macro-group-${groups.indexOf(sourceGroup)}`;
      const targetGroupId = targetGroup.id || `macro-group-${groups.indexOf(targetGroup)}`;

      macroEdges.push({
        id: `macro-edge-${edge.id}`,
        source: sourceGroupId,
        target: targetGroupId,
        data: {
          targetObjectId: '',
          targetObjectKind: '',
          targetObjectLabel: '',
          descriptionId: '',
          label: null,
          centerLabelEditable: false,
          editable: false,
          deletable: false,
          isHovered: false,
          relativePositionBendingPoints: [],
          edgeAppearanceData: {
            customizedStyleProperties: [],
            gqlStyle: {
              size: 1,
              lineStyle: 'SOLID',
              sourceArrow: 'NONE',
              targetArrow: 'NONE',
              edgeType: 'Straight',
              color: '#000000',
            },
          },
          bendingPoints: [],
          faded: false,
        },
      });
    }
  });

  const laidOutMacro = await elkLayout(macroNodes, macroEdges, layoutOptions);

  finalNodes = finalNodes.map((node) => {
    const group = groups.find((g) => g.nodeIds?.includes(node.id));
    if (group) {
      const groupId = group.id || '';
      const macroNode = laidOutMacro.nodes.find((mn) => mn.id === groupId);
      const groupData = groupLayouts.get(groupId);

      if (macroNode && groupData) {
        const laidOutNode = groupData.nodes.find((n) => n.id === node.id);
        if (laidOutNode) {
          return {
            ...node,
            position: {
              x: macroNode.position.x + (laidOutNode.position.x - groupData.minX),
              y: macroNode.position.y + (laidOutNode.position.y - groupData.minY),
            },
            width: laidOutNode.width ?? node.width,
            height: laidOutNode.height ?? node.height,
          };
        }
      }
    }
    return node;
  });
  return finalNodes;
};
