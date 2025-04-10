import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { ArtworkList } from "./components/ArtworkList";
import { ArtworkSinglePage } from "./components/ArtworkSinglePage";

export const App: React.FC = () => {
  return (
    <Routes>
      <Route path="/" element={<ArtworkList />} />
      <Route
        path="/artwork/:museumSource/:id"
        element={<ArtworkSinglePage />}
      />
    </Routes>
  );
};
