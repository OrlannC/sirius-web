import type { Meta, StoryObj } from '@storybook/react';
import { type ComponentProps, type MutableRefObject } from 'react';

import 'reactflow/dist/style.css';
import { DiagramRepresentation} from '@eclipse-sirius/sirius-components-diagrams';
import { DiagramStoryWrapper } from './automatisation/updateDiagram';
import { FiveNodeDiagram, TwoNodeGroupDiagram, ThreeNodeGroupDiagram } from './automatisation/Scenario';
import type { LayoutOptions } from 'elkjs';

type StoryCustomArgs = { autoLayout?: boolean; direction: string; nodeNode: number; edgeNode: number; edgeRoutingMode: string; wheighting: string; selectedNodes: string[];};
type DiagramStoryArgs = ComponentProps<typeof DiagramRepresentation> & StoryCustomArgs;

const meta = {
  title: 'MrTree Algorithm',
  component: DiagramRepresentation,
  tags: ['autodocs'],
  argTypes: {
    autoLayout: { control: 'boolean' },
    direction: { control: 'select', options: ['DOWN', 'RIGHT','LEFT','UP'] },
    nodeNode: { },
    edgeNode: { },
    edgeRoutingMode: { control: 'select', options: ['AVOID_OVERLAP', 'MIDDLE_TO_MIDDLE', 'NONE'] },
    wheighting: { control: 'select', options: ['MODEL_ORDER', 'DESCENDANTS', 'FAN','CONSTRAINT'] },
    selectedNodes: { control: 'object' },
  },
} satisfies Meta<DiagramStoryArgs>;

export default meta;

const getElkMrTreeOptions = (args: StoryCustomArgs): LayoutOptions => {
  return {
    'elk.algorithm': 'mrtree',
    'elk.spacing.nodeNode': String(args.nodeNode),
    'elk.spacing.edgeNode': String(args.edgeNode),
    'elk.direction': args.direction,
    'elk.mrtree.weighting': args.wheighting,
    'elk.mrtree.edgeRoutingMode': args.edgeRoutingMode,
  };
};

export const FiveNode: StoryObj<DiagramStoryArgs> = {
  args:{
    autoLayout: true,
    direction: "DOWN",
    nodeNode: 80,
    edgeNode: 10,
    edgeRoutingMode: 'AVOID_OVERLAP',
    wheighting: 'MODEL_ORDER',
    selectedNodes: ['n1', 'n2', 'n3', 'n4', 'n5'],
  },
  render: (args) => (
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={FiveNodeDiagram} 
          layoutOptions={getElkMrTreeOptions(args)} 
      />
  )
};

export const TwoNodeGroup: StoryObj<DiagramStoryArgs> = {
  args:{
    autoLayout: true,
    direction: "DOWN",
    nodeNode: 80,
    edgeNode: 10,
    edgeRoutingMode: 'AVOID_OVERLAP',
    wheighting: 'MODEL_ORDER',
    selectedNodes: ['n1', 'n2', 'n3', 'n4', 'n5', 'n6', 'n7', 'n8', 'n9', 'n10'],
  },
  render: (args) => (
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={TwoNodeGroupDiagram} 
          layoutOptions={getElkMrTreeOptions(args)} 
      />
  )
};

export const ThreeNodeGroup: StoryObj<DiagramStoryArgs> = {
  args:{
    autoLayout: true,
    direction: "DOWN",
    nodeNode: 80,
    edgeNode: 10,
    edgeRoutingMode: 'AVOID_OVERLAP',
    wheighting: 'MODEL_ORDER',
    selectedNodes: ['n1', 'n2', 'n3', 'n4', 'n5', 'n6'],
  },
  render: (args) => (
      <DiagramStoryWrapper
          args={args}
          diagramGenerator={ThreeNodeGroupDiagram}
          layoutOptions={getElkMrTreeOptions(args)}
      />
  )
};