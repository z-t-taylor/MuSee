import React, { useEffect, useState, ReactNode } from "react";
import { useParams } from "react-router-dom";
import { Artwork } from "../api/types";
import { fetchAllArtworks } from "../api/apiCalls";
import { AddArtworkButton } from "./AddArtworkButton";
import { Tabs } from "./Tabs";
import CircularProgress from "@mui/material/CircularProgress";

interface ArtworkIDParams {
  [key: string]: string | undefined;
}

export const ArtworkSinglePage: React.FC = () => {
  const { museumSource, id } = useParams<ArtworkIDParams>();
  const [artwork, setArtwork] = useState<Artwork | null>(null);
  const [err, setErr] = useState<Error | null>(null);

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const artworks = await fetchAllArtworks();

        const foundArtwork = artworks.find(
          (art) => art.id === id && art.museumSource === museumSource
        );
        console.log(
          "Fetching artwork with ID:",
          id,
          "and Museum Source:",
          museumSource
        );
        setArtwork(foundArtwork || null);
      } catch (error) {
        setErr(error as Error);
      }
    };
    if (museumSource && id) {
      fetchArtwork();
    }
  }, [museumSource, id]);

  function decodeHTMLEntities(text: string) {
    const textArea = document.createElement("textarea");
    textArea.innerHTML = text;
    return textArea.value;
  }

  return (
    <div>
      {err ? (
        <p>Error: {err.message}</p>
      ) : !artwork ? (
        <div className="flex flex-col items-center justify-center mt-4 space-y-4">
          <p className="mb-2 text-[#195183]">Loading..</p>
          <CircularProgress />
        </div>
      ) : (
        <div>
          <div className="flex flex-row mt-6 mb-10">
            <div className=" flex flex-col px-5 border-r">
              <h1 className="font-serif font-medium text-2xl">
                {artwork.title}
              </h1>
              <h3 className="text-base italic">
                By {artwork.artist || "Unknown"}
              </h3>
              <h4 className="text-sm">{artwork.origin || "Unknown"}</h4>
            </div>
            <img
              src={artwork.image?.imageURL}
              alt={artwork.image?.altText || artwork.title}
              loading="lazy"
              className="w-[75%] ml-2 pl-2"
            />
          </div>
          <div className="flex flex-col mt-10">
            <div className="flex justify-end mb-4">
              <AddArtworkButton artwork={artwork} variant="button" />
            </div>
            <div className="flex flex-col md:flex-row gap-8 mb-20">
              <div className="w-full md:w-4/5">
                <h2 className="text-lg font-medium pb-5">Artwork Details</h2>
                <Tabs
                  tabs={
                    [
                      {
                        label: "About",
                        content: (
                          <div className="space-y-2">
                            <p className="font-sans">
                              <span className="font-bold">Title: </span>
                              {artwork.title || "Unknown"}
                            </p>
                            <p>
                              <span>Artist: </span>{" "}
                              {artwork.artist || "Unknown"}
                            </p>
                            <p>
                              <span>Dated: </span>{" "}
                              {artwork.creationDate || "Unknown"}
                            </p>
                            <p>
                              <span>Medium: </span>{" "}
                              {artwork.medium || "Unknown"}
                            </p>
                            <p>
                              <span>Culture: </span>{" "}
                              {artwork.origin || "Unknown"}
                            </p>
                            <p>
                              <span>Styles: </span>{" "}
                              {artwork.styles || "Unknown"}
                            </p>
                          </div>
                        ),
                      },
                      artwork.description
                        ? {
                            label: "Description",
                            content: (
                              <>
                                {artwork.description && (
                                  <div className="mt-2">
                                    {artwork.description
                                      .split("</p>")
                                      .map((chunk) =>
                                        chunk.replace(/<[^>]+>/g, "").trim()
                                      )
                                      .filter(Boolean)
                                      .map((para, i) => (
                                        <p key={i}>
                                          {decodeHTMLEntities(para)}
                                        </p>
                                      ))}
                                  </div>
                                )}
                              </>
                            ),
                          }
                        : null,
                      artwork.exhibitionHistory
                        ? {
                            label: "Exhibition History",
                            content: (
                              <ul className="list-disc pl-5 space-y-1">
                                {artwork.exhibitionHistory
                                  .split(/\n\n|;\s*/)
                                  .map((h, i) => (
                                    <li key={i}>
                                      {h.trim()}
                                      {!h.trim().endsWith(".") && "."}
                                    </li>
                                  ))}
                              </ul>
                            ),
                          }
                        : null,
                      {
                        label: "Learn More",
                        content: (
                          <div className="flex mt-2">
                            <a
                              href={artwork.museumLink}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline"
                            >
                              Click here for more about this piece
                            </a>
                          </div>
                        ),
                      },
                    ].filter(Boolean) as { label: string; content: ReactNode }[]
                  }
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
