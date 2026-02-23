import ELK from 'elkjs/lib/elk.bundled';
import { doArrangeAll, type GQLDiagram } from '@eclipse-sirius/sirius-components-diagrams';
import { type LayoutOptions } from 'elkjs/lib/elk-api';
import type { RawDiagram } from '@eclipse-sirius/sirius-components-diagrams/renderer/layout/layout.types';
import { ApolloProvider } from '@apollo/client';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import { useMemo, useRef, useState, useEffect, type MutableRefObject } from 'react';
import 'reactflow/dist/style.css';
import { SelectionContextProvider, ServerContext } from '@eclipse-sirius/sirius-components-core';
import { DiagramRepresentation, useOverlap } from '@eclipse-sirius/sirius-components-diagrams';
import { createMockClient } from './DiagramConstructor';

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    lng: 'en', fallbackLng: 'en',
    resources: { en: { translation: { 'paletteSearchField.placeholder': 'Search...' } } },
    interpolation: { escapeValue: false }
  });
}

const newDiagram = async (
    currentDiagram: any,
    options: LayoutOptions,
    reactFlowWrapper: MutableRefObject<HTMLDivElement | null>, 
    resolveNodeOverlap: (nodes: any[], dir: 'horizontal' | 'vertical') => any[],
    selectedNodesIds: string[] = [],
    nodeGroupsMap: Record<string, string> = {},
    groupSpecificOptions:Record<string, string>
): Promise<GQLDiagram> => {
    const diagramCopy = JSON.parse(JSON.stringify(currentDiagram));
    const elk = new ELK();
    //Transformation des données
    const inputNodes = diagramCopy.nodes.map((n: any) => ({
        id: n.id,
        position: n.position,
        width: n.size.width,
        height: n.size.height,
        selected: selectedNodesIds.includes(n.id),
        data: { 
            ...n, 
            insideLabel: n.insideLabel, 
            isBorderNode: false, 
            pinned: n.pinned,
            groupId: nodeGroupsMap[n.id] || 'grp-1',
            groupOptions: groupSpecificOptions && groupSpecificOptions[nodeGroupsMap[n.id] || 'grp-1'] ? groupSpecificOptions[nodeGroupsMap[n.id] || 'grp-1'] : null
        },
        type: n.type,
        parentId: n.parentNodeId,
        groupId: nodeGroupsMap[n.id] || 'grp-1'
    }));

    const inputEdges = diagramCopy.edges.map((e: any) => ({
        id: e.id,
        source: e.sourceId,
        target: e.targetId,
        data: { bendingPoints: [] }
    }));

    try {
        //Utilisation de useArrangeAll 
        const diagramResult: RawDiagram  = await doArrangeAll(
            reactFlowWrapper, 
            () => inputNodes, 
            () => inputEdges, 
            1, 
            (msg: string) => console.error(msg), 
            elk, 
            options
        );
        //Suppression des balises ELK fantômes
        const hiddenContainer = document.getElementById('hidden-container');
        if (hiddenContainer) {
            hiddenContainer.remove();
        }
        //Utilisation de useOverlap 
        const layoutedNodes = resolveNodeOverlap(diagramResult.nodes,'horizontal');
        const layoutedEdges = diagramResult.edges;
        //Réinsertion des nouvelles données calculée
        const nodeMap = new Map<string, any>(layoutedNodes.map((n: any) => [n.id, n]));
        diagramCopy.nodes = diagramCopy.nodes.map((n: any) => {
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
        diagramCopy.layoutData.nodeLayoutData = diagramCopy.layoutData.nodeLayoutData.map((nodesD: any) => {
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
        diagramCopy.layoutData.edgeLayoutData = diagramCopy.layoutData.edgeLayoutData.map((edgesD: any) => {
                const updatedEdge = edgeMap.get(edgesD.id);
                
                if (updatedEdge && updatedEdge.data && updatedEdge.data.bendingPoints && updatedEdge.data.bendingPoints.length > 0) {
                    return {
                        ...edgesD,
                        bendingPoints: updatedEdge.data.bendingPoints
                    };
                }
                return { ...edgesD, bendingPoints: [] };
        });
        return diagramCopy ;
    } catch (e) {
        console.error("New Diagram Error", e);
        return diagramCopy;
    }
};

export const DiagramStoryWrapper = ({ args, diagramGenerator, layoutOptions }: { args:any, diagramGenerator: () => any, layoutOptions: LayoutOptions }) => {
    const initial = useMemo(() => diagramGenerator(), [diagramGenerator]);
    const [client, setClient] = useState(initial.client);
    const diagramRef = useRef(initial.diagram);
    const reactFlowWrapper = useRef<HTMLDivElement | null>(null);
    const { resolveNodeOverlap } = useOverlap();

    const handleArrange = async () => {
      const updatedDiagram = await newDiagram(
          diagramRef.current, 
          layoutOptions, 
          reactFlowWrapper, 
          resolveNodeOverlap,
          args.selectedNodes,
          args.nodeGroups,
          args.groupSpecificOptions
      );
      diagramRef.current = updatedDiagram;
      setClient(createMockClient(updatedDiagram));
    };

    const optionsString = JSON.stringify(layoutOptions);
    const selectedNodesString = JSON.stringify(args.selectedNodes);
    const nodesGroupString = JSON.stringify(args.nodeGroups);
    const groupSpecificOptions = JSON.stringify(args.groupSpecificOptions);

    useEffect(() => {
      if (args.autoLayout) {
        handleArrange();
      }
    }, [args.autoLayout,optionsString, selectedNodesString,nodesGroupString,groupSpecificOptions]);

    return (
      <ApolloProvider client={client}>
        <I18nextProvider i18n={i18n}>
            <ServerContext.Provider value={{ httpOrigin: 'http://localhost' }}>
              <SelectionContextProvider initialSelection={{ entries: [] }}>
                  <style>{`.react-flow { width: 100% !important; height: 100% !important; min-height: 600px !important; min-width: 1100px !important;}`}</style>
                  <div ref={reactFlowWrapper} style={{ width: '100%', height: '100%', position: 'relative' }}>
                    <DiagramRepresentation {...args} />
                  </div>
              </SelectionContextProvider>
            </ServerContext.Provider>
        </I18nextProvider>
      </ApolloProvider>
    );
};
