/*******************************************************************************
 * Copyright (c) 2023, 2025 Obeo.
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

import { getCSSColor } from '@eclipse-sirius/sirius-components-core';
import { type Theme, useTheme } from '@mui/material/styles';
import { type Node, type NodeProps } from '@xyflow/react';
import { memo, useMemo } from 'react';
import { makeStyles } from 'tss-react/mui';

import { type ListNodeData } from './ListNode.types';
import { type NodeComponentsMap } from './NodeTypes';
import { Resizer } from './Resizer';
import { ActionsContainer, ConnectionCreationHandles, ConnectionHandles, ConnectionTargetHandle, Label, useConnectionLineNodeStyle, useConnectorNodeStyle, useDrop, useDropNodeStyle, useRefreshConnectionHandles } from '@eclipse-sirius/sirius-components-diagrams';

const listNodeStyle = (
  theme: Theme,
  style: React.CSSProperties,
  selected: boolean,
  hovered: boolean,
  faded: boolean
): React.CSSProperties => {
  const listNodeStyle: React.CSSProperties = {
    width: '100%',
    height: '100%',
    opacity: faded ? '0.4' : '',
    ...style,
    background: getCSSColor(String(style.background), theme),
    borderColor: getCSSColor(String(style.borderColor), theme),
  };
  if (selected || hovered) {
    listNodeStyle.outline = `${theme.palette.selected} solid 1px`;
  }

  return listNodeStyle;
};

const useStyles = makeStyles()((_) => ({
  labelAndAction: {
    display: 'grid',
    gridTemplateRows: '1fr',
    gridTemplateColumns: 'minmax(0, 1fr)',
  },
  label: {
    gridRow: 1,
    gridColumn: 1,
  },
}));

export const ListNode: NodeComponentsMap['listNode'] = memo(
  ({ data, id, selected, dragging }: NodeProps<Node<ListNodeData>>) => {
    const theme = useTheme();
    const { classes } = useStyles();
    const { onDrop, onDragOver } = useDrop();
    const { style: connectionFeedbackStyle } = useConnectorNodeStyle(id, data.nodeDescription.id);
    const { style: dropFeedbackStyle } = useDropNodeStyle(data.isDropNodeTarget, data.isDropNodeCandidate, dragging);
    const { style: connectionLineActiveNodeStyle } = useConnectionLineNodeStyle(data.connectionLinePositionOnNode);

    const nodeStyle = useMemo(
      () => listNodeStyle(theme, data.style, !!selected, data.isHovered, data.faded),
      [data.style, selected, data.isHovered, data.faded]
    );

    const handleOnDrop = (event: React.DragEvent) => {
      onDrop(event, id);
    };

    useRefreshConnectionHandles(id, data.connectionHandles);

    let actionsSection: JSX.Element | null = null;
    if (data.isHovered) {
      actionsSection = <ActionsContainer diagramElementId={id} />;
    }

    return (
      <>
        <Resizer data={data} selected={!!selected} />
        <div
          style={{
            ...nodeStyle,
            ...connectionFeedbackStyle,
            ...dropFeedbackStyle,
            ...connectionLineActiveNodeStyle,
          }}
          data-svg={data.isListChild ? 'rect:compartment' : 'rect'}
          onDragOver={onDragOver}
          onDrop={handleOnDrop}
          data-testid={`List - ${data?.insideLabel?.text}`}>
          <div className={classes.labelAndAction}>
            <div className={classes.label}>
              {data.insideLabel && <Label diagramElementId={id} label={data.insideLabel} faded={data.faded} />}
            </div>
            {actionsSection}
          </div>
          {selected ? <ConnectionCreationHandles nodeId={id} /> : null}
          <ConnectionTargetHandle nodeId={id} nodeDescription={data.nodeDescription} isHovered={data.isHovered} />
          <ConnectionHandles connectionHandles={data.connectionHandles} />
        </div>
      </>
    );
  }
);
