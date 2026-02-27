import type { Meta, StoryObj } from '@storybook/react';
import { type ComponentProps, type MutableRefObject } from 'react';
import './automatisation/Global.css'
import 'reactflow/dist/style.css';
import { DiagramRepresentation} from '@eclipse-sirius/sirius-components-diagrams';
import { DiagramStoryWrapper } from './automatisation/updateDiagram';
import { AllScenarioDiagram, BasiqueSiriusDiagram, FiveNodeDiagram, ThreeNodeGroupDiagram, TwoNodeGroupDiagram } from './automatisation/Scenario';
import type { LayoutOptions } from 'elkjs';

type StoryCustomArgs = { autoLayout?: boolean; algorithm: string; nodeNode: number; 
  directionL: string; nodeNodeBetweenLayers: number; componentComponent: number; edgeNodeBetweenLayers: number; layStrat: string; nodePlacStrat: string; contentAlignLayered: string;
  directionT: string; edgeNode: number; edgeRoutingMode: string; wheighting: string;
  whiteSpaceStart: string; approStrat: string; targetWidth: number; contentAlignRect: string; approOptiGoal: string;
  wedgeCrit: string; compactor: string; optiCrit: string;
  spanningTree: string; treeConstrution: string;
  model:string; iterations: number;
  maxIterations: number;
  desiredEdgeLength: number; dimension: string;
};
type DiagramStoryArgs = ComponentProps<typeof DiagramRepresentation> & StoryCustomArgs;

const meta = {
  title: 'All Algorithm',
  component: DiagramRepresentation,
  tags: ['autodocs'],
  argTypes: {
    autoLayout: { control: 'boolean' },
    algorithm: { control: 'select', options: ['layered','rectpacking','stress','mrtree','radial','force','sporeOverlap','sporeCompaction'] },
    nodeNode: { if: { arg: 'algorithm', neq: 'stress' } },

    directionL: { control: 'select', if: { arg: 'algorithm', eq: 'layered' }, options: ['DOWN', 'RIGHT','LEFT','UP'] },
    nodeNodeBetweenLayers: { if: { arg: 'algorithm', eq: 'layered' } },
    componentComponent: { if: { arg: 'algorithm', eq: 'layered' } },
    edgeNodeBetweenLayers: { if: { arg: 'algorithm', eq: 'layered' } },
    layStrat: { control: 'select', if: { arg: 'algorithm', eq: 'layered' }, options: ['NETWORK_SIMPLEX', 'LONGEST_PATH', 'LONGEST_PATH_SOURCE'] },
    nodePlacStrat: { control: 'select', if: { arg: 'algorithm', eq: 'layered' }, options: ['NETWORK_SIMPLEX', 'LINEAR_SEGMENTS', 'SIMPLE', 'BRANDES_KOEPF'] },
    contentAlignLayered: { control: 'select', if: { arg: 'algorithm', eq: 'layered' }, options: ['V_TOP H_LEFT', 'V_TOP H_CENTER', 'V_TOP H_RIGHT', 'V_CENTER H_LEFT', 'V_CENTER H_CENTER', 'V_CENTER H_RIGHT', 'V_BOTTOM H_LEFT', 'V_BOTTOM H_CENTER', 'V_BOTTOM H_RIGHT'] },
    
    directionT: { control: 'select', if: { arg: 'algorithm', eq: 'mrtree' }, options: ['DOWN', 'RIGHT','LEFT','UP'] },
    edgeNode: { if: { arg: 'algorithm', eq: 'mrtree' }},
    edgeRoutingMode: { control: 'select', if: { arg: 'algorithm', eq: 'mrtree' }, options: ['AVOID_OVERLAP', 'MIDDLE_TO_MIDDLE', 'NONE'] },
    wheighting: { control: 'select', if: { arg: 'algorithm', eq: 'mrtree' }, options: ['MODEL_ORDER', 'DESCENDANTS', 'FAN','CONSTRAINT'] },

    whiteSpaceStart: { control: 'select', if: { arg: 'algorithm', eq: 'rectpacking' }, options: ['EQUAL_BETWEEN_STRUCTURES', 'TO_ASPECT_RATIO', 'NONE'] },
    approStrat: { control: 'select', if: { arg: 'algorithm', eq: 'rectpacking' }, options: ['GREEDY', 'TARGET_WIDTH'] },
    targetWidth: { if: { arg: 'algorithm', eq: 'rectpacking' } },
    contentAlignRect: { control: 'select', if: { arg: 'algorithm', eq: 'rectpacking' }, options: ['V_TOP H_LEFT', 'V_TOP H_CENTER', 'V_TOP H_RIGHT', 'V_CENTER H_LEFT', 'V_CENTER H_CENTER', 'V_CENTER H_RIGHT', 'V_BOTTOM H_LEFT', 'V_BOTTOM H_CENTER', 'V_BOTTOM H_RIGHT'] },
    approOptiGoal: { control: 'select', if: { arg: 'algorithm', eq: 'rectpacking' }, options: ['ASPECT_RATIO_DRIVEN', 'MAX_SCALE_DRIVEN', 'AREA_DRIVEN'] },

    wedgeCrit: { control: 'select', if: { arg: 'algorithm', eq: 'radial' }, options: ['LEAF_NUMBER', 'NODE_SIZE'] },
    compactor: { control: 'select', if: { arg: 'algorithm', eq: 'radial' }, options: ['NONE', 'RADIAL_COMPACTION', 'WEDGE_COMPACTION'] },
    optiCrit: { control: 'select', if: { arg: 'algorithm', eq: 'radial' }, options: ['NONE', 'EDGE_LENGTH', 'EDGE_LENGTH_BY_POSITION ', 'CROSSING_MINIMIZATION_BY_POSITION'] },
 
    spanningTree: { control: 'select', if: { arg: 'algorithm', eq: 'sporeCompaction' }, options: ['CENTER_DISTANCE', 'CIRCLE_UNDERLAP', 'RECTANGLE_UNDERLAP', 'INVERTED_OVERLAP', 'MINIMUM_ROOT_DISTANCE'] },
    treeConstrution: { control: 'select', if: { arg: 'algorithm', eq: 'sporeCompaction' }, options: ['MINIMUM_SPANNING_TREE', 'MAXIMUM_SPANNING_TREE'] },

    model: { control: 'select', if: { arg: 'algorithm', eq: 'force' }, options: ['EADES', 'FRUCHTERMAN_REINGOLD'] },
    iterations: { if: { arg: 'algorithm', eq: 'force' } },

    maxIterations: { if: { arg: 'algorithm', eq: 'sporeOverlap' } },

    desiredEdgeLength: { if: { arg: 'algorithm', eq: 'stress' } },
    dimension: { control: 'select', if: { arg: 'algorithm', eq: 'stress' }, options: ['XY', 'X', 'Y'] },
  },
} satisfies Meta<DiagramStoryArgs>;

export default meta;

const getElkOptions = (args: StoryCustomArgs): LayoutOptions => {
  const elkLayeredOptions : LayoutOptions = {
      'elk.algorithm': 'layered',
      'elk.layered.spacing.nodeNodeBetweenLayers': String(args.nodeNodeBetweenLayers),
      'elk.layered.spacing.edgeNodeBetweenLayers': String(args.edgeNodeBetweenLayers),
      'elk.spacing.componentComponent': String(args.componentComponent),
      'elk.spacing.nodeNode': String(args.nodeNode),
      'elk.direction': args.directionL,
      'elk.layering.strategy': args.layStrat,
      'elk.layered.nodePlacement.strategy': args.nodePlacStrat,
      'elk.contentAlignment': args.contentAlignLayered,
  };

  const elkRectPackingOptions: LayoutOptions = {
    'elk.algorithm': 'rectpacking',
    'elk.spacing.nodeNode': String(args.nodeNode),
    'elk.rectpacking.trybox': 'true',
    'elk.rectpacking.whiteSpaceElimination.strategy': args.whiteSpaceStart,
    'elk.rectpacking.widthApproximation.strategy': args.approStrat,
    'elk.rectpacking.widthApproximation.targetWidth': String(args.targetWidth),
    'elk.contentAlignment': args.contentAlignRect,
    'elk.rectpacking.widthApproximation.optimizationGoal': args.approOptiGoal,
  };

  const elkStressOptions: LayoutOptions = {
    'elk.algorithm': 'stress',
    'elk.stress.desiredEdgeLength': String(args.desiredEdgeLength),
    'elk.stress.dimension': args.dimension,
  };

  const elkTreeOptions: LayoutOptions = {
    'elk.algorithm': 'mrtree',
    'elk.spacing.nodeNode': String(args.nodeNode),
    'elk.spacing.edgeNode': String(args.edgeNode),
    'elk.direction': args.directionT,
    'elk.mrtree.weighting': args.wheighting,
    'elk.mrtree.edgeRoutingMode': args.edgeRoutingMode,
  };

  const elkRadialOptions: LayoutOptions = {
    'elk.algorithm': 'radial',
    'elk.spacing.nodeNode': String(args.nodeNode),
    'elk.radial.wedgeCriteria': args.wedgeCrit,
    'elk.radial.compactor': args.compactor,
    'elk.radial.optimizationCriteria': args.optiCrit,
  };

  const elkForceOptions: LayoutOptions = {
    'elk.algorithm': 'force',
    'elk.spacing.nodeNode': String(args.nodeNode),
    'elk.force.model': args.model,
    'elk.force.iterations': String(args.iterations),
  };

  const elkSporeOverlapOptions: LayoutOptions = {
    'elk.algorithm': 'sporeOverlap',
    'elk.spacing.nodeNode': String(args.nodeNode),
    'elk.overlapRemoval.maxIterations': String(args.maxIterations),
  };

  const elkSporeCompactionOptions: LayoutOptions = {
    'elk.algorithm': 'sporeCompaction',
    'elk.spacing.nodeNode': String(args.nodeNode),
    'elk.processingOrder.spanningTreeCostFunction': args.spanningTree,
    'elk.processingOrder.treeConstruction': args.treeConstrution,
  };

  const getLayoutOptions = (algorithm: string): LayoutOptions => {
    switch(algorithm) {
      case 'rectpacking': return elkRectPackingOptions;
      case 'stress': return elkStressOptions;
      case 'mrtree': return elkTreeOptions;
      case 'radial': return elkRadialOptions;
      case 'force': return elkForceOptions;
      case 'sporeOverlap': return elkSporeOverlapOptions;  
      case 'sporeCompaction': return elkSporeCompactionOptions;
      default: return elkLayeredOptions;
    }
  };

  return getLayoutOptions(args.algorithm);
};

const listDiagram = AllScenarioDiagram();

export const AllScenario: StoryObj<DiagramStoryArgs> = {
  args:{
    autoLayout: true,
    algorithm: "layered",
    nodeNode: 80,

    directionL: "DOWN",
    nodeNodeBetweenLayers: 80,
    componentComponent: 60,
    edgeNodeBetweenLayers: 20,
    layStrat: 'NETWORK_SIMPLEX',
    nodePlacStrat: 'NETWORK_SIMPLEX',
    contentAlignLayered: 'V_TOP H_CENTER',

    directionT: "DOWN",
    edgeNode: 10,
    edgeRoutingMode: 'AVOID_OVERLAP',
    wheighting: 'MODEL_ORDER',

    whiteSpaceStart: 'NONE',
    approStrat: 'GREEDY',
    targetWidth: 1,
    contentAlignRect: 'V_TOP H_CENTER',
    approOptiGoal: 'MAX_SCALE_DRIVEN',

    wedgeCrit: 'NODE_SIZE',
    compactor: 'NONE',
    optiCrit: 'NONE',

    spanningTree: 'CIRCLE_UNDERLAP',
    treeConstrution: 'MINIMUM_SPANNING_TREE',

    model: 'FRUCHTERMAN_REINGOLD',
    iterations: 300,

    maxIterations: 64,

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
            layoutOptions={getElkOptions(args)}
          />
      ))}
    </div>
  )
};

export const Basique: StoryObj<DiagramStoryArgs> = {
  args:{
    autoLayout: true,
    algorithm: "layered",
    nodeNode: 80,

    directionL: "DOWN",
    nodeNodeBetweenLayers: 80,
    componentComponent: 60,
    edgeNodeBetweenLayers: 20,
    layStrat: 'NETWORK_SIMPLEX',
    nodePlacStrat: 'NETWORK_SIMPLEX',
    contentAlignLayered: 'V_TOP H_CENTER',

    directionT: "DOWN",
    edgeNode: 10,
    edgeRoutingMode: 'AVOID_OVERLAP',
    wheighting: 'MODEL_ORDER',

    whiteSpaceStart: 'NONE',
    approStrat: 'GREEDY',
    targetWidth: 1,
    contentAlignRect: 'V_TOP H_CENTER',
    approOptiGoal: 'MAX_SCALE_DRIVEN',

    wedgeCrit: 'NODE_SIZE',
    compactor: 'NONE',
    optiCrit: 'NONE',

    spanningTree: 'CIRCLE_UNDERLAP',
    treeConstrution: 'MINIMUM_SPANNING_TREE',

    model: 'FRUCHTERMAN_REINGOLD',
    iterations: 300,

    maxIterations: 64,

    desiredEdgeLength: 100.0,
    dimension: 'XY',
  },
  render: (args) => (
    <div style={{width: '100vw', height: '100vh'}}>
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={BasiqueSiriusDiagram} 
          layoutOptions={getElkOptions(args)} 
      />
    </div>
  )
};

