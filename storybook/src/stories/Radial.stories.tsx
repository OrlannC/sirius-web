import type { Meta, StoryObj } from '@storybook/react';
import { type ComponentProps } from 'react';
import './automatisation/Global.css'
import 'reactflow/dist/style.css';
import { DiagramRepresentation} from '@eclipse-sirius/sirius-components-diagrams';
import { DiagramStoryWrapper } from './automatisation/updateDiagram';
import { AllScenarioDiagram, BasiqueSiriusDiagram, FiveNodeDiagram, ThreeNodeGroupDiagram, TwoNodeGroupDiagram } from './automatisation/Scenario';
import type { LayoutOptions } from 'elkjs';

type StoryCustomArgs = { autoLayout?: boolean; nodeNode: number; wedgeCrit: string; compactor: string; optiCrit: string;};
type DiagramStoryArgs = ComponentProps<typeof DiagramRepresentation> & StoryCustomArgs;

const meta = {
  title: 'Radial algorithm',
  component: DiagramRepresentation,
  tags: ['autodocs'],
  argTypes: {
    autoLayout: { name: 'Auto-layout', control: 'boolean' },
    nodeNode: { name: 'Node spacing', control: 'number'},
    wedgeCrit: { name: 'Wedge criterion', control: 'select', options: ['LEAF_NUMBER', 'NODE_SIZE'] },
    compactor: { name: 'Compaction method', control: 'select', options: ['NONE', 'RADIAL_COMPACTION', 'WEDGE_COMPACTION'] },
    optiCrit: { name: 'Optimization criterion', control: 'select', options: ['NONE', 'EDGE_LENGTH', 'EDGE_LENGTH_BY_POSITION ', 'CROSSING_MINIMIZATION_BY_POSITION'] },
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

const listDiagram = AllScenarioDiagram();

export const AllScenarios: StoryObj<DiagramStoryArgs> = {
  name: 'All scenarios in one story',
  args:{
    autoLayout: true,
    nodeNode: 80,
    wedgeCrit: 'NODE_SIZE',
    compactor: 'NONE',
    optiCrit: 'NONE',
  },
  render: (args) => (
    <div className="conteneur">
      {listDiagram.map((generator, index) => (
          <DiagramStoryWrapper 
            key={index}
            args={args} 
            diagramGenerator={generator} 
            layoutOptions={getElkRadialOptions(args)}
          />
      ))}
    </div>
  )
};

export const Basic: StoryObj<DiagramStoryArgs> = {
  name: 'Scenario sirius studio example',
  args:{
    autoLayout: true,
    nodeNode: 80,
    wedgeCrit: 'NODE_SIZE',
    compactor: 'NONE',
    optiCrit: 'NONE',
  },
  render: (args) => (
    <div style={{width: '100vw', height: '100vh'}}>
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={BasiqueSiriusDiagram} 
          layoutOptions={getElkRadialOptions(args)} 
      />
    </div>
  )
};

export const FiveNodes: StoryObj<DiagramStoryArgs> = {
  name:'Scenario with five nodes',
  args:{
    autoLayout: true,
    nodeNode: 80,
    wedgeCrit: 'NODE_SIZE',
    compactor: 'NONE',
    optiCrit: 'NONE',
  },
  render: (args) => (
    <div style={{width: '100vw', height: '100vh'}}>
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={FiveNodeDiagram} 
          layoutOptions={getElkRadialOptions(args)} 
      />
    </div>
  )
};

export const TwoNodesGroups: StoryObj<DiagramStoryArgs> = {
  name:'Scenario with two groups of nodes',
  args:{
    autoLayout: true,
    nodeNode: 80,
    wedgeCrit: 'NODE_SIZE',
    compactor: 'NONE',
    optiCrit: 'NONE',
  },
  render: (args) => (
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={TwoNodeGroupDiagram} 
          layoutOptions={getElkRadialOptions(args)} 
      />
  )
};

export const ThreeNodesGroups: StoryObj<DiagramStoryArgs> = {
  name:'Scenario with three groups of nodes',
  args:{
    autoLayout: true,
    nodeNode: 80,
    wedgeCrit: 'NODE_SIZE',
    compactor: 'NONE',
    optiCrit: 'NONE',
  },
  render: (args) => (
    <div style={{width: '100vw', height: '100vh'}}>
      <DiagramStoryWrapper
          args={args}
          diagramGenerator={ThreeNodeGroupDiagram}
          layoutOptions={getElkRadialOptions(args)}
      />
    </div>
  )
};