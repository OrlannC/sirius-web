/*******************************************************************************
 * Copyright (c) 2023, 2026 Obeo.
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

import type { ConnectionHandle, NodeData } from '@eclipse-sirius/sirius-components-diagrams';
import { type InternalNode, type Node, type NodePositionChange, Position, type XYPosition } from '@xyflow/react';
import { type NodeHandle, type NodeLookup } from '@xyflow/system';


export interface EdgeParameters {
  sourcePosition: Position;
  targetPosition: Position;
}

export type GetUpdatedConnectionHandlesParameters = (
  sourceNode: Node<NodeData>,
  targetNode: Node<NodeData>,
  sourcePosition: Position,
  targetPosition: Position,
  sourceHandle: string,
  targetHandle: string
) => GetUpdatedConnectionHandles;

export interface GetUpdatedConnectionHandles {
  sourceConnectionHandles: ConnectionHandle[];
  targetConnectionHandles: ConnectionHandle[];
}

export type GetEdgeParametersWhileMoving = (
  movingNode: NodePositionChange,
  source: InternalNode<Node<NodeData>>,
  target: InternalNode<Node<NodeData>>,
  nodeLookup: NodeLookup<InternalNode<Node<NodeData>>>,
  layoutDirection: string
) => EdgeParameters;

export type GetEdgeParameters = (
  source: InternalNode<Node<NodeData>>,
  target: InternalNode<Node<NodeData>>,
  nodeLookup: NodeLookup<InternalNode<Node<NodeData>>>,
  layoutDirection: string,
  bendingPoints: XYPosition[]
) => EdgeParameters;

export interface EdgeParameters {
  sourcePosition: Position;
  targetPosition: Position;
}

export type GetNodeCenter = (
  node: InternalNode<Node<NodeData>>,
  nodeLookup: NodeLookup<InternalNode<Node<NodeData>>>
) => XYPosition;

export type GetHandlePositionWithOffSet = (handleXYPosition: XYPosition, handlePosition: Position) => XYPosition;

export type GetHandleCoordinatesByPosition = (
  node: InternalNode<Node<NodeData>>,
  handlePosition: Position,
  handleId: string,
  calculateCustomNodeEdgeHandlePosition:
    | ((node: Node<NodeData>, handlePosition: Position, handle: NodeHandle) => XYPosition)
    | undefined
) => XYPosition;

export interface HandleCoordinates {
  x: number;
  y: number;
}

export type SegmentDirection = 'x' | 'y';
