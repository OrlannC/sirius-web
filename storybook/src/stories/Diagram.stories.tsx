import type { Meta, StoryObj } from '@storybook/react';
import { type ComponentProps, type MutableRefObject } from 'react';

import 'reactflow/dist/style.css';
import { DiagramRepresentation} from '@eclipse-sirius/sirius-components-diagrams';
import { DiagramStoryWrapper } from './automatisation/updateDiagram';
import { fiveNodeDiagram, TwoNodeGroupDiagram } from './automatisation/Scenario';
import type { LayoutOptions } from 'elkjs';

type StoryCustomArgs = { autoLayout?: boolean; algorithm: string; directionL: string; directionT: string; nodeNode: number; nodeNodeBetweenLayers: number; componentComponent: number; edgeNodeBetweenLayers: number; iterations: number; maxIterations: number;};
type DiagramStoryArgs = ComponentProps<typeof DiagramRepresentation> & StoryCustomArgs;

const meta = {
  title: 'DiagramRepresentation',
  component: DiagramRepresentation,
  argTypes: {
    autoLayout: { control: 'boolean' },
    algorithm: { control: 'select', options: ['layered','rectpacking','stress','mrtree','radial','force','sporeOverlap','sporeCompaction'] },
    directionL: { control: 'select', if: { arg: 'algorithm', eq: 'layered' }, options: ['DOWN', 'RIGHT','LEFT','UP'] },
    directionT: { control: 'select', if: { arg: 'algorithm', eq: 'mrtree' }, options: ['DOWN', 'RIGHT','LEFT','UP'] },
    nodeNode: { },
    nodeNodeBetweenLayers: { if: { arg: 'algorithm', eq: 'layered' } },
    componentComponent: { if: { arg: 'algorithm', eq: 'layered' } },
    edgeNodeBetweenLayers: { if: { arg: 'algorithm', eq: 'layered' } },
    iterations: { if: { arg: 'algorithm', eq: 'force' } },
    maxIterations: { if: { arg: 'algorithm', eq: 'sporeOverlap' } },
  },
} satisfies Meta<DiagramStoryArgs>;

export default meta;

const getElkLayeredOptions = (args: StoryCustomArgs): LayoutOptions => {
  const elkLayeredOptions : LayoutOptions = {
    'elk.algorithm': 'layered',
    'elk.layered.spacing.nodeNodeBetweenLayers': String(args.nodeNodeBetweenLayers),
    'elk.layered.spacing.edgeNodeBetweenLayers': String(args.edgeNodeBetweenLayers),
    'elk.spacing.componentComponent': String(args.componentComponent),
    'elk.spacing.nodeNode': String(args.nodeNode),
    'elk.direction': args.directionL,
    'elk.layering.strategy': 'NETWORK_SIMPLEX',
    'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
  };

  const elkRectPackingOptions: LayoutOptions = {
    'elk.algorithm': 'rectpacking',
    'elk.spacing.nodeNode': String(args.nodeNode),
    'elk.rectpacking.trybox': 'true',
    'widthApproximation.targetWidth': '1',
    'elk.contentAlignment': 'V_TOP H_CENTER',
  };

  const elkStressOptions: LayoutOptions = {
    'elk.algorithm': 'stress',
  };

  const elkTreeOptions: LayoutOptions = {
    'elk.algorithm': 'mrtree',
    'elk.spacing.nodeNode': String(args.nodeNode),
    'elk.direction': args.directionT,
    'elk.mrtree.weighting': 'MODEL_ORDER',
    'elk.mrtree.edgeRoutingMode': 'AVOID_OVERLAP',
  };

  const elkRadialOptions: LayoutOptions = {
    'elk.algorithm': 'radial',
    'elk.spacing.nodeNode': String(args.nodeNode),
    'elk.radial.wedgeCriteria': 'NODE_SIZE',
    'elk.radial.compactor': 'NONE',
  };

  const elkForceOptions: LayoutOptions = {
    'elk.algorithm': 'force',
    'elk.spacing.nodeNode': String(args.nodeNode),
    'elk.force.model': 'FRUCHTERMAN_REINGOLD',
    'elk.force.iterations': String(args.iterations),
  };

  const elkSporeOverlapOptions: LayoutOptions = {
    'elk.algorithm': 'sporeOverlap',
    'elk.spacing.nodeNode': String(args.nodeNode),
    'elk.overlapRemoval.maxIterations': String(args.maxIterations),
  };

  const elkSporeCompactionOptions: LayoutOptions = {
    'elk.algorithm': 'sporeCompaction',
    'elk.spacing.nodeNode': String(args.nodeNode),
    'elk.processingOrder.spanningTreeCostFunction': 'CIRCLE_UNDERLAP',
  };

  const getLayoutOptions = (algorithm: string): LayoutOptions => {
    switch(algorithm) {
      case 'rectpacking': return elkRectPackingOptions;
      case 'stress': return elkStressOptions;
      case 'mrtree': return elkTreeOptions;
      case 'radial': return elkRadialOptions;
      case 'force': return elkForceOptions;
      case 'sporeOverlap': return elkSporeOverlapOptions;  
      case 'sporeCompaction': return elkSporeCompactionOptions;
      default: return elkLayeredOptions;
    }
  };

  return getLayoutOptions(args.algorithm);
};

export const fiveNode: StoryObj<DiagramStoryArgs> = {
  args:{
    autoLayout: true,
    algorithm: "layered",
    directionL: "DOWN",
    directionT: "DOWN",
    nodeNode: 80,
    nodeNodeBetweenLayers: 80,
    componentComponent: 60,
    edgeNodeBetweenLayers: 20,
    iterations: 300,
    maxIterations: 64,
  },
  render: (args) => (
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={fiveNodeDiagram} 
          layoutOptions={getElkLayeredOptions(args)} 
      />
  )
};

export const TwoNodeGroup: StoryObj<DiagramStoryArgs> = {
  args:{
    autoLayout: false,
    algorithm: "layered",
    directionL: "DOWN",
    directionT: "DOWN",
    nodeNode: 80,
    nodeNodeBetweenLayers: 80,
    componentComponent: 60,
    edgeNodeBetweenLayers: 80,
    iterations: 300,
    maxIterations: 64,
  },
  render: (args) => (
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={TwoNodeGroupDiagram} 
          layoutOptions={getElkLayeredOptions(args)} 
      />
  )
};