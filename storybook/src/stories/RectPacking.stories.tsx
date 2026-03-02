import type { Meta, StoryObj } from '@storybook/react';
import { type ComponentProps } from 'react';
import './automatisation/Global.css'
import 'reactflow/dist/style.css';
import { DiagramRepresentation} from '@eclipse-sirius/sirius-components-diagrams';
import { DiagramStoryWrapper } from './automatisation/updateDiagram';
import { AllScenarioDiagram, BasiqueSiriusDiagram, FiveNodeDiagram, ThreeNodeGroupDiagram, TwoNodeGroupDiagram } from './automatisation/Scenario';
import type { LayoutOptions } from 'elkjs';

type StoryCustomArgs = { autoLayout?: boolean; nodeNode: number; whiteSpaceStart: string; approStrat: string; targetWidth: number; contentAlign: string; approOptiGoal: string; };
type DiagramStoryArgs = ComponentProps<typeof DiagramRepresentation> & StoryCustomArgs;

const meta = {
  title: 'Rectangle packing algorithm',
  component: DiagramRepresentation,
  tags: ['autodocs'],
  argTypes: {
    autoLayout: { name: 'Auto-layout', control: 'boolean' },
    nodeNode: { name: 'Node spacing', control: 'number' },
    whiteSpaceStart: { name: 'White space distribution', control: 'select', options: ['EQUAL_BETWEEN_STRUCTURES', 'TO_ASPECT_RATIO', 'NONE'] },
    approStrat: { name: 'Packing strategy', control: 'select', options: ['GREEDY', 'TARGET_WIDTH'] },
    targetWidth: { name: 'Target width', control: 'number'},
    contentAlign: { name: 'Content alignment', control: 'select', options: ['V_TOP H_LEFT', 'V_TOP H_CENTER', 'V_TOP H_RIGHT', 'V_CENTER H_LEFT', 'V_CENTER H_CENTER', 'V_CENTER H_RIGHT', 'V_BOTTOM H_LEFT', 'V_BOTTOM H_CENTER', 'V_BOTTOM H_RIGHT'] },
    approOptiGoal: { name: 'Optimization goal', control: 'select', options: ['ASPECT_RATIO_DRIVEN', 'MAX_SCALE_DRIVEN', 'AREA_DRIVEN'] },
  },
} satisfies Meta<DiagramStoryArgs>;

export default meta;

const getElkRectPackingOptions = (args: StoryCustomArgs): LayoutOptions => {
  return {
    'elk.algorithm': 'rectpacking',
    'elk.spacing.nodeNode': String(args.nodeNode),
    'elk.rectpacking.trybox': 'true',
    'elk.rectpacking.whiteSpaceElimination.strategy': args.whiteSpaceStart,
    'elk.rectpacking.widthApproximation.strategy': args.approStrat,
    'elk.rectpacking.widthApproximation.targetWidth': String(args.targetWidth),
    'elk.contentAlignment': args.contentAlign,
    'elk.rectpacking.widthApproximation.optimizationGoal': args.approOptiGoal,
  };
};

const listDiagram = AllScenarioDiagram();

export const AllScenarios: StoryObj<DiagramStoryArgs> = {
  name: 'All scenarios in one story',
  args:{
    autoLayout: true,
    nodeNode: 80,
    whiteSpaceStart: 'NONE',
    approStrat: 'GREEDY',
    targetWidth: 1,
    contentAlign: 'V_TOP H_CENTER',
    approOptiGoal: 'MAX_SCALE_DRIVEN',
  },
  render: (args) => (
    <div className="conteneur">
      {listDiagram.map((generator, index) => (
          <DiagramStoryWrapper 
            key={index}
            args={args} 
            diagramGenerator={generator} 
            layoutOptions={getElkRectPackingOptions(args)}
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
    whiteSpaceStart: 'NONE',
    approStrat: 'GREEDY',
    targetWidth: 1,
    contentAlign: 'V_TOP H_CENTER',
    approOptiGoal: 'MAX_SCALE_DRIVEN',
  },
  render: (args) => (
    <div style={{width: '100vw', height: '100vh'}}>
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={BasiqueSiriusDiagram} 
          layoutOptions={getElkRectPackingOptions(args)} 
      />
    </div>
  )
};

export const FiveNodes: StoryObj<DiagramStoryArgs> = {
  name:'Scenario with five nodes',
  args:{
    autoLayout: true,
    nodeNode: 80,
    whiteSpaceStart: 'NONE',
    approStrat: 'GREEDY',
    targetWidth: 1,
    contentAlign: 'V_TOP H_CENTER',
    approOptiGoal: 'MAX_SCALE_DRIVEN',
  },
  render: (args) => (
    <div style={{width: '100vw', height: '100vh'}}>
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={FiveNodeDiagram} 
          layoutOptions={getElkRectPackingOptions(args)} 
      />
    </div>
  )
};

export const TwoNodesGroups: StoryObj<DiagramStoryArgs> = {
  name:'Scenario with two groups of nodes',
  args:{
    autoLayout: true,
    nodeNode: 80,
    whiteSpaceStart: 'NONE',
    approStrat: 'GREEDY',
    targetWidth: 1,
    contentAlign: 'V_TOP H_CENTER',
    approOptiGoal: 'MAX_SCALE_DRIVEN',
  },
  render: (args) => (
    <div style={{width: '100vw', height: '100vh'}}>
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={TwoNodeGroupDiagram} 
          layoutOptions={getElkRectPackingOptions(args)} 
      />
    </div>
  )
};

export const ThreeNodesGroups: StoryObj<DiagramStoryArgs> = {
  name:'Scenario with three groups of nodes',
  args:{
    autoLayout: true,
    nodeNode: 80,
    whiteSpaceStart: 'NONE',
    approStrat: 'GREEDY',
    targetWidth: 1,
    contentAlign: 'V_TOP H_CENTER',
    approOptiGoal: 'MAX_SCALE_DRIVEN',
  },
  render: (args) => (
    <div style={{width: '100vw', height: '100vh'}}>
      <DiagramStoryWrapper
          args={args}
          diagramGenerator={ThreeNodeGroupDiagram}
          layoutOptions={getElkRectPackingOptions(args)}
      />
    </div>
  )
};