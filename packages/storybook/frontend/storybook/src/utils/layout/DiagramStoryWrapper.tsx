/*******************************************************************************
 * Copyright (c) 2026 Obeo.
 * This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v2.0
 * which accompanies this distribution, and is available at
 * https://www.eclipse.org/legal/epl-2.0/
 *
 * SPDX-License-Identifier: EPL-2.0
 *
 * Contributors:
 *     Obeo - initial API and implementation
 *******************************************************************************/
import { ApolloProvider } from "@apollo/client";
import {
  ExtensionProvider,
  ExtensionRegistry,
  SelectionContextProvider,
  ServerContext,
} from "@eclipse-sirius/sirius-components-core";
import {
  DiagramRepresentation,
  GQLDiagram,
  WorkbenchDiagramRepresentationHandle,
  diagramToolbarActionExtensionPoint,
} from "@eclipse-sirius/sirius-components-diagrams";
import AdbIcon from "@mui/icons-material/Adb";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import "@xyflow/react/dist/style.css";
import { LayoutOptions } from "elkjs/lib/elk-api";
import i18n from "i18next";
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { I18nextProvider, initReactI18next } from "react-i18next";
import { action } from "storybook/actions";
import "./global.css";
import { DiagramStoryArgs } from "./layoutConfigurations";
import { computeLayoutMetrics } from "./layoutMetrics";
import { useClient } from "./useClient";

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({});
}

const storybookRegistry = new ExtensionRegistry();

const EvaluatorContext = createContext<{
  handleReadMetrics: () => void;
  handleAiSubmit: () => Promise<void>;
  isAILoading: boolean;
} | null>(null);

const ToolbarActions = () => {
  const context = useContext(EvaluatorContext);
  if (!context) return null;

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      <Tooltip title="Évaluer le diagramme">
        <IconButton onClick={context.handleReadMetrics} size="small">
          <InsertChartIcon fontSize="small" />
        </IconButton>
      </Tooltip>

      <Tooltip title="Évaluer par l'IA">
        <span>
          {" "}
          <IconButton
            onClick={context.handleAiSubmit}
            disabled={context.isAILoading}
            size="small"
          >
            <AdbIcon fontSize="small" />
          </IconButton>
        </span>
      </Tooltip>
    </div>
  );
};

storybookRegistry.addComponent(diagramToolbarActionExtensionPoint, {
  identifier: "ai_evaluator_actions",
  Component: ToolbarActions,
});

export const DiagramStoryWrapper = ({
  args,
  diagram,
  layoutOptions,
}: {
  args: DiagramStoryArgs & { aiPrompt?: string };
  diagram: () => GQLDiagram;
  layoutOptions: LayoutOptions;
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const diagramHandleRef = useRef<WorkbenchDiagramRepresentationHandle>(null);
  const initialDiagram = useMemo(() => diagram(), []);
  const client = useClient(initialDiagram);
  const [isAILoading, setIsAILoading] = useState(false);

  useEffect(() => {
    if (!args.autoLayout) return;
    setTimeout(() => {
      if (diagramHandleRef.current?.applyLayout) {
        diagramHandleRef.current.applyLayout(layoutOptions);
      }
    }, 1000);
  }, [args.autoLayout, layoutOptions]);

  const handleReadMetrics = () => {
    if (!containerRef.current) return;
    const metrics = computeLayoutMetrics(initialDiagram, containerRef.current);
    const diagramName = initialDiagram.metadata.label || "Diagram";
    const logScore = action(`Score : ${diagramName}`);

    logScore({
      "Nombre de croisements d'edges": metrics.edgeCrossings,
      "Nombre de noeud traverse par des edges differents":
        metrics.edgeNodeCrossings,
      "Nombre de noeuds qui se superposent": metrics.nodeOverlap,
      "Nombre de bendings points moyen": metrics.averageBendingsPoints,
      "Utilisation de l'espace (%)": metrics.spaceUtilization,
      "Ecart-Type de la taille des edges": metrics.edgeStandardDeviation,
      "Orientation du flux (%)": metrics.flowOrientation,
      "Regroupement spatial (%)": metrics.spatialGrouping,
      "Score global": metrics.score,
    });
  };
  const extractImage = (): Promise<string | null> => {
    return new Promise((resolve) => {
      if (diagramHandleRef.current?.exportSVG) {
        diagramHandleRef.current.exportSVG((dataUrl: string) => {
          const img = new Image();
          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.width;
            canvas.height = img.height;

            const ctx = canvas.getContext("2d");
            if (!ctx) {
              resolve(null);
              return;
            }
            ctx.fillStyle = "#ffffff";
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0);
            const base64Image = canvas
              .toDataURL("image/jpeg", 0.7)
              .replace("data:image/jpeg;base64,", "");

            resolve(base64Image);
          };

          img.src = dataUrl;
        });
      } else {
        resolve(null);
      }
    });
  };

  const handleAiSubmit = async () => {
    setIsAILoading(true);
    try {
      const base64Image = await extractImage();

      if (!base64Image) {
        action("Erreur IA")("Impossible de capturer le diagramme.");
        return;
      }

      const prompt =
        args.aiPrompt ||
        "Fais une critique rapide de ce diagramme généré automatiquement. Donne une note sur 10.Règle importante : Sois indulgent et adapte ta note à la simplicité du diagramme. Pour un diagramme avec peu de nœuds, il est normal d'avoir de l'espace vide, ne pénalise pas cela. Fais une liste à puces en 3 points maximum de ce qui fonctionne bien visuellement, puis 3 points sur ce qui gêne vraiment la lecture (croisements, superpositions, mauvaise lisibilité). Reste bref et constructif.";

      const apiResponse = await fetch(
        "http://localhost:8081/api/evaluate-diagram",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
          body: JSON.stringify({
            instruction: prompt,
            diagramData: base64Image,
          }),
        },
      );

      if (!apiResponse.ok) throw new Error("Erreur serveur");

      const result = await apiResponse.json();

      action("Réponse IA")(result.answer);
    } catch (error) {
      console.error(error);
      action("Erreur IA")("Échec de l'envoi à l'IA. Vérifie la console.");
    } finally {
      setIsAILoading(false);
    }
  };

  return (
    <ApolloProvider client={client}>
      <I18nextProvider i18n={i18n}>
        <ServerContext.Provider value={{ httpOrigin: "http://localhost" }}>
          <SelectionContextProvider initialSelection={{ entries: [] }}>
            <ExtensionProvider registry={storybookRegistry}>
              <EvaluatorContext.Provider
                value={{ handleReadMetrics, handleAiSubmit, isAILoading }}
              >
                <div
                  ref={containerRef}
                  style={{
                    position: "relative",
                    width: "100%",
                    height: "100%",
                  }}
                  className={"diagramRepresentationContainer"}
                >
                  <DiagramRepresentation {...args} ref={diagramHandleRef} />
                </div>
              </EvaluatorContext.Provider>
            </ExtensionProvider>
          </SelectionContextProvider>
        </ServerContext.Provider>
      </I18nextProvider>
    </ApolloProvider>
  );
};
