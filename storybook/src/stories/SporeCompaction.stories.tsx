import type { Meta, StoryObj } from '@storybook/react';
import { type ComponentProps } from 'react';
import './automatisation/Global.css'
import 'reactflow/dist/style.css';
import { DiagramRepresentation} from '@eclipse-sirius/sirius-components-diagrams';
import { DiagramStoryWrapper } from './automatisation/updateDiagram';
import { AllScenarioDiagram, BasiqueSiriusDiagram, FiveNodeDiagram, ThreeNodeGroupDiagram, TwoNodeGroupDiagram } from './automatisation/Scenario';
import type { LayoutOptions } from 'elkjs';

type StoryCustomArgs = { autoLayout?: boolean; nodeNode: number; spanningTree: string; treeConstrution: string; };
type DiagramStoryArgs = ComponentProps<typeof DiagramRepresentation> & StoryCustomArgs;

const meta = {
  title: 'Spore compaction algorithm',
  component: DiagramRepresentation,
  tags: ['autodocs'],
  argTypes: {
    autoLayout: { name: 'Auto-layout', control: 'boolean' },
    nodeNode: {name: 'Node spacing', control: 'number'},
    spanningTree: { name: 'Spanning tree metric', control: 'select', options: ['CENTER_DISTANCE', 'CIRCLE_UNDERLAP', 'RECTANGLE_UNDERLAP', 'INVERTED_OVERLAP', 'MINIMUM_ROOT_DISTANCE'] },
    treeConstrution: { name: 'Construction Method', control: 'select', options: ['MINIMUM_SPANNING_TREE', 'MAXIMUM_SPANNING_TREE'] },
  },
} satisfies Meta<DiagramStoryArgs>;

export default meta;

const getElkSporeCompactionOptions = (args: StoryCustomArgs): LayoutOptions => {
  return {
    'elk.algorithm': 'sporeCompaction',
    'elk.spacing.nodeNode': String(args.nodeNode),
    'elk.processingOrder.spanningTreeCostFunction': args.spanningTree,
    'elk.processingOrder.treeConstruction': args.treeConstrution,
  };
};

const listDiagram = AllScenarioDiagram();

export const AllScenarios: StoryObj<DiagramStoryArgs> = {
  name: 'All scenarios in one story',
  args:{
    autoLayout: true,
    nodeNode: 80,
    spanningTree: 'CIRCLE_UNDERLAP',
    treeConstrution: 'MINIMUM_SPANNING_TREE',
  },
  render: (args) => (
    <div className="conteneur">
      {listDiagram.map((generator, index) => (
          <DiagramStoryWrapper 
            key={index}
            args={args} 
            diagramGenerator={generator} 
            layoutOptions={getElkSporeCompactionOptions(args)}
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
    spanningTree: 'CIRCLE_UNDERLAP',
    treeConstrution: 'MINIMUM_SPANNING_TREE',
  },
  render: (args) => (
    <div style={{width: '100vw', height: '100vh'}}>
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={BasiqueSiriusDiagram} 
          layoutOptions={getElkSporeCompactionOptions(args)} 
      />
    </div>
  )
};

export const FiveNodes: StoryObj<DiagramStoryArgs> = {
  name:'Scenario with five nodes',
  args:{
    autoLayout: true,
    nodeNode: 80,
    spanningTree: 'CIRCLE_UNDERLAP',
    treeConstrution: 'MINIMUM_SPANNING_TREE',
  },
  render: (args) => (
    <div style={{width: '100vw', height: '100vh'}}>
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={FiveNodeDiagram} 
          layoutOptions={getElkSporeCompactionOptions(args)} 
      />
    </div>
  )
};

export const TwoNodesGroups: StoryObj<DiagramStoryArgs> = {
  name:'Scenario with two groups of nodes',
  args:{
    autoLayout: true,
    nodeNode: 80,
    spanningTree: 'CIRCLE_UNDERLAP',
    treeConstrution: 'MINIMUM_SPANNING_TREE',
  },
  render: (args) => (
    <div style={{width: '100vw', height: '100vh'}}>
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={TwoNodeGroupDiagram} 
          layoutOptions={getElkSporeCompactionOptions(args)} 
      />
    </div>
  )
};

export const ThreeNodeGroup: StoryObj<DiagramStoryArgs> = {
  name:'Scenario with three groups of nodes',
  args:{
    autoLayout: true,
    nodeNode: 80,
    spanningTree: 'CIRCLE_UNDERLAP',
    treeConstrution: 'MINIMUM_SPANNING_TREE',
  },
  render: (args) => (
    <div style={{width: '100vw', height: '100vh'}}>
      <DiagramStoryWrapper
          args={args}
          diagramGenerator={ThreeNodeGroupDiagram}
          layoutOptions={getElkSporeCompactionOptions(args)}
      />
    </div>
  )
};