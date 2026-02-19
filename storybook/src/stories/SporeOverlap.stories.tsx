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


type StoryCustomArgs = { autoLayout?: boolean; nodeNode: number; maxIterations: number; };
type DiagramStoryArgs = ComponentProps<typeof DiagramRepresentation> & StoryCustomArgs;

const meta = {
  title: 'Spore Overlap Algorithm',
  component: DiagramRepresentation,
  tags: ['autodocs'],
  argTypes: {
    autoLayout: { control: 'boolean' },
    nodeNode: { },
    maxIterations: { },
  },
} satisfies Meta<DiagramStoryArgs>;

export default meta;

const DiagramStoryWrapper = ({ args, diagramGenerator }: { args: DiagramStoryArgs, diagramGenerator: () => any }) => {
    const initial = useMemo(() => diagramGenerator(), [diagramGenerator]);
    const [client, setClient] = useState(initial.client);
    const diagramRef = useRef(initial.diagram);
    const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
    const { resolveNodeOverlap } = useOverlap();

    const elkSporeOverlapOptions: LayoutOptions = {
        'elk.algorithm': 'sporeOverlap',
        'elk.spacing.nodeNode': String(args.nodeNode),
        'elk.overlapRemoval.maxIterations': String(args.maxIterations),
    };

    const handleArrange = async () => {
      const updatedDiagram = await newDiagram(
          diagramRef.current, 
          elkSporeOverlapOptions, 
          reactFlowWrapper, 
          resolveNodeOverlap
      );
      diagramRef.current = updatedDiagram;
      setClient(createMockClient(updatedDiagram));
    };
    
    useEffect(() => {
      if (args.autoLayout) {
        handleArrange();
      }
    }, [args.autoLayout]);

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
    nodeNode: 80,
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