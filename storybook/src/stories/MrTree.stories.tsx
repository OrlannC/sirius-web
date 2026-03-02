import type { Meta, StoryObj } from '@storybook/react';
import { type ComponentProps } from 'react';
import './automatisation/Global.css'
import 'reactflow/dist/style.css';
import { DiagramRepresentation} from '@eclipse-sirius/sirius-components-diagrams';
import { DiagramStoryWrapper } from './automatisation/updateDiagram';
import { FiveNodeDiagram, TwoNodeGroupDiagram, ThreeNodeGroupDiagram, AllScenarioDiagram, BasiqueSiriusDiagram } from './automatisation/Scenario';
import type { LayoutOptions } from 'elkjs';

type StoryCustomArgs = { autoLayout?: boolean; direction: string; nodeNode: number; edgeNode: number; edgeRoutingMode: string; wheighting: string;};
type DiagramStoryArgs = ComponentProps<typeof DiagramRepresentation> & StoryCustomArgs;

const meta = {
  title: 'MrTree algorithm',
  component: DiagramRepresentation,
  tags: ['autodocs'],
  argTypes: {
    autoLayout: { name: 'Auto-layout', control: 'boolean' },
    direction: { name: 'Layout direction', control: 'select', options: ['DOWN', 'RIGHT','LEFT','UP'] },
    nodeNode: { name: 'Node spacing', control: 'number' },
    edgeNode: { name: 'Edge spacing', control: 'number' },
    edgeRoutingMode: { name: 'Edge routing mode', control: 'select', options: ['AVOID_OVERLAP', 'MIDDLE_TO_MIDDLE', 'NONE'] },
    wheighting: { name: 'Weighting method', control: 'select', options: ['MODEL_ORDER', 'DESCENDANTS', 'FAN','CONSTRAINT'] },
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

const listDiagram = AllScenarioDiagram();

export const AllScenarios: StoryObj<DiagramStoryArgs> = {
  name: 'All scenarios in one story',
  args:{
    autoLayout: true,
    direction: "DOWN",
    nodeNode: 80,
    edgeNode: 10,
    edgeRoutingMode: 'AVOID_OVERLAP',
    wheighting: 'MODEL_ORDER',
  },
  render: (args) => (
    <div className="conteneur">
      {listDiagram.map((generator, index) => (
          <DiagramStoryWrapper 
            key={index}
            args={args} 
            diagramGenerator={generator} 
            layoutOptions={getElkMrTreeOptions(args)}
          />
      ))}
    </div>
  )
};

export const Basic: StoryObj<DiagramStoryArgs> = {
  name: 'Scenario sirius studio example',
  args:{
    autoLayout: true,
    direction: "DOWN",
    nodeNode: 80,
    edgeNode: 10,
    edgeRoutingMode: 'AVOID_OVERLAP',
    wheighting: 'MODEL_ORDER',
  },
  render: (args) => (
    <div style={{width: '100vw', height: '100vh'}}>
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={BasiqueSiriusDiagram} 
          layoutOptions={getElkMrTreeOptions(args)} 
      />
    </div>
  )
};

export const FiveNodes: StoryObj<DiagramStoryArgs> = {
  name:'Scenario with five nodes',
  args:{
    autoLayout: true,
    direction: "DOWN",
    nodeNode: 80,
    edgeNode: 10,
    edgeRoutingMode: 'AVOID_OVERLAP',
    wheighting: 'MODEL_ORDER',
  },
  render: (args) => (
    <div style={{width: '100vw', height: '100vh'}}>
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={FiveNodeDiagram} 
          layoutOptions={getElkMrTreeOptions(args)} 
      />
    </div>
  )
};

export const TwoNodesGroups: StoryObj<DiagramStoryArgs> = {
  name:'Scenario with two groups of nodes',
  args:{
    autoLayout: true,
    direction: "DOWN",
    nodeNode: 80,
    edgeNode: 10,
    edgeRoutingMode: 'AVOID_OVERLAP',
    wheighting: 'MODEL_ORDER',
  },
  render: (args) => (
    <div style={{width: '100vw', height: '100vh'}}>
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={TwoNodeGroupDiagram} 
          layoutOptions={getElkMrTreeOptions(args)} 
      />
    </div>
  )
};

export const ThreeNodesGroups: StoryObj<DiagramStoryArgs> = {
  name:'Scenario with three groups of nodes',
  args:{
    autoLayout: true,
    direction: "DOWN",
    nodeNode: 80,
    edgeNode: 10,
    edgeRoutingMode: 'AVOID_OVERLAP',
    wheighting: 'MODEL_ORDER',
  },
  render: (args) => (
    <div style={{width: '100vw', height: '100vh'}}>
      <DiagramStoryWrapper
          args={args}
          diagramGenerator={ThreeNodeGroupDiagram}
          layoutOptions={getElkMrTreeOptions(args)}
      />
    </div>
  )
};