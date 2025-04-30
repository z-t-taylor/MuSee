import React from "react";
import { Routes, Route } from "react-router-dom";
import { ArtworkList } from "./components/ArtworkList";
import { ArtworkSinglePage } from "./components/ArtworkSinglePage";
import { ExhibitionList } from "./components/ExhibitionList";
import { userExhibitionStore } from "./store/exhibitionStore";
import { Header } from "./components/Header";
import { ExhibitionPage } from "./components/ExhibitionPage";
import { Sidebar } from "./components/Sidebar";
import { Footer } from "./components/Footer";

export const App: React.FC = () => {
  const exhibitions = userExhibitionStore((state) => state.exhibitions);
  return (
    <div className="flex h-screen flex-col">
      <Header />
      <div className="flex flex-1 min-h-0">
        <div className="hidden md:block">
          <Sidebar />
        </div>
        <main className="flex-1 overflow-y-auto relative md:ml-59 pb-16 md:pb-0 h-[calc(100vh-4rem)] md:h-auto">
          <div className="p-6">
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
          </div>
          <Footer />
        </main>
        <div className="md:hidden fixed bottom-0 w-full z-50 h-16">
          <Sidebar />
        </div>
      </div>
    </div>
  );
};
