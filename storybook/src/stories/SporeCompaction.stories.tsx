import type { Meta, StoryObj } from '@storybook/react';
import { type ComponentProps, type MutableRefObject } from 'react';

import 'reactflow/dist/style.css';
import { DiagramRepresentation} from '@eclipse-sirius/sirius-components-diagrams';
import { DiagramStoryWrapper } from './automatisation/updateDiagram';
import { FiveNodeDiagram, ThreeNodeGroupDiagram, TwoNodeGroupDiagram } from './automatisation/Scenario';
import type { LayoutOptions } from 'elkjs';

type StoryCustomArgs = { autoLayout?: boolean; nodeNode: number; spanningTree: string; treeConstrution: string; };
type DiagramStoryArgs = ComponentProps<typeof DiagramRepresentation> & StoryCustomArgs;

const meta = {
  title: 'Spore Compaction Algorithm',
  component: DiagramRepresentation,
  tags: ['autodocs'],
  argTypes: {
    autoLayout: { control: 'boolean' },
    nodeNode: {},
    spanningTree: { control: 'select', options: ['CENTER_DISTANCE', 'CIRCLE_UNDERLAP', 'RECTANGLE_UNDERLAP', 'INVERTED_OVERLAP', 'MINIMUM_ROOT_DISTANCE'] },
    treeConstrution: { control: 'select', options: ['MINIMUM_SPANNING_TREE', 'MAXIMUM_SPANNING_TREE'] },
  },
} satisfies Meta<DiagramStoryArgs>;

export default meta;

const getElkSporeCompactionOptions = (args: StoryCustomArgs): LayoutOptions => {
    return {
      'elk.algorithm': 'sporeCompaction',
      'elk.spacing.nodeNode': String(args.nodeNode),
      'elk.processingOrder.spanningTreeCostFunction': args.spanningTree,
      'elk.processingOrder.treeConstruction': args.treeConstrution,
    };
};

export const fiveNode: StoryObj<DiagramStoryArgs> = {
  args:{
    autoLayout: true,
    nodeNode: 80,
    spanningTree: 'CIRCLE_UNDERLAP ',
    treeConstrution: 'MINIMUM_SPANNING_TREE',
  },
  render: (args) => (
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={FiveNodeDiagram} 
          layoutOptions={getElkSporeCompactionOptions(args)} 
      />
  )
};

export const TwoNodeGroup: StoryObj<DiagramStoryArgs> = {
  args:{
    autoLayout: true,
    nodeNode: 80,
    spanningTree: 'CIRCLE_UNDERLAP ',
    treeConstrution: 'MINIMUM_SPANNING_TREE',
  },
  render: (args) => (
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={TwoNodeGroupDiagram} 
          layoutOptions={getElkSporeCompactionOptions(args)} 
      />
  )
};

export const ThreeNodeGroup: StoryObj<DiagramStoryArgs> = {
  args:{
    autoLayout: true,
    nodeNode: 80,
    spanningTree: 'CIRCLE_UNDERLAP ',
    treeConstrution: 'MINIMUM_SPANNING_TREE',
  },
  render: (args) => (
      <DiagramStoryWrapper
          args={args}
          diagramGenerator={ThreeNodeGroupDiagram}
          layoutOptions={getElkSporeCompactionOptions(args)}
      />
  )
};