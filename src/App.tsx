import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { ArtworkList } from "./components/ArtworkList";
import { ArtworkSinglePage } from "./components/ArtworkSinglePage";
import { ExhibitionList } from "./components/ExhibitionList";
import { userExhibitionStore } from "./store/exhibitionStore";

export const App: React.FC = () => {
  const exhibitions = userExhibitionStore((state) => state.exhibitions);
  return (
    <Routes>
      <Route path="/" element={<ArtworkList />} />
      <Route
        path="/artwork/:museumSource/:id"
        element={<ArtworkSinglePage />}
      />
      <Route
        path="/exhibitions"
        element={<ExhibitionList exhibitions={exhibitions} />}
      />
    </Routes>
  );
};
