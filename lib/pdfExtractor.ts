/* 
Set worker path to keep the main thread responsive so that the extraction process 
occurs in the background (separate thread) without blocking the UI. 
This is crucial for performance, especially when dealing with large PDF files.
*/

export async function extractTextFromPDF(file: File): Promise<string> {
	const pdfjsLib = await import("pdfjs-dist/legacy/build/pdf.mjs");
	const PDFJSWorker = await import("pdfjs-dist/legacy/build/pdf.worker");
	// using CDN was failing when used as ..../pdf.worker.mjs but using it like as below works reliably
	// Using the local worker file instead of CDN was failing in some environments, so switched to the CDN version which is more reliable across different setups.
	if (typeof window !== "undefined") {
		pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/${PDFJSWorker.default}`;
	}
	const arrayBuffer = await file.arrayBuffer();
	const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

	let fullText = "";

	// Extract text from all pages. PDF.js uses 1-based indexing for pages.
	for (let i = 1; i <= pdf.numPages; i++) {
		const page = await pdf.getPage(i);
		const textContent = await page.getTextContent();
		/*
        getTextContent() returns an object with an 'items' array as follows, 
        where each item represents a piece of text on the page.
        {
            items: [
                { str: "Chocolate", x: 100, y: 200, ... },
                { str: "Chip", x: 180, y: 200, ... },
                { str: "Cookies", x: 100, y: 180, ... },
                // ... more items
            ]
        }
    */
		const pageText = textContent.items.map((item: any) => item.str).join(" ");
		fullText += pageText + "\n";
	}

	if (fullText.trim().length < 100) {
		throw new Error(
			"PDF appears to be scanned or in a language other than English. Text extraction failed.",
		);
	}

	return fullText;
}
