type SidebarLayoutProps = {
	headerChildren: React.ReactNode;
	mainChildren: React.ReactNode;
	asideChildren: React.ReactNode;
};

function SidebarLayout({
	headerChildren,
	mainChildren,
	asideChildren,
}: SidebarLayoutProps) {
	return (
		<div className="relative">
			<header className="flex bg-cover bg-center max-sm:flex-col gap-4 p-6 lg:p-8 text-white relative">
				{headerChildren}
			</header>
			<div className="w-full grid grid-cols-1 lg:grid-cols-[1fr_350px] gap-3">
				<main className="w-full max-w-6xl mx-auto p-6 lg:p-8 ">
					{mainChildren}
				</main>
				<aside className="bg-white max-lg:order-first lg:block self-start lg:sticky h-fit lg:top-20 lg:-mt-[15rem] lg:z-20 lg:mr-6 rounded-md p-4 mb-2 shadow max-sm:w-full text-gray-800">
					{asideChildren}
				</aside>
			</div>
		</div>
	);
}

export default SidebarLayout;
