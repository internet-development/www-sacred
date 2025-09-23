import React from "react";
import { Routes, Route } from "react-router-dom";
import Providers from "@components/Providers";
import Layout from "./Layout";
import HomePage from "./pages/HomePage";
import ConceptOnePage from "./pages/ConceptOnePage";
import ConceptTwoPage from "./pages/ConceptTwoPage";

function App() {
  return (
    <Providers>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<HomePage />} />
          <Route path="concept-1" element={<ConceptOnePage />} />
          <Route path="concept-2" element={<ConceptTwoPage />} />
        </Route>
      </Routes>
    </Providers>
  );
}

export default App;
