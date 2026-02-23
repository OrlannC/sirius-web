import type { Meta, StoryObj } from '@storybook/react';
import { type ComponentProps, type MutableRefObject } from 'react';

import 'reactflow/dist/style.css';
import { DiagramRepresentation} from '@eclipse-sirius/sirius-components-diagrams';
import { DiagramStoryWrapper } from './automatisation/updateDiagram';
import { FiveNodeDiagram, ThreeNodeGroupDiagram, TwoNodeGroupDiagram } from './automatisation/Scenario';
import type { LayoutOptions } from 'elkjs';

type StoryCustomArgs = { autoLayout?: boolean; nodeNode: number; maxIterations: number; selectedNodes: string[]; };
type DiagramStoryArgs = ComponentProps<typeof DiagramRepresentation> & StoryCustomArgs;

const meta = {
  title: 'Spore Overlap Algorithm',
  component: DiagramRepresentation,
  tags: ['autodocs'],
  argTypes: {
    autoLayout: { control: 'boolean' },
    nodeNode: { },
    maxIterations: { },
    selectedNodes: { control: 'object' },
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

export const FiveNode: StoryObj<DiagramStoryArgs> = {
  args:{
    autoLayout: true,
    nodeNode: 80,
    maxIterations: 64,
    selectedNodes: ['n1', 'n2', 'n3', 'n4', 'n5'],
  },
  render: (args) => (
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={FiveNodeDiagram} 
          layoutOptions={getElkSporeOverlapOptions(args)} 
      />
  )
};

export const TwoNodeGroup: StoryObj<DiagramStoryArgs> = {
  args:{
    autoLayout: true,
    nodeNode: 80,
    maxIterations: 64,
    selectedNodes: ['n1', 'n2', 'n3', 'n4', 'n5', 'n6', 'n7', 'n8', 'n9', 'n10'],
  },
  render: (args) => (
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={TwoNodeGroupDiagram} 
          layoutOptions={getElkSporeOverlapOptions(args)} 
      />
  )
};

export const ThreeNodeGroup: StoryObj<DiagramStoryArgs> = {
  args:{
    autoLayout: true,
    nodeNode: 80,
    maxIterations: 64,
    selectedNodes: ['n1', 'n2', 'n3', 'n4', 'n5', 'n6'],
  },
  render: (args) => (
      <DiagramStoryWrapper
          args={args}
          diagramGenerator={ThreeNodeGroupDiagram}
          layoutOptions={getElkSporeOverlapOptions(args)}
      />
  )
};