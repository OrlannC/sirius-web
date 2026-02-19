import { ApolloProvider } from '@apollo/client';
import type { Meta, StoryObj } from '@storybook/react';
import i18n from 'i18next';
import { useMemo, useRef, useState, useEffect, type ComponentProps, type MutableRefObject } from 'react';
import { I18nextProvider, initReactI18next } from 'react-i18next';

import 'reactflow/dist/style.css';

import { SelectionContextProvider, ServerContext } from '@eclipse-sirius/sirius-components-core';
import { DiagramRepresentation, useOverlap } from '@eclipse-sirius/sirius-components-diagrams';

import { addEdge, addNode, buildDiagram, createMockClient } from './automatisation/DiagramConstructor';
import { type LayoutOptions } from 'elkjs/lib/elk-api';

import { newDiagram } from './automatisation/updateDiagram';

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    lng: 'en', fallbackLng: 'en',
    resources: { en: { translation: { 'paletteSearchField.placeholder': 'Search...' } } },
    interpolation: { escapeValue: false }
  });
}

const fiveNodeDiagram = () => {
  let d = buildDiagram('First Diagram');
  d = addNode(d, { id: 'n1', label: 'Noeud 1-1', x: 0, y: 0, width: 120, height: 60 });
  d = addNode(d, { id: 'n2', label: 'Noeud 2-1', x: 150, y: 0, width: 120, height: 60 });
  d = addNode(d, { id: 'n3', label: 'Noeud 2-2', x: 0, y: 80, width: 120, height: 60 });
  d = addNode(d, { id: 'n4', label: 'Noeud 3-1', x: 300, y: 0, width: 120, height: 60 });
  d = addNode(d, { id: 'n5', label: 'Noeud 3-2', x: 150, y: 80, width: 120, height: 60 });
  d = addEdge(d, { id: 'e1', sourceId: 'n1', targetId: 'n2' });
  d = addEdge(d, { id: 'e2', sourceId: 'n1', targetId: 'n3' });
  d = addEdge(d, { id: 'e3', sourceId: 'n2', targetId: 'n4' });
  d = addEdge(d, { id: 'e4', sourceId: 'n2', targetId: 'n5' });
  return { diagram: d, client: createMockClient(d) };
};

const TwoNodeGroupDiagram = () => {
  let d = buildDiagram('Second Diagram');
  d = addNode(d, { id: 'n1', label: 'Noeud 1-1', x: 0, y: 0, width: 120, height: 60 });
  d = addNode(d, { id: 'n2', label: 'Noeud 2-1', x: 150, y: 0, width: 120, height: 60 });
  d = addNode(d, { id: 'n3', label: 'Noeud 2-2', x: 0, y: 80, width: 120, height: 60 });
  d = addNode(d, { id: 'n4', label: 'Noeud 3-1', x: 300, y: 0, width: 120, height: 60 });
  d = addNode(d, { id: 'n5', label: 'Noeud 3-2', x: 150, y: 80, width: 120, height: 60 });
  d = addEdge(d, { id: 'e1', sourceId: 'n1', targetId: 'n2' });
  d = addEdge(d, { id: 'e2', sourceId: 'n1', targetId: 'n3' });
  d = addEdge(d, { id: 'e3', sourceId: 'n2', targetId: 'n4' });
  d = addEdge(d, { id: 'e4', sourceId: 'n2', targetId: 'n5' });

  d = addNode(d, { id: 'n6', label: 'Noeud 4-1', x: 0, y: 200, width: 120, height: 60 });
  d = addNode(d, { id: 'n7', label: 'Noeud 5-1', x: 150, y: 200, width: 120, height: 60 });
  d = addNode(d, { id: 'n8', label: 'Noeud 5-2', x: 0, y: 280, width: 120, height: 60 });
  d = addNode(d, { id: 'n9', label: 'Noeud 6-1', x: 300, y: 200, width: 120, height: 60 });
  d = addNode(d, { id: 'n10', label: 'Noeud 6-2', x: 150, y: 280, width: 120, height: 60 });
  d = addEdge(d, { id: 'e5', sourceId: 'n6', targetId: 'n7' });
  d = addEdge(d, { id: 'e6', sourceId: 'n6', targetId: 'n8' });
  d = addEdge(d, { id: 'e7', sourceId: 'n8', targetId: 'n9' });
  d = addEdge(d, { id: 'e8', sourceId: 'n8', targetId: 'n10' });
  return { diagram: d, client: createMockClient(d) };
}

type StoryCustomArgs = { autoLayout?: boolean; algorithm: string; directionL: string; directionT: string; nodeNode: number; nodeNodeBetweenLayers: number; componentComponent: number; edgeNodeBetweenLayers: number; iterations: number; maxIterations: number;};
type DiagramStoryArgs = ComponentProps<typeof DiagramRepresentation> & StoryCustomArgs;

const meta = {
  title: 'DiagramRepresentation',
  component: DiagramRepresentation,
  argTypes: {
    autoLayout: { control: 'boolean' },
    algorithm: { control: 'select', options: ['layered','rectpacking','stress','mrtree','radial','force','sporeOverlap','sporeCompaction'] },
    directionL: { control: 'select', if: { arg: 'algorithm', eq: 'layered' }, options: ['DOWN', 'RIGHT','LEFT','UP'] },
    directionT: { control: 'select', if: { arg: 'algorithm', eq: 'mrtree' }, options: ['DOWN', 'RIGHT','LEFT','UP'] },
    nodeNode: { },
    nodeNodeBetweenLayers: { if: { arg: 'algorithm', eq: 'layered' } },
    componentComponent: { if: { arg: 'algorithm', eq: 'layered' } },
    edgeNodeBetweenLayers: { if: { arg: 'algorithm', eq: 'layered' } },
    iterations: { if: { arg: 'algorithm', eq: 'force' } },
    maxIterations: { if: { arg: 'algorithm', eq: 'sporeOverlap' } },
  },
} satisfies Meta<DiagramStoryArgs>;

export default meta;

const DiagramStoryWrapper = ({ args, diagramGenerator }: { args: DiagramStoryArgs, diagramGenerator: () => any }) => {
  const initial = useMemo(() => diagramGenerator(), [diagramGenerator]);
  const [client, setClient] = useState(initial.client);
  const diagramRef = useRef(initial.diagram);
  const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
  const { resolveNodeOverlap } = useOverlap();

  const elkLayeredOptions : LayoutOptions = {
    'elk.algorithm': 'layered',
    'elk.layered.spacing.nodeNodeBetweenLayers': String(args.nodeNodeBetweenLayers),
    'elk.layered.spacing.edgeNodeBetweenLayers': String(args.edgeNodeBetweenLayers),
    'elk.spacing.componentComponent': String(args.componentComponent),
    'elk.spacing.nodeNode': String(args.nodeNode),
    'elk.direction': args.directionL,
    'elk.layering.strategy': 'NETWORK_SIMPLEX',
    'elk.layered.nodePlacement.strategy': 'NETWORK_SIMPLEX',
  };

  const elkRectPackingOptions: LayoutOptions = {
    'elk.algorithm': 'rectpacking',
    'elk.spacing.nodeNode': String(args.nodeNode),
    'elk.rectpacking.trybox': 'true',
    'widthApproximation.targetWidth': '1',
    'elk.contentAlignment': 'V_TOP H_CENTER',
  };

  const elkStressOptions: LayoutOptions = {
    'elk.algorithm': 'stress',
  };

  const elkTreeOptions: LayoutOptions = {
    'elk.algorithm': 'mrtree',
    'elk.spacing.nodeNode': String(args.nodeNode),
    'elk.direction': args.directionT,
    'elk.mrtree.weighting': 'MODEL_ORDER',
    'elk.mrtree.edgeRoutingMode': 'AVOID_OVERLAP',
  };

  const elkRadialOptions: LayoutOptions = {
    'elk.algorithm': 'radial',
    'elk.spacing.nodeNode': String(args.nodeNode),
    'elk.radial.wedgeCriteria': 'NODE_SIZE',
    'elk.radial.compactor': 'NONE',
  };

  const elkForceOptions: LayoutOptions = {
    'elk.algorithm': 'force',
    'elk.spacing.nodeNode': String(args.nodeNode),
    'elk.force.model': 'FRUCHTERMAN_REINGOLD',
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
    'elk.processingOrder.spanningTreeCostFunction': 'CIRCLE_UNDERLAP',
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

  const handleArrange = async (localArgs: any) => {
    const options = getLayoutOptions(localArgs.algorithm);
    const updatedDiagram = await newDiagram(
        diagramRef.current, 
        options, 
        reactFlowWrapper, 
        resolveNodeOverlap
    );
    diagramRef.current = updatedDiagram;
    setClient(createMockClient(updatedDiagram));
  };
  
  useEffect(() => {
    if (args.autoLayout) {
      handleArrange(args);
    }
  }, [args.autoLayout, args.algorithm]);

  return (
    <ApolloProvider client={client}>
      <I18nextProvider i18n={i18n}>
          <ServerContext.Provider value={{ httpOrigin: 'http://localhost' }}>
            <SelectionContextProvider initialSelection={{ entries: [] }}>
                <style>{`.react-flow { width: 100% !important; height: 100% !important;
                      min-height: 600px !important; min-width: 1100px !important; }`}</style>
                <div ref={reactFlowWrapper} style={{ width: '100%', height: '100%', position: 'relative' }}>
                  <DiagramRepresentation {...args} />
                </div>
            </SelectionContextProvider>
          </ServerContext.Provider>
      </I18nextProvider>
    </ApolloProvider>
  );
};

const defaultArgs = {
  autoLayout: false,
  algorithm: "layered",
  directionL: "DOWN",
  directionT: "DOWN",
  nodeNode: 80,
  nodeNodeBetweenLayers: 80,
  componentComponent: 60,
  edgeNodeBetweenLayers: 80,
  iterations: 300,
  maxIterations: 64,
};

export const fiveNode: StoryObj<DiagramStoryArgs> = {
  args: defaultArgs,
  render: (args) => <DiagramStoryWrapper args={args} diagramGenerator={fiveNodeDiagram} />
};

export const TwoNodeGroup: StoryObj<DiagramStoryArgs> = {
  args: defaultArgs,
  render: (args) => <DiagramStoryWrapper args={args} diagramGenerator={TwoNodeGroupDiagram} />
};