import React from "react";
import { UserExhibition } from "../api/userExhibition";
import ExhibitionCard from "./ExhibitionCard";

interface ExhibitionListProps {
  exhibitions?: UserExhibition[];
}

export const ExhibitionList: React.FC<ExhibitionListProps> = ({
  exhibitions,
}) => {
  return (
    <div>
      {exhibitions &&
        exhibitions.map((exhibition) => (
          <ExhibitionCard
            key={exhibition.exhibitionId}
            exhibition={exhibition}
          />
        ))}
    </div>
  );
};
