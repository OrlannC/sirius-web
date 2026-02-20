import type { Meta, StoryObj } from '@storybook/react';
import { type ComponentProps, type MutableRefObject } from 'react';

import 'reactflow/dist/style.css';
import { DiagramRepresentation} from '@eclipse-sirius/sirius-components-diagrams';
import { DiagramStoryWrapper } from './automatisation/updateDiagram';
import { FiveNodeDiagram, ThreeNodeGroupDiagram, TwoNodeGroupDiagram } from './automatisation/Scenario';
import type { LayoutOptions } from 'elkjs';

type StoryCustomArgs = { autoLayout?: boolean; nodeNode: number; whiteSpaceStart: string; approStrat: string; targetWidth: number; contentAlign: string; approOptiGoal: string; };
type DiagramStoryArgs = ComponentProps<typeof DiagramRepresentation> & StoryCustomArgs;

const meta = {
  title: 'RectPacking Algorithm',
  component: DiagramRepresentation,
  tags: ['autodocs'],
  argTypes: {
    autoLayout: { control: 'boolean' },
    nodeNode: { },
    whiteSpaceStart: { control: 'select', options: ['EQUAL_BETWEEN_STRUCTURES', 'TO_ASPECT_RATIO', 'NONE'] },
    approStrat: { control: 'select', options: ['GREEDY', 'TARGET_WIDTH'] },
    targetWidth: { },
    contentAlign: { control: 'select', options: ['V_TOP H_LEFT', 'V_TOP H_CENTER', 'V_TOP H_RIGHT', 'V_CENTER H_LEFT', 'V_CENTER H_CENTER', 'V_CENTER H_RIGHT', 'V_BOTTOM H_LEFT', 'V_BOTTOM H_CENTER', 'V_BOTTOM H_RIGHT'] },
    approOptiGoal: { control: 'select', options: ['ASPECT_RATIO_DRIVEN', 'MAX_SCALE_DRIVEN', 'AREA_DRIVEN'] },
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

export const fiveNode: StoryObj<DiagramStoryArgs> = {
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
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={FiveNodeDiagram} 
          layoutOptions={getElkRectPackingOptions(args)} 
      />
  )
};

export const TwoNodeGroup: StoryObj<DiagramStoryArgs> = {
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
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={TwoNodeGroupDiagram} 
          layoutOptions={getElkRectPackingOptions(args)} 
      />
  )
};

export const ThreeNodeGroup: StoryObj<DiagramStoryArgs> = {
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
      <DiagramStoryWrapper
          args={args}
          diagramGenerator={ThreeNodeGroupDiagram}
          layoutOptions={getElkRectPackingOptions(args)}
      />
  )
};