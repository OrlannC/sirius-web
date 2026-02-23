import type { Meta, StoryObj } from '@storybook/react';
import { type ComponentProps, type MutableRefObject } from 'react';

import 'reactflow/dist/style.css';
import { DiagramRepresentation} from '@eclipse-sirius/sirius-components-diagrams';
import { DiagramStoryWrapper } from './automatisation/updateDiagram';
import { FiveNodeDiagram, ThreeNodeGroupDiagram, TwoNodeGroupDiagram } from './automatisation/Scenario';
import type { LayoutOptions } from 'elkjs';

type StoryCustomArgs = { autoLayout?: boolean; nodeNode: number; wedgeCrit: string; compactor: string; optiCrit: string; selectedNodes: string[]; nodeGroups: Record<string, string>; groupSpecificOptions?: Record<string, LayoutOptions>};
type DiagramStoryArgs = ComponentProps<typeof DiagramRepresentation> & StoryCustomArgs;

const meta = {
  title: 'Radial Algorithm',
  component: DiagramRepresentation,
  tags: ['autodocs'],
  argTypes: {
    autoLayout: { control: 'boolean' },
    nodeNode: {},
    wedgeCrit: { control: 'select', options: ['LEAF_NUMBER', 'NODE_SIZE'] },
    compactor: { control: 'select', options: ['NONE', 'RADIAL_COMPACTION', 'WEDGE_COMPACTION'] },
    optiCrit: { control: 'select', options: ['NONE', 'EDGE_LENGTH', 'EDGE_LENGTH_BY_POSITION ', 'CROSSING_MINIMIZATION_BY_POSITION'] },
    selectedNodes: { control: 'object' },
    nodeGroups: { control: 'object' },
    groupSpecificOptions: { control: 'object' },
  },
} satisfies Meta<DiagramStoryArgs>;

export default meta;

const getElkRadialOptions = (args: StoryCustomArgs): LayoutOptions => {
  return {
    'elk.algorithm': 'radial',
    'elk.spacing.nodeNode': String(args.nodeNode),
    'elk.radial.wedgeCriteria': args.wedgeCrit,
    'elk.radial.compactor': args.compactor,
    'elk.radial.optimizationCriteria': args.optiCrit,
  };
};

export const FiveNode: StoryObj<DiagramStoryArgs> = {
  args:{
    autoLayout: true,
    nodeNode: 80,
    wedgeCrit: 'NODE_SIZE',
    compactor: 'NONE',
    optiCrit: 'NONE',
    selectedNodes: ['n1', 'n2', 'n3', 'n4', 'n5'],
  },
  render: (args) => (
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={FiveNodeDiagram} 
          layoutOptions={getElkRadialOptions(args)} 
      />
  )
};

export const TwoNodeGroup: StoryObj<DiagramStoryArgs> = {
  args:{
    autoLayout: true,
    nodeNode: 80,
    wedgeCrit: 'NODE_SIZE',
    compactor: 'NONE',
    optiCrit: 'NONE',
    selectedNodes: [],
    nodeGroups: {
      'n1': "grp-1", 'n2': "grp-1", 'n3': "grp-1", 'n4': "grp-1", 'n5': "grp-1", 'n6': "grp-2", 'n7': "grp-2", 'n8': "grp-2", 'n9': "grp-2", 'n10': "grp-2"
    },
    groupSpecificOptions:{
      'grp-1':{
        'elk.algorithm': 'radial',
        'elk.spacing.nodeNode': '80',
      },
      'grp-2':{
        'elk.algorithm': 'layered',
        'elk.spacing.nodeNode': '80',
        'elk.direction': "DOWN",
      }
    }
  },
  render: (args) => (
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={TwoNodeGroupDiagram} 
          layoutOptions={getElkRadialOptions(args)} 
      />
  )
};

export const ThreeNodeGroup: StoryObj<DiagramStoryArgs> = {
  args:{
    autoLayout: true,
    nodeNode: 80,
    wedgeCrit: 'NODE_SIZE',
    compactor: 'NONE',
    optiCrit: 'NONE',
    selectedNodes: ['n1', 'n2', 'n3', 'n4', 'n5', 'n6'],
  },
  render: (args) => (
      <DiagramStoryWrapper
          args={args}
          diagramGenerator={ThreeNodeGroupDiagram}
          layoutOptions={getElkRadialOptions(args)}
      />
  )
};