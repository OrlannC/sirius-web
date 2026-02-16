/*******************************************************************************
 * Copyright (c) 2025 Obeo.
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
import { type Edge, type FitViewOptions, type Node, useReactFlow } from '@xyflow/react';
import { type EdgeData, type NodeData } from '@eclipse-sirius/sirius-components-diagrams';
import { type UseFitViewValue } from './useFitView.types';

export const useFitView = (): UseFitViewValue => {
  const { fitView: reactFlowFitView } = useReactFlow<Node<NodeData>, Edge<EdgeData>>();

  const fitView = (fitViewOptions?: FitViewOptions<Node<NodeData>>) => {
    // @ts-ignore
    if (!document.DEACTIVATE_FIT_VIEW_FOR_CYPRESS_TESTS) {
      reactFlowFitView(fitViewOptions);
    }
  };

  return {
    fitView,
  };
};