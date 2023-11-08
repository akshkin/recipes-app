"use client";

import dynamic from "next/dynamic";
import RecipePDFDocument from "./RecipePDFDocument";

const PDFDownloadLink = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
  {
    ssr: false,
    loading: () => <p>Loading...</p>,
  }
);

interface Props {
  recipe: string;
  title?: string;
}

function RecipePdfLink({ recipe, title }: Props) {
  return (
    <div className="secondary-btn w-[200px] mb-6 cursor-pointer">
      <PDFDownloadLink
        document={<RecipePDFDocument recipe={recipe} />}
        fileName={decodeURIComponent(title || "file")}
      >
        {({ blob, url, loading, error }) =>
          error
            ? "something went wrong"
            : loading
            ? "Loading document..."
            : "Download PDF"
        }
      </PDFDownloadLink>
    </div>
  );
}

export default RecipePdfLink;
