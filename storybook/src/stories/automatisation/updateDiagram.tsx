import ELK from 'elkjs/lib/elk.bundled';
import { doArrangeAll, type GQLDiagram, type GQLEdge, type GQLNode, type GQLNodeStyle} from '@eclipse-sirius/sirius-components-diagrams';
import { type LayoutOptions } from 'elkjs/lib/elk-api';
import type { RawDiagram } from '@eclipse-sirius/sirius-components-diagrams/renderer/layout/layout.types';
import { ApolloClient, ApolloProvider, InMemoryCache } from '@apollo/client';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import { useMemo, useRef, useState, useEffect, type MutableRefObject } from 'react';
import 'reactflow/dist/style.css';
import { SelectionContextProvider, ServerContext } from '@eclipse-sirius/sirius-components-core';
import { DiagramRepresentation, useOverlap } from '@eclipse-sirius/sirius-components-diagrams';
import { createDiagram } from './DiagramConstructor';
import './Global.css';

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    lng: 'en', fallbackLng: 'en',
    resources: { en: { translation: { 'paletteSearchField.placeholder': 'Search...' } } },
    interpolation: { escapeValue: false }
  });
}

const newDiagram = async (
    currentDiagram: GQLDiagram,
    options: LayoutOptions,
    reactFlowWrapper: MutableRefObject<HTMLDivElement | null>, 
    resolveNodeOverlap: (nodes: any[], dir: 'horizontal' | 'vertical') => any[]
): Promise<GQLDiagram> => {
    const elk = new ELK();

    const nodeMapParent = new Map<string, string>();

    const allNodes: GQLNode<GQLNodeStyle>[] = [];

    const recursiveNodeMapParent = (nodes: GQLNode<GQLNodeStyle>[], parentId?: string) => {
        nodes.forEach(node => {
            allNodes.push(node);
            if (parentId) {
                nodeMapParent.set(node.id, parentId);
            }
            if (node.childNodes && node.childNodes.length > 0) {
                recursiveNodeMapParent(node.childNodes, node.id);
            }
        });
    };

    recursiveNodeMapParent(currentDiagram.nodes);

    const inputNodes = allNodes.map(node => ({
        id: node.id,
        position: node.position,
        width: node.size.width,
        height: node.size.height,
        data: { 
            ...node, 
            insideLabel: node.insideLabel,
            isBorderNode: false, 
            pinned: node.pinned 
        },
        type: node.type,
        parentId: nodeMapParent.get(node.id)
    }));

    const inputEdges = currentDiagram.edges.map((e: GQLEdge) => ({
        id: e.id,
        source: e.sourceId,
        target: e.targetId,
        data: { bendingPoints: [] }
    }));

    try {
        const diagramResult: RawDiagram  = await doArrangeAll(
            reactFlowWrapper, 
            () => inputNodes, 
            () => inputEdges, 
            1, 
            (msg: string) => console.error(msg), 
            elk, 
            options
        );
        const hiddenContainer = document.getElementById('hidden-container');
        if (hiddenContainer) {
            hiddenContainer.remove();
        }
        const layoutedNodes = resolveNodeOverlap(diagramResult.nodes,'horizontal');
        const layoutedEdges = diagramResult.edges;
        const nodeMap = new Map<string, any>(layoutedNodes.map((n: any) => [n.id, n]));
        currentDiagram.nodes = currentDiagram.nodes.map((n: any) => {
            const updated = nodeMap.get(n.id);
            if (updated) {
                return {
                    ...n,
                    position: { x: updated.position.x, y: updated.position.y },
                    size: { width: updated.width, height: updated.height }
                };
            }
            return n;
        });
        currentDiagram.layoutData.nodeLayoutData = currentDiagram.layoutData.nodeLayoutData.map((nodesD: any) => {
                const updated = nodeMap.get(nodesD.id);
                if (updated) {
                    return {
                        ...nodesD,
                        position: { x: updated.position.x, y: updated.position.y },
                        size: { width: updated.width, height: updated.height }
                    };
                }
                return nodesD;
        });
        const edgeMap = new Map<string, any>(layoutedEdges.map((e: any) => [e.id, e]));
        currentDiagram.layoutData.edgeLayoutData = currentDiagram.layoutData.edgeLayoutData.map((edgesD: any) => {
                const updatedEdge = edgeMap.get(edgesD.id);
                
                if (updatedEdge && updatedEdge.data && updatedEdge.data.bendingPoints && updatedEdge.data.bendingPoints.length > 0) {
                    return {
                        ...edgesD,
                        bendingPoints: updatedEdge.data.bendingPoints
                    };
                }
                return { ...edgesD, bendingPoints: [] };
        });
        return currentDiagram ;
    } catch (e) {
        console.error("New Diagram Error", e);
        return currentDiagram;
    }
};

export const DiagramStoryWrapper = ({ args, diagramGenerator, layoutOptions}: { args:any, diagramGenerator: () => any, layoutOptions: LayoutOptions}) => {
    const initial = useMemo(() => diagramGenerator(), [diagramGenerator]);
    const [client, setClient] = useState(new ApolloClient({
        cache: new InMemoryCache()
    }));
    const diagramRef = useRef(initial.diagram);
    const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
    const { resolveNodeOverlap } = useOverlap();
    const [isInit, setIsInit] = useState<boolean>(false);

    const handleArrange = async () => {
      const updatedDiagram = await newDiagram(
          diagramRef.current, 
          layoutOptions, 
          reactFlowWrapper, 
          resolveNodeOverlap
      );
      diagramRef.current = updatedDiagram;
      setClient(createDiagram(updatedDiagram));
    };

    const optionsString = layoutOptions;

    useEffect(() => {
      if (args.autoLayout) {
        handleArrange();
        if(!isInit) { 
            setTimeout(() => handleArrange(), 1000); 
            setIsInit(true);
        }
      }
    }, [args.autoLayout,optionsString]);

    return (
    <ApolloProvider client={client}>
        <I18nextProvider i18n={i18n}>
            <ServerContext.Provider value={{ httpOrigin: 'http://localhost' }}>
                <SelectionContextProvider initialSelection={{ entries: [] }}>
                    <div ref={reactFlowWrapper} className={"diagramRepresentationContainer"} style={{ width: '100%', height: '100%', position: 'relative' }}>
                        <DiagramRepresentation {...args} />
                    </div>
                </SelectionContextProvider>
            </ServerContext.Provider>
        </I18nextProvider>
    </ApolloProvider>
    );
};
