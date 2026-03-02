
import { type LayoutOptions } from 'elkjs/lib/elk-api';
import { ApolloProvider} from '@apollo/client';
import { I18nextProvider, initReactI18next } from 'react-i18next';
import i18n from 'i18next';
import { useEffect, useMemo,useRef} from 'react';
import 'reactflow/dist/style.css';
import { SelectionContextProvider, ServerContext, type WorkbenchMainRepresentationHandle } from '@eclipse-sirius/sirius-components-core';
import { DiagramRepresentation } from '@eclipse-sirius/sirius-components-diagrams';
import { createDiagram } from './DiagramConstructor';
import './Global.css';

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({
    lng: 'en', fallbackLng: 'en',
    resources: { en: { translation: { 'paletteSearchField.placeholder': 'Search...' } } },
    interpolation: { escapeValue: false }
  });
}

export const DiagramStoryWrapper = ({ args, diagramGenerator, layoutOptions}: { args:any, diagramGenerator: () => any, layoutOptions: LayoutOptions}) => {
    const diagramHandleRef = useRef<WorkbenchMainRepresentationHandle>(null);
    const initial = useMemo(() => diagramGenerator(), [diagramGenerator]);
    const client = createDiagram(initial.diagram)

    useEffect(() => {
        if (!args.autoLayout) return;
        setTimeout(() => {
            if (diagramHandleRef.current?.applyLayout) {
                diagramHandleRef.current.applyLayout(layoutOptions);
            } 
        }, 1000);
    }, [args.autoLayout, layoutOptions]);
    return (
    <ApolloProvider client={client}>
        <I18nextProvider i18n={i18n}>
            <ServerContext.Provider value={{ httpOrigin: 'http://localhost' }}>
                <SelectionContextProvider initialSelection={{ entries: [] }}>
                    <div className={"diagramRepresentationContainer"}>
                        <DiagramRepresentation {...args} ref={diagramHandleRef}/>
                    </div>
                </SelectionContextProvider>
            </ServerContext.Provider>
        </I18nextProvider>
    </ApolloProvider>
    );
};
