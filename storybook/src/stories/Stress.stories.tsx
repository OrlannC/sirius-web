import type { Meta, StoryObj } from '@storybook/react';
import { type ComponentProps, type MutableRefObject } from 'react';

import 'reactflow/dist/style.css';
import { DiagramRepresentation} from '@eclipse-sirius/sirius-components-diagrams';
import { DiagramStoryWrapper } from './automatisation/updateDiagram';
import { fiveNodeDiagram, TwoNodeGroupDiagram } from './automatisation/Scenario';
import type { LayoutOptions } from 'elkjs';

type StoryCustomArgs = { autoLayout?: boolean;};
type DiagramStoryArgs = ComponentProps<typeof DiagramRepresentation> & StoryCustomArgs;

const meta = {
  title: 'Stress Algorithm',
  component: DiagramRepresentation,
  tags: ['autodocs'],
  argTypes: {
    autoLayout: { control: 'boolean' },
  },
} satisfies Meta<DiagramStoryArgs>;

export default meta;

const getElkStressOptions = (args: StoryCustomArgs): LayoutOptions => {
    return {
        'elk.algorithm': 'stress',
    };
};

export const fiveNode: StoryObj<DiagramStoryArgs> = {
  args:{autoLayout: false},
  render: (args) => (
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={fiveNodeDiagram} 
          layoutOptions={getElkStressOptions(args)} 
      />
  )
};

export const TwoNodeGroup: StoryObj<DiagramStoryArgs> = {
  args:{autoLayout: false},
  render: (args) => (
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={TwoNodeGroupDiagram} 
          layoutOptions={getElkStressOptions(args)} 
      />
  )
};
