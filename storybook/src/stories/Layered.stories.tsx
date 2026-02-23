import type { Meta, StoryObj } from '@storybook/react';
import { type ComponentProps, type MutableRefObject } from 'react';

import 'reactflow/dist/style.css';
import { DiagramRepresentation} from '@eclipse-sirius/sirius-components-diagrams';
import { DiagramStoryWrapper } from './automatisation/updateDiagram';
import { FiveNodeDiagram, TwoNodeGroupDiagram, ThreeNodeGroupDiagram } from './automatisation/Scenario';
import type { LayoutOptions } from 'elkjs';

type StoryCustomArgs = { autoLayout?: boolean; direction: string; nodeNode: number; nodeNodeBetweenLayers: number; componentComponent: number; edgeNodeBetweenLayers: number; layStrat: string; nodePlacStrat: string; contentAlign: string; selectedNodes: string[]; nodeGroups: Record<string, string>;};
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
    layStrat: { control: 'select', options: ['NETWORK_SIMPLEX', 'LONGEST_PATH', 'LONGEST_PATH_SOURCE'] },
    nodePlacStrat: { control: 'select', options: ['NETWORK_SIMPLEX', 'LINEAR_SEGMENTS', 'SIMPLE', 'BRANDES_KOEPF'] },
    contentAlign: { control: 'select', options: ['V_TOP H_LEFT', 'V_TOP H_CENTER', 'V_TOP H_RIGHT', 'V_CENTER H_LEFT', 'V_CENTER H_CENTER', 'V_CENTER H_RIGHT', 'V_BOTTOM H_LEFT', 'V_BOTTOM H_CENTER', 'V_BOTTOM H_RIGHT'] },
    selectedNodes: { control: 'object' },
    nodeGroups: { control: 'object' },
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
      'elk.layering.strategy': args.layStrat,
      'elk.layered.nodePlacement.strategy': args.nodePlacStrat,
      'elk.contentAlignment': args.contentAlign,
    };
};

export const FiveNode: StoryObj<DiagramStoryArgs> = {
  args:{
    autoLayout: true,
    direction: "DOWN",
    nodeNode: 80,
    nodeNodeBetweenLayers: 80,
    componentComponent: 60,
    edgeNodeBetweenLayers: 80,
    layStrat: 'NETWORK_SIMPLEX',
    nodePlacStrat: 'NETWORK_SIMPLEX',
    contentAlign: 'V_TOP H_CENTER',
    selectedNodes: ['n1', 'n2', 'n3', 'n4'],
  },
  render: (args) => (
    <>
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={FiveNodeDiagram} 
          layoutOptions={getElkLayeredOptions(args)} 
      />
      
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={TwoNodeGroupDiagram} 
          layoutOptions={getElkLayeredOptions(args)} 
      />
    </>
  )
};

export const TwoNodeGroup: StoryObj<DiagramStoryArgs> = {
  args:{
    autoLayout: true,
    direction: "DOWN",
    nodeNode: 80,
    nodeNodeBetweenLayers: 80,
    componentComponent: 60,
    edgeNodeBetweenLayers: 80,
    layStrat: 'NETWORK_SIMPLEX',
    nodePlacStrat: 'NETWORK_SIMPLEX',
    contentAlign: 'V_TOP H_CENTER',
    selectedNodes: ['n1', 'n2', 'n3', 'n4'],
  },
  render: (args) => (
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={TwoNodeGroupDiagram} 
          layoutOptions={getElkLayeredOptions(args)} 
      />
  )
};

export const ThreeNodeGroup: StoryObj<DiagramStoryArgs> = {
  args:{
    autoLayout: true,
    direction: "DOWN",
    nodeNode: 80,
    nodeNodeBetweenLayers: 80,
    componentComponent: 60,
    edgeNodeBetweenLayers: 80,
    layStrat: 'NETWORK_SIMPLEX',
    nodePlacStrat: 'NETWORK_SIMPLEX',
    contentAlign: 'V_TOP H_CENTER',
    selectedNodes: ['n1', 'n2', 'n3', 'n4'],
  },
  render: (args) => (
      <DiagramStoryWrapper
          args={args}
          diagramGenerator={ThreeNodeGroupDiagram}
          layoutOptions={getElkLayeredOptions(args)}
      />
  )
};