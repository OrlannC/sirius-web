import type { Meta, StoryObj } from '@storybook/react';
import { type ComponentProps, type MutableRefObject } from 'react';
import './automatisation/Global.css'
import 'reactflow/dist/style.css';
import { DiagramRepresentation} from '@eclipse-sirius/sirius-components-diagrams';
import { DiagramStoryWrapper } from './automatisation/updateDiagram';
import { AllScenarioDiagram, BasiqueSiriusDiagram, FiveNodeDiagram, ThreeNodeGroupDiagram, TwoNodeGroupDiagram } from './automatisation/Scenario';
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

const listDiagram = AllScenarioDiagram();

export const AllScenario: StoryObj<DiagramStoryArgs> = {
  args:{
    autoLayout: true,
    desiredEdgeLength: 100.0,
    dimension: 'XY',
  },
  render: (args) => (
    <div className="conteneur">
      {listDiagram.map((generator, index) => (
          <DiagramStoryWrapper 
            key={index}
            args={args} 
            diagramGenerator={generator} 
            layoutOptions={getElkStressOptions(args)}
          />
      ))}
    </div>
  )
};

export const Basique: StoryObj<DiagramStoryArgs> = {
  args:{
    autoLayout: true,
    desiredEdgeLength: 100.0,
    dimension: 'XY',
  },
  render: (args) => (
    <div style={{width: '100vw', height: '100vh'}}>
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={BasiqueSiriusDiagram} 
          layoutOptions={getElkStressOptions(args)} 
      />
    </div>
  )
};

export const FiveNode: StoryObj<DiagramStoryArgs> = {
  args:{
    autoLayout: true,
    desiredEdgeLength: 100.0,
    dimension: 'XY',
  },
  render: (args) => (
    <div style={{width: '100vw', height: '100vh'}}>
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={FiveNodeDiagram} 
          layoutOptions={getElkStressOptions(args)} 
      />
    </div>
  )
};

export const TwoNodeGroup: StoryObj<DiagramStoryArgs> = {
  args:{
    autoLayout: true,
    desiredEdgeLength: 100.0,
    dimension: 'XY',
  },
  render: (args) => (
    <div style={{width: '100vw', height: '100vh'}}>
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={TwoNodeGroupDiagram} 
          layoutOptions={getElkStressOptions(args)} 
      />
    </div>
  )
};

export const ThreeNodeGroup: StoryObj<DiagramStoryArgs> = {
  args:{
    autoLayout: true,
    desiredEdgeLength: 100.0,
    dimension: 'XY',
  },
  render: (args) => (
    <div style={{width: '100vw', height: '100vh'}}>
      <DiagramStoryWrapper
          args={args}
          diagramGenerator={ThreeNodeGroupDiagram}
          layoutOptions={getElkStressOptions(args)}
      />
    </div>
  )
};