import type { Meta, StoryObj } from '@storybook/react';
import { type ComponentProps, type MutableRefObject } from 'react';

import 'reactflow/dist/style.css';
import { DiagramRepresentation} from '@eclipse-sirius/sirius-components-diagrams';
import { DiagramStoryWrapper } from './automatisation/updateDiagram';
import { fiveNodeDiagram, TwoNodeGroupDiagram } from './automatisation/Scenario';
import type { LayoutOptions } from 'elkjs';

type StoryCustomArgs = { autoLayout?: boolean; nodeNode: number;};
type DiagramStoryArgs = ComponentProps<typeof DiagramRepresentation> & StoryCustomArgs;

const meta = {
  title: 'Spore Compaction Algorithm',
  component: DiagramRepresentation,
  tags: ['autodocs'],
  argTypes: {
    autoLayout: { control: 'boolean' },
    nodeNode: {},
  },
} satisfies Meta<DiagramStoryArgs>;

export default meta;

const getElkSporeCompactionOptions = (args: StoryCustomArgs): LayoutOptions => {
    return {
        'elk.algorithm': 'sporeCompaction',
        'elk.spacing.nodeNode': String(args.nodeNode),
        'elk.processingOrder.spanningTreeCostFunction': 'CIRCLE_UNDERLAP',
    };
};

export const fiveNode: StoryObj<DiagramStoryArgs> = {
  args:{
    autoLayout: false,
    nodeNode: 80,
  },
  render: (args) => (
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={fiveNodeDiagram} 
          layoutOptions={getElkSporeCompactionOptions(args)} 
      />
  )
};

export const TwoNodeGroup: StoryObj<DiagramStoryArgs> = {
  args:{
    autoLayout: true,
    nodeNode: 80,
  },
  render: (args) => (
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={TwoNodeGroupDiagram} 
          layoutOptions={getElkSporeCompactionOptions(args)} 
      />
  )
};