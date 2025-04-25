import React from "react";
import "./App.css";
import { Routes, Route } from "react-router-dom";
import { ArtworkList } from "./components/ArtworkList";
import { ArtworkSinglePage } from "./components/ArtworkSinglePage";
import { ExhibitionList } from "./components/ExhibitionList";
import { userExhibitionStore } from "./store/exhibitionStore";
import { Header } from "./components/Header";
import { ExhibitionPage } from "./components/ExhibitionPage";
import { Sidebar } from "./components/Sidebar";

export const App: React.FC = () => {
  const exhibitions = userExhibitionStore((state) => state.exhibitions);
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 h-full overflow-hidden">
        <Sidebar />
        <main className="flex-1 overflow-y-auto pl-6 pr-6 py-4">
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
            <Route path="/exhibitions/:slug" element={<ExhibitionPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};
