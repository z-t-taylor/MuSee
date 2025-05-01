import React, { useEffect, useState, ReactNode, useRef } from "react";
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
  const [isPortrait, setIsPortrait] = useState(false);
  const imgRef = useRef<HTMLImageElement>(null);

  const handleImageLoad = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    setIsPortrait(img.naturalHeight > img.naturalWidth);
  };

  useEffect(() => {
    const fetchArtwork = async () => {
      try {
        const artworks = await fetchAllArtworks();

        const foundArtwork = artworks.find(
          (art) => art.id === id && art.museumSource === museumSource
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
        <p className="text-center pb-12">
          Error loading artwork: {err.message}
        </p>
      ) : !artwork ? (
        <div className="flex flex-col items-center justify-center mt-4 space-y-4">
          <p className="mb-2 text-[#195183]">Loading artwork..</p>
          <CircularProgress />
        </div>
      ) : (
        <div>
          <div className="flex flex-col md:flex-row mt-3 md:mt-6 mb-10">
            <div className="flex flex-col px-5 md:w-1/3 md:border-r pb-5 md:pb-0 mb-5 md:mb-0">
              <h1 className="font-serif font-medium text-2xl">
                {artwork.title}
              </h1>
              <h3 className="text-base italic">
                By {artwork.artist || "Unknown"}
              </h3>
              <h4 className="text-sm">{artwork.origin || "Unknown"}</h4>
            </div>
            <div
              className={`flex-1 ${
                isPortrait ? "flex justify-center" : "flex justify-end md:mr-2"
              } md:pl-8`}
            >
              <img
                ref={imgRef}
                src={artwork.image?.imageURL}
                alt={artwork.image?.altText || artwork.title}
                loading="lazy"
                className={`${
                  isPortrait
                    ? " w-full md:w-[50%]"
                    : "w-full md:w-[75%] ml-2 pl-2"
                }`}
                onLoad={handleImageLoad}
              />
            </div>
          </div>
          <div className="flex flex-col mt-10">
            <div className="flex justify-end mb-4 mr-1 md:mr-2">
              <AddArtworkButton artwork={artwork} variant="button" />
            </div>
            <div className="flex flex-col md:flex-row gap-8 mb-3 md:mb-20">
              <div className="w-full md:w-4/5">
                <h2 className="text-lg font-medium pb-5 pt-5 md:pt-1">
                  Artwork Details
                </h2>
                <Tabs
                  tabs={
                    [
                      {
                        label: "About",
                        content: (
                          <div className="space-y-2">
                            <p className="font-sans">
                              Title: {artwork.title || "Unknown"}
                            </p>
                            <p className="font-sans">
                              Artist: {artwork.artist || "Unknown"}
                            </p>
                            <p className="font-sans">
                              Dated: {artwork.creationDate || "Unknown"}
                            </p>
                            <p className="font-sans">
                              Medium: {artwork.medium || "Unknown"}
                            </p>
                            <p className="font-sans">
                              Culture: {artwork.origin || "Unknown"}
                            </p>
                            {artwork.styles && artwork.styles.length >= 1 && (
                              <p className="font-sans">
                                Classification: {artwork.styles}
                              </p>
                            )}
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
                                        chunk
                                          .replace(/<[^>]+>/g, "")
                                          .trim()
                                          .replace(
                                            /\s*Click here to learn more about the collection\.?\s*/gi,
                                            ""
                                          )
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
