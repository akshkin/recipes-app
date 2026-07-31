import Footer from "@/components/Footer";
import Loading from "@/components/Loading";
import Navbar from "@/components/navbar/Navbar";
import Sidebar from "@/components/Sidebar";
import { Suspense } from "react";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className="">
			<Navbar />
			<div className="flex">
				<div className="w-full">
					<Suspense fallback={<Loading />}>{children}</Suspense>
				</div>
				{/* <Sidebar /> */}
			</div>
			<Footer />
			<ToastContainer />
		</div>
	);
}

export default Layout;
