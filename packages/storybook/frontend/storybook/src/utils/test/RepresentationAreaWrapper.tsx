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
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import { SelectionContextProvider } from "@eclipse-sirius/sirius-components-core";
import { RepresentationsArea } from "@eclipse-sirius/sirius-web-application";
import i18n from "i18next";
import { I18nextProvider, initReactI18next } from "react-i18next";

if (!i18n.isInitialized) {
  i18n.use(initReactI18next).init({});
}

const storybookClient = new ApolloClient({
  cache: new InMemoryCache(),
});

export const RepresentationsAreaWrapper = () => {
  return (
    <ApolloProvider client={storybookClient}>
      <I18nextProvider i18n={i18n}>
        <SelectionContextProvider initialSelection={{ entries: [] }}>
          <RepresentationsArea editingContextId="test" />
        </SelectionContextProvider>
      </I18nextProvider>
    </ApolloProvider>
  );
};