export const FiveNode: StoryObj<DiagramStoryArgs> = {
  args:{
    autoLayout: true,
    algorithm: "layered",
    nodeNode: 80,

    directionL: "DOWN",
    nodeNodeBetweenLayers: 80,
    componentComponent: 60,
    edgeNodeBetweenLayers: 20,
    layStrat: 'NETWORK_SIMPLEX',
    nodePlacStrat: 'NETWORK_SIMPLEX',
    contentAlignLayered: 'V_TOP H_CENTER',

    directionT: "DOWN",
    edgeNode: 10,
    edgeRoutingMode: 'AVOID_OVERLAP',
    wheighting: 'MODEL_ORDER',

    whiteSpaceStart: 'NONE',
    approStrat: 'GREEDY',
    targetWidth: 1,
    contentAlignRect: 'V_TOP H_CENTER',
    approOptiGoal: 'MAX_SCALE_DRIVEN',

    wedgeCrit: 'NODE_SIZE',
    compactor: 'NONE',
    optiCrit: 'NONE',

    spanningTree: 'CIRCLE_UNDERLAP',
    treeConstrution: 'MINIMUM_SPANNING_TREE',

    model: 'FRUCHTERMAN_REINGOLD',
    iterations: 300,

    maxIterations: 64,

    desiredEdgeLength: 100.0,
    dimension: 'XY',
  },
  render: (args) => (
    <div style={{width: '100vw', height: '100vh'}}>
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={FiveNodeDiagram} 
          layoutOptions={getElkOptions(args)} 
      />
    </div>
  )
};

export const TwoNodeGroup: StoryObj<DiagramStoryArgs> = {
  args:{
    autoLayout: true,
    algorithm: "layered",
    nodeNode: 80,

    directionL: "DOWN",
    nodeNodeBetweenLayers: 80,
    componentComponent: 60,
    edgeNodeBetweenLayers: 20,
    layStrat: 'NETWORK_SIMPLEX',
    nodePlacStrat: 'NETWORK_SIMPLEX',
    contentAlignLayered: 'V_TOP H_CENTER',

    directionT: "DOWN",
    edgeNode: 10,
    edgeRoutingMode: 'AVOID_OVERLAP',
    wheighting: 'MODEL_ORDER',

    whiteSpaceStart: 'NONE',
    approStrat: 'GREEDY',
    targetWidth: 1,
    contentAlignRect: 'V_TOP H_CENTER',
    approOptiGoal: 'MAX_SCALE_DRIVEN',

    wedgeCrit: 'NODE_SIZE',
    compactor: 'NONE',
    optiCrit: 'NONE',

    spanningTree: 'CIRCLE_UNDERLAP',
    treeConstrution: 'MINIMUM_SPANNING_TREE',

    model: 'FRUCHTERMAN_REINGOLD',
    iterations: 300,

    maxIterations: 64,

    desiredEdgeLength: 100.0,
    dimension: 'XY',
  },
  render: (args) => (
    <div style={{width: '100vw', height: '100vh'}}>
      <DiagramStoryWrapper 
          args={args} 
          diagramGenerator={TwoNodeGroupDiagram} 
          layoutOptions={getElkOptions(args)} 
      />
    </div>
  )
};

export const ThreeNodeGroup: StoryObj<DiagramStoryArgs> = {
  args:{
    autoLayout: true,
    algorithm: "layered",
    nodeNode: 80,

    directionL: "DOWN",
    nodeNodeBetweenLayers: 80,
    componentComponent: 60,
    edgeNodeBetweenLayers: 20,
    layStrat: 'NETWORK_SIMPLEX',
    nodePlacStrat: 'NETWORK_SIMPLEX',
    contentAlignLayered: 'V_TOP H_CENTER',

    directionT: "DOWN",
    edgeNode: 10,
    edgeRoutingMode: 'AVOID_OVERLAP',
    wheighting: 'MODEL_ORDER',

    whiteSpaceStart: 'NONE',
    approStrat: 'GREEDY',
    targetWidth: 1,
    contentAlignRect: 'V_TOP H_CENTER',
    approOptiGoal: 'MAX_SCALE_DRIVEN',

    wedgeCrit: 'NODE_SIZE',
    compactor: 'NONE',
    optiCrit: 'NONE',

    spanningTree: 'CIRCLE_UNDERLAP',
    treeConstrution: 'MINIMUM_SPANNING_TREE',

    model: 'FRUCHTERMAN_REINGOLD',
    iterations: 300,

    maxIterations: 64,

    desiredEdgeLength: 100.0,
    dimension: 'XY',
  },
  render: (args) => (
    <div style={{width: '100vw', height: '100vh'}}>
      <DiagramStoryWrapper
          args={args}
          diagramGenerator={ThreeNodeGroupDiagram}
          layoutOptions={getElkOptions(args)}
      />
    </div>
  )
};