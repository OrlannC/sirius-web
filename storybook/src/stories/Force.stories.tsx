import type { Meta, StoryObj } from '@storybook/react';
import { type ComponentProps, type MutableRefObject } from 'react';

import 'reactflow/dist/style.css';
import { DiagramRepresentation} from '@eclipse-sirius/sirius-components-diagrams';
import { DiagramStoryWrapper } from './automatisation/updateDiagram';
import { fiveNodeDiagram, TwoNodeGroupDiagram } from './automatisation/Scenario';
import type { LayoutOptions } from 'elkjs';

type StoryCustomArgs = { autoLayout?: boolean; nodeNode: number; iterations: number; };
type DiagramStoryArgs = ComponentProps<typeof DiagramRepresentation> & StoryCustomArgs;

const meta = {
  title: 'Force Algorithm',
  component: DiagramRepresentation,
  tags: ['autodocs'],
  argTypes: {
    autoLayout: { control: 'boolean' },
    nodeNode: { },
    iterations: { },
  },
} satisfies Meta<DiagramStoryArgs>;

export default meta;

const getElkForceOptions = (args: StoryCustomArgs): LayoutOptions => {
  return {
    'elk.algorithm': 'force',
    'elk.spacing.nodeNode': String(args.nodeNode),
    'elk.force.model': 'FRUCHTERMAN_REINGOLD',
    'elk.force.iterations': String(args.iterations),
  };
};

export const fiveNode: StoryObj<DiagramStoryArgs> = {
  args:{
    autoLayout: false,
    nodeNode: 80,
    iterations: 300,
  },
  render: (args) => (
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={fiveNodeDiagram} 
          layoutOptions={getElkForceOptions(args)} 
      />
  )
};

export const TwoNodeGroup: StoryObj<DiagramStoryArgs> = {
  args:{
    autoLayout: false,
    nodeNode: 80,
    iterations: 300,
  },
  render: (args) => (
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={TwoNodeGroupDiagram} 
          layoutOptions={getElkForceOptions(args)} 
      />
  )
};