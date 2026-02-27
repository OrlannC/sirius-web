import type { Meta, StoryObj } from '@storybook/react';
import { type ComponentProps, type MutableRefObject } from 'react';
import './automatisation/Global.css'
import 'reactflow/dist/style.css';
import { DiagramRepresentation} from '@eclipse-sirius/sirius-components-diagrams';
import { DiagramStoryWrapper } from './automatisation/updateDiagram';
import { FiveNodeDiagram, TwoNodeGroupDiagram, ThreeNodeGroupDiagram, AllScenarioDiagram, BasiqueSiriusDiagram } from './automatisation/Scenario';
import type { LayoutOptions } from 'elkjs';

type StoryCustomArgs = { autoLayout?: boolean; direction: string; nodeNode: number; edgeNode: number; edgeRoutingMode: string; wheighting: string;};
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

export const AllScenario: StoryObj<DiagramStoryArgs> = {
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

export const Basique: StoryObj<DiagramStoryArgs> = {
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

export const FiveNode: StoryObj<DiagramStoryArgs> = {
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

export const TwoNodeGroup: StoryObj<DiagramStoryArgs> = {
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

export const ThreeNodeGroup: StoryObj<DiagramStoryArgs> = {
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