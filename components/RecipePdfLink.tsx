"use client";

import dynamic from "next/dynamic";
import RecipePDFDocument from "./RecipePDFDocument";

const PDFDownloadLink = dynamic<any>(
	() => import("@react-pdf/renderer").then((mod) => mod.PDFDownloadLink),
	{
		ssr: false,
		loading: () => <p>Loading...</p>,
	},
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
				{({ loading, error }: { loading: boolean; error: boolean }) =>
					error ? (
						<span>Something went wrong</span>
					) : loading ? (
						<span>Loading document...</span>
					) : (
						<span>Download PDF</span>
					)
				}
			</PDFDownloadLink>
		</div>
	);
}

export default RecipePdfLink;
