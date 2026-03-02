import type { Meta, StoryObj } from '@storybook/react';
import { type ComponentProps } from 'react';
import './automatisation/Global.css'
import 'reactflow/dist/style.css';
import { DiagramRepresentation} from '@eclipse-sirius/sirius-components-diagrams';
import { DiagramStoryWrapper } from './automatisation/updateDiagram';
import { FiveNodeDiagram, TwoNodeGroupDiagram, ThreeNodeGroupDiagram, BasiqueSiriusDiagram, AllScenarioDiagram} from './automatisation/Scenario';
import type { LayoutOptions } from 'elkjs';

type StoryCustomArgs = { autoLayout?: boolean; nodeNode: number; direction: string; nodeNodeBetweenLayers: number; componentComponent: number; edgeNodeBetweenLayers: number; layStrat: string; nodePlacStrat: string; contentAlign: string;};
type DiagramStoryArgs = ComponentProps<typeof DiagramRepresentation> & StoryCustomArgs;

const meta = {
  title: 'Layered algorithm',
  component: DiagramRepresentation,
  tags: ['autodocs'],
  argTypes: {
    autoLayout: { name: 'Auto-layout', control: 'boolean' },
    nodeNode: { name: 'Node spacing', control: 'number' },
    direction: { name: 'Layout direction', control: 'select', options: ['DOWN', 'RIGHT','LEFT','UP'] },
    nodeNodeBetweenLayers: { name: 'Node spacing between layers', control: 'number' },
    componentComponent: { name: 'Component spacing', control: 'number'  },
    edgeNodeBetweenLayers: { name: 'Edge spacing between layers', control: 'number'  },
    layStrat: { name: 'Layering strategy', control: 'select', options: ['NETWORK_SIMPLEX', 'LONGEST_PATH', 'LONGEST_PATH_SOURCE'] },
    nodePlacStrat: { name: 'Node placement strategy', control: 'select', options: ['NETWORK_SIMPLEX', 'LINEAR_SEGMENTS', 'SIMPLE', 'BRANDES_KOEPF'] },
    contentAlign: { name: 'Content alignment', control: 'select', options: ['V_TOP H_LEFT', 'V_TOP H_CENTER', 'V_TOP H_RIGHT', 'V_CENTER H_LEFT', 'V_CENTER H_CENTER', 'V_CENTER H_RIGHT', 'V_BOTTOM H_LEFT', 'V_BOTTOM H_CENTER', 'V_BOTTOM H_RIGHT'] },
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

const listDiagram = AllScenarioDiagram();

export const AllScenarios: StoryObj<DiagramStoryArgs> = {
  name: 'All scenarios in one story',
  args:{
    autoLayout: true,
    nodeNode: 80,
    direction: "DOWN",
    nodeNodeBetweenLayers: 80,
    componentComponent: 60,
    edgeNodeBetweenLayers: 80,
    layStrat: 'NETWORK_SIMPLEX',
    nodePlacStrat: 'NETWORK_SIMPLEX',
    contentAlign: 'V_TOP H_CENTER',
  },
  render: (args) => (
    <div className="conteneur">
      {listDiagram.map((generator, index) => (
          <DiagramStoryWrapper 
            key={index}
            args={args} 
            diagramGenerator={generator} 
            layoutOptions={getElkLayeredOptions(args)}
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
    direction: "DOWN",
    nodeNodeBetweenLayers: 80,
    componentComponent: 60,
    edgeNodeBetweenLayers: 80,
    layStrat: 'NETWORK_SIMPLEX',
    nodePlacStrat: 'NETWORK_SIMPLEX',
    contentAlign: 'V_TOP H_CENTER',
  },
  render: (args) => (
    <div style={{width: '100vw', height: '100vh'}}>
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={BasiqueSiriusDiagram} 
          layoutOptions={getElkLayeredOptions(args)} 
      />
    </div>
  )
};

export const FiveNodes: StoryObj<DiagramStoryArgs> = {
  name:'Scenario with five nodes',
  args:{
    autoLayout: true,
    nodeNode: 80,
    direction: "DOWN",
    nodeNodeBetweenLayers: 80,
    componentComponent: 60,
    edgeNodeBetweenLayers: 80,
    layStrat: 'NETWORK_SIMPLEX',
    nodePlacStrat: 'NETWORK_SIMPLEX',
    contentAlign: 'V_TOP H_CENTER',
  },
  render: (args) => (
    <div style={{width: '100vw', height: '100vh'}}>
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={FiveNodeDiagram} 
          layoutOptions={getElkLayeredOptions(args)} 
      />
    </div>
  )
};

export const TwoNodesGroups: StoryObj<DiagramStoryArgs> = {
  name:'Scenario with two groups of nodes',
  args:{
    autoLayout: true,
    nodeNode: 80,
    direction: "DOWN",
    nodeNodeBetweenLayers: 80,
    componentComponent: 60,
    edgeNodeBetweenLayers: 80,
    layStrat: 'NETWORK_SIMPLEX',
    nodePlacStrat: 'NETWORK_SIMPLEX',
    contentAlign: 'V_TOP H_CENTER',
  },
  render: (args) => (
    <div style={{width: '100vw', height: '100vh'}}>
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={TwoNodeGroupDiagram} 
          layoutOptions={getElkLayeredOptions(args)} 
      />
    </div>
  )
};

export const ThreeNodesGroups: StoryObj<DiagramStoryArgs> = {
  name:'Scenario with three groups of nodes',
  args:{
    autoLayout: true,
    nodeNode: 80,
    direction: "DOWN",
    nodeNodeBetweenLayers: 80,
    componentComponent: 60,
    edgeNodeBetweenLayers: 80,
    layStrat: 'NETWORK_SIMPLEX',
    nodePlacStrat: 'NETWORK_SIMPLEX',
    contentAlign: 'V_TOP H_CENTER',
  },
  render: (args) => (
    <div style={{width: '100vw', height: '100vh'}}>
      <DiagramStoryWrapper
          args={args}
          diagramGenerator={ThreeNodeGroupDiagram}
          layoutOptions={getElkLayeredOptions(args)}
      />
    </div>
  )
};