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
import { Panels } from "@eclipse-sirius/sirius-components-core";
import { siriusWebTheme } from "@eclipse-sirius/sirius-web-application";
import AccountTreeIcon from "@mui/icons-material/AccountTree";
import LinkIcon from "@mui/icons-material/Link";
import MenuIcon from "@mui/icons-material/Menu";
import PhotoLibraryIcon from "@mui/icons-material/PhotoLibrary";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import SearchIcon from "@mui/icons-material/Search";
import { ThemeProvider } from "@mui/material/styles";
import i18n from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({});
}

const mockLeftContributions = [
  {
    id: "explorer",
    title: "Explorer",
    icon: <AccountTreeIcon />,
    component: () => null,
  },
  {
    id: "views",
    title: "Views",
    icon: <PhotoLibraryIcon />,
    component: () => null,
  },
  {
    id: "validation",
    title: "Validation",
    icon: <ReportProblemIcon />,
    component: () => null,
  },
  {
    id: "search",
    title: "Search",
    icon: <SearchIcon />,
    component: () => null,
  },
];

const mockRightContributions = [
  {
    id: "details",
    title: "Details",
    icon: <MenuIcon />,
    component: () => null,
  },
  {
    id: "query",
    title: "Query",
    icon: <PlayArrowIcon />,
    component: () => null,
  },
  {
    id: "relatedviews",
    title: "Related Views",
    icon: <PhotoLibraryIcon />,
    component: () => null,
  },
  {
    id: "relatedelements",
    title: "Related Elements",
    icon: <LinkIcon />,
    component: () => null,
  },
];

export const PanelWrapper = () => {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider theme={siriusWebTheme as any}>
        <Panels
          editingContextId="test"
          readOnly={false}
          leftContributions={mockLeftContributions as any}
          rightContributions={mockRightContributions as any}
          leftPanelConfiguration={null as any}
          rightPanelConfiguration={null as any}
          leftPanelInitialSize={20}
          rightPanelInitialSize={20}
          mainArea={
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                height: "100%",
                backgroundColor: "#f5f5f5",
              }}
            ></div>
          }
        />
      </ThemeProvider>
    </I18nextProvider>
  );
};
