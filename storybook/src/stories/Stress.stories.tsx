import type { Meta, StoryObj } from '@storybook/react';
import { type ComponentProps, type MutableRefObject } from 'react';

import 'reactflow/dist/style.css';
import { DiagramRepresentation} from '@eclipse-sirius/sirius-components-diagrams';
import { DiagramStoryWrapper } from './automatisation/updateDiagram';
import { FiveNodeDiagram, ThreeNodeGroupDiagram, TwoNodeGroupDiagram } from './automatisation/Scenario';
import type { LayoutOptions } from 'elkjs';

type StoryCustomArgs = { autoLayout?: boolean; desiredEdgeLength: number; dimension: string; };
type DiagramStoryArgs = ComponentProps<typeof DiagramRepresentation> & StoryCustomArgs;

const meta = {
  title: 'Stress Algorithm',
  component: DiagramRepresentation,
  tags: ['autodocs'],
  argTypes: {
    autoLayout: { control: 'boolean' },
    desiredEdgeLength: { },
    dimension: { control: 'select', options: ['XY', 'X', 'Y'] },
  },
} satisfies Meta<DiagramStoryArgs>;

export default meta;

const getElkStressOptions = (args: StoryCustomArgs): LayoutOptions => {
    return {
      'elk.algorithm': 'stress',
      'elk.stress.desiredEdgeLength': String(args.desiredEdgeLength),
      'elk.stress.dimension': args.dimension,
    };
};

export const fiveNode: StoryObj<DiagramStoryArgs> = {
  args:{
    autoLayout: true,
    desiredEdgeLength: 100.0,
    dimension: 'XY',
  },
  render: (args) => (
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={FiveNodeDiagram} 
          layoutOptions={getElkStressOptions(args)} 
      />
  )
};

export const TwoNodeGroup: StoryObj<DiagramStoryArgs> = {
  args:{
    autoLayout: true,
    desiredEdgeLength: 100.0,
    dimension: 'XY',
  },
  render: (args) => (
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={TwoNodeGroupDiagram} 
          layoutOptions={getElkStressOptions(args)} 
      />
  )
};

export const ThreeNodeGroup: StoryObj<DiagramStoryArgs> = {
  args:{
    autoLayout: true,
    desiredEdgeLength: 100.0,
    dimension: 'XY',
  },
  render: (args) => (
      <DiagramStoryWrapper
          args={args}
          diagramGenerator={ThreeNodeGroupDiagram}
          layoutOptions={getElkStressOptions(args)}
      />
  )
};