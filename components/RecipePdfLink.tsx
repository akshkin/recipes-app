"use client";

import dynamic from "next/dynamic";
import RecipePDFDocument from "./RecipePDFDocument";
import { DownloadIcon } from "lucide-react";
import { Button } from "./ui/button";

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
		<Button className="secondary-outline-btn border-white cursor-pointer">
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
						<span className="flex items-center gap-2">
							<DownloadIcon /> Download PDF
						</span>
					)
				}
			</PDFDownloadLink>
		</Button>
	);
}

export default RecipePdfLink;
