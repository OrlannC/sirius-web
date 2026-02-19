import type { Meta, StoryObj } from '@storybook/react';
import { type ComponentProps, type MutableRefObject } from 'react';

import 'reactflow/dist/style.css';
import { DiagramRepresentation} from '@eclipse-sirius/sirius-components-diagrams';
import { DiagramStoryWrapper } from './automatisation/updateDiagram';
import { fiveNodeDiagram, TwoNodeGroupDiagram } from './automatisation/Scenario';
import type { LayoutOptions } from 'elkjs';

type StoryCustomArgs = { autoLayout?: boolean; direction: string; nodeNode: number; nodeNodeBetweenLayers: number; componentComponent: number; edgeNodeBetweenLayers: number;};
type DiagramStoryArgs = ComponentProps<typeof DiagramRepresentation> & StoryCustomArgs;

const meta = {
  title: 'Layered Algorithm',
  component: DiagramRepresentation,
  tags: ['autodocs'],
  argTypes: {
    autoLayout: { control: 'boolean' },
    direction: { control: 'select', options: ['DOWN', 'RIGHT','LEFT','UP'] },
    nodeNode: { },
    nodeNodeBetweenLayers: { },
    componentComponent: { },
    edgeNodeBetweenLayers: { },
  },
} satisfies Meta<DiagramStoryArgs>;

export default meta;

const getElkLayeredOptions = (args: StoryCustomArgs): LayoutOptions => {
    return {
      'elk.algorithm': 'layered',
      'elk.layered.spacing.nodeNodeBetweenLayers': String(args.nodeNodeBetweenLayers),
      'elk.layered.spacing.edgeNodeBetweenLayers': String(args.edgeNodeBetweenLayers),
      'elk.spacing.componentComponent': String(args.componentComponent),
      'elk.spacing.nodeNode': String(args.nodeNode),
      'elk.direction': args.direction,
      'elk.layering.strategy': 'NETWORK_SIMPLEX',
      'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
    };
};

export const fiveNode: StoryObj<DiagramStoryArgs> = {
  args:{
    autoLayout: true,
    direction: "DOWN",
    nodeNode: 80,
    nodeNodeBetweenLayers: 80,
    componentComponent: 60,
    edgeNodeBetweenLayers: 80,
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
    direction: "DOWN",
    nodeNode: 80,
    nodeNodeBetweenLayers: 80,
    componentComponent: 60,
    edgeNodeBetweenLayers: 80,
  },
  render: (args) => (
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={TwoNodeGroupDiagram} 
          layoutOptions={getElkLayeredOptions(args)} 
      />
  )
};