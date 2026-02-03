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
 * Obeo - initial API and implementation
 *******************************************************************************/
import AccountTreeIcon from '@mui/icons-material/AccountTree';
import ViewComfyIcon from '@mui/icons-material/ViewComfy';
import { LayoutOptions } from 'elkjs/lib/elk-api';
import { useTranslation } from 'react-i18next';
import { useDiagramDescription } from '../../../contexts/useDiagramDescription';
import { LayoutConfiguration, UseLayoutConfigurationsValue } from './useLayoutConfigurations.types';

const elkLayeredOptions = (direction: string): LayoutOptions => ({
  'elk.algorithm': 'layered',
  'elk.spacing.nodeNode': '80',
  'elk.spacing.componentComponent': '60',
  'elk.layered.spacing.edgeNodeBetweenLayers': '80',
  'elk.direction': `${direction}`,
  'elk.layered.layering.strategy': 'NETWORK_SIMPLEX',
  'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
});

const elkRectPackingOptions: LayoutOptions = {
  'elk.algorithm': 'rectpacking',
  'elk.spacing.nodeNode': '50',
  'elk.rectpacking.trybox': 'true',
  'elk.rectpacking.widthApproximation.targetWidth': '1',
  'elk.contentAlignment': 'V_TOP H_CENTER',
};

const elkStressOptions: LayoutOptions = {
  'elk.algorithm': 'stress',
};

const elkTreeOptions = (direction: string): LayoutOptions => ({
  'elk.algorithm': 'mrtree',
  'elk.spacing.nodeNode': '80',
  'elk.direction': `${direction}`,
  'elk.mrtree.weighting': 'MODEL_ORDER',
  'elk.mrtree.edgeRoutingMode': 'AVOID_OVERLAP',
});

const elkRadialOptions: LayoutOptions = {
  'elk.algorithm': 'radial',
  'elk.spacing.nodeNode': '50',
  'elk.radial.wedgeCriteria': 'NODE_SIZE',
  'elk.radial.compactor': 'NONE',
};

const elkForceOptions: LayoutOptions = {
  'elk.algorithm': 'force',
  'elk.spacing.nodeNode': '50',
  'elk.force.model': 'FRUCHTERMAN_REINGOLD',
  'elk.force.iterations': '300',
};

const elkSporeOverlapOptions: LayoutOptions = {
  'elk.algorithm': 'sporeOverlap',
  'elk.spacing.nodeNode': '50',
  'elk.overlapRemoval.maxIterations': '64',
};

const elkSporeCompactionOptions: LayoutOptions = {
  'elk.algorithm': 'sporeCompaction',
  'elk.spacing.nodeNode': '50',
  'elk.processingOrder.spanningTreeCostFunction': 'CIRCLE_UNDERLAP',
};

const elkRandomOptions: LayoutOptions = {
  'elk.algorithm': 'random',
  'elk.spacing.nodeNode': '50',
};

const elkBoxOptions: LayoutOptions = {
  'elk.algorithm': 'box',
  'elk.contentAlignment': 'V_CENTER H_CENTER',
  'elk.spacing.nodeNode': '50',
  'elk.box.packingMode': 'SIMPLE',
};

export const useLayoutConfigurations = (): UseLayoutConfigurationsValue => {
  const { diagramDescription } = useDiagramDescription();
  const { t } = useTranslation('sirius-components-diagrams', { keyPrefix: 'useLayoutConfigurations' });

  const layoutConfigurationWithLayeredAlgorithm: LayoutConfiguration = {
    id: 'elk-layered',
    label: t('arrangeAllLayered'),
    icon: <AccountTreeIcon fontSize="small" />,
    layoutOptions: elkLayeredOptions(diagramDescription.arrangeLayoutDirection),
    configurableOptions: [
      { key: 'elk.spacing.nodeNode', label: 'nodeSpacing' },
      { key: 'elk.spacing.componentComponent', label: 'componentComponentSpacing' },
      { key: 'elk.layered.spacing.edgeNodeBetweenLayers', label: 'edgeNodeBetweenLayersSpacing' },
      { key: 'elk.layered.layering.strategy', label: 'layeringStrategy' },
      { key: 'elk.layered.nodePlacement.strategy', label: 'nodePlacementStrategy' },
    ],
  };
  const layoutConfigurationWithRectPackingAlgorithm: LayoutConfiguration = {
    id: 'elk-rect-packing',
    label: t('arrangeAllRectPacking'),
    icon: <ViewComfyIcon fontSize="small" />,
    layoutOptions: elkRectPackingOptions,
    configurableOptions: [
      { key: 'elk.spacing.nodeNode', label: 'nodeSpacing' },
      { key: 'elk.contentAlignment', label: 'contentAlignment' },
    ],
  };

  const layoutConfigurationWithStressAlgorithm: LayoutConfiguration = {
    id: 'elk-stress',
    label: 'Stress',
    icon: <ViewComfyIcon fontSize="small" />,
    layoutOptions: elkStressOptions,
  };

  const layoutConfigurationWithMrTreeAlgorithm: LayoutConfiguration = {
    id: 'elk-tree',
    label: 'MrTree',
    icon: <ViewComfyIcon fontSize="small" />,
    layoutOptions: elkTreeOptions(diagramDescription.arrangeLayoutDirection),
    configurableOptions: [
      { key: 'elk.spacing.nodeNode', label: 'nodeSpacing' },
      { key: 'elk.mrtree.weighting', label: 'weighting' },
    ],
  };

  const layoutConfigurationWithRadialAlgorithm: LayoutConfiguration = {
    id: 'elk-radial',
    label: 'Radial',
    icon: <ViewComfyIcon fontSize="small" />,
    layoutOptions: elkRadialOptions,
    configurableOptions: [
      { key: 'elk.spacing.nodeNode', label: 'nodeSpacing' },
      { key: 'elk.radial.wedgeCriteria', label: 'wedgeCriteria' },
      { key: 'elk.radial.compactor', label: 'compactor' },
    ],
  };

  const layoutConfigurationWithForceAlgorithm: LayoutConfiguration = {
    id: 'elk-force',
    label: 'Force',
    icon: <ViewComfyIcon fontSize="small" />,
    layoutOptions: elkForceOptions,
    configurableOptions: [
      { key: 'elk.spacing.nodeNode', label: 'nodeSpacing' },
      { key: 'elk.force.model', label: 'model' },
      { key: 'elk.force.iterations', label: 'iterations' },
    ],
  };

  const layoutConfigurationWithSporeOverlapAlgorithm: LayoutConfiguration = {
    id: 'elk-spore-overlap',
    label: 'SporeOverlap',
    icon: <ViewComfyIcon fontSize="small" />,
    layoutOptions: elkSporeOverlapOptions,
    configurableOptions: [
      { key: 'elk.spacing.nodeNode', label: 'nodeSpacing' },
      { key: 'elk.overlapRemoval.maxIterations', label: 'maxIterations' },
    ],
  };

  const layoutConfigurationWithSporeCompactionAlgorithm: LayoutConfiguration = {
    id: 'elk-spore-compaction',
    label: 'SporeCompaction',
    icon: <ViewComfyIcon fontSize="small" />,
    layoutOptions: elkSporeCompactionOptions,
    configurableOptions: [
      { key: 'elk.spacing.nodeNode', label: 'nodeSpacing' },
      { key: 'elk.processingOrder.spanningTreeCostFunction', label: 'spanningTreeCostFunction' },
    ],
  };

  const layoutConfigurationWithRandomAlgorithm: LayoutConfiguration = {
    id: 'elk-random',
    label: 'Random',
    icon: <ViewComfyIcon fontSize="small" />,
    layoutOptions: elkRandomOptions,
    configurableOptions: [{ key: 'elk.spacing.nodeNode', label: 'nodeSpacing' }],
  };

  const layoutConfigurationWithBoxAlgorithm: LayoutConfiguration = {
    id: 'elk-box',
    label: 'Box',
    icon: <ViewComfyIcon fontSize="small" />,
    layoutOptions: elkBoxOptions,
    configurableOptions: [
      { key: 'elk.contentAlignment', label: 'contentAlignment' },
      { key: 'elk.spacing.nodeNode', label: 'nodeSpacing' },
      { key: 'elk.box.packingMode', label: 'packingMode' },
    ],
  };

  return {
    layoutConfigurations: [
      layoutConfigurationWithLayeredAlgorithm,
      layoutConfigurationWithRectPackingAlgorithm,
      layoutConfigurationWithStressAlgorithm,
      layoutConfigurationWithMrTreeAlgorithm,
      layoutConfigurationWithRadialAlgorithm,
      layoutConfigurationWithForceAlgorithm,
      layoutConfigurationWithSporeOverlapAlgorithm,
      layoutConfigurationWithSporeCompactionAlgorithm,
      layoutConfigurationWithRandomAlgorithm,
      layoutConfigurationWithBoxAlgorithm,
    ],
  };
};
