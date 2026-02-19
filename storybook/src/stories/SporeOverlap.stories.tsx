import type { Meta, StoryObj } from '@storybook/react';
import { type ComponentProps, type MutableRefObject } from 'react';

import 'reactflow/dist/style.css';
import { DiagramRepresentation} from '@eclipse-sirius/sirius-components-diagrams';
import { DiagramStoryWrapper } from './automatisation/updateDiagram';
import { fiveNodeDiagram, TwoNodeGroupDiagram } from './automatisation/Scenario';
import type { LayoutOptions } from 'elkjs';

type StoryCustomArgs = { autoLayout?: boolean; nodeNode: number; maxIterations: number; };
type DiagramStoryArgs = ComponentProps<typeof DiagramRepresentation> & StoryCustomArgs;

const meta = {
  title: 'Spore Overlap Algorithm',
  component: DiagramRepresentation,
  tags: ['autodocs'],
  argTypes: {
    autoLayout: { control: 'boolean' },
    nodeNode: { },
    maxIterations: { },
  },
} satisfies Meta<DiagramStoryArgs>;

export default meta;

const getElkSporeOverlapOptions = (args: StoryCustomArgs): LayoutOptions => {
    return {
        'elk.algorithm': 'sporeOverlap',
        'elk.spacing.nodeNode': String(args.nodeNode),
        'elk.overlapRemoval.maxIterations': String(args.maxIterations),
    };
};

export const fiveNode: StoryObj<DiagramStoryArgs> = {
  args:{
    autoLayout: false,
    nodeNode: 80,
    maxIterations: 64,
  },
  render: (args) => (
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={fiveNodeDiagram} 
          layoutOptions={getElkSporeOverlapOptions(args)} 
      />
  )
};

export const TwoNodeGroup: StoryObj<DiagramStoryArgs> = {
  args:{
    autoLayout: true,
    nodeNode: 80,
    maxIterations: 64,
  },
  render: (args) => (
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={TwoNodeGroupDiagram} 
          layoutOptions={getElkSporeOverlapOptions(args)} 
      />
  )
};