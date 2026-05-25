import CancelButton from "./ui/CancelButton";
import {
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";

interface ModalProps {
	triggerText: string | React.ReactNode;
	text: string;
	handleConfirm?: () => void;
}

function Modal({ triggerText, text, handleConfirm }: ModalProps) {
	return (
		<Dialog>
			<DialogTrigger asChild>{triggerText}</DialogTrigger>
			<DialogContent className="bg-white max-w-md max-md:mx-4 rounded-lg">
				<DialogHeader>
					<DialogTitle className="text-left">
						Are you absolutely sure?
					</DialogTitle>
					<DialogDescription className="text-left text-md mt-4">
						This action cannot be undone. This will permanently delete {text}.
					</DialogDescription>
				</DialogHeader>
				<div className="flex mt-4 gap-4 justify-end">
					<DialogClose asChild>
						<button className="danger-btn" onClick={handleConfirm}>
							Confirm
						</button>
					</DialogClose>

					<DialogClose asChild>
						<button className="IconButton" aria-label="Close">
							Close
						</button>
					</DialogClose>
				</div>
			</DialogContent>
		</Dialog>
	);
}

export default Modal;
