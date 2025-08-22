import { type ReactNode, useState } from 'react'
import { BarChart3, Home, Settings, HelpCircle, Menu, X } from 'lucide-react'
import { NavLink, useLocation } from 'react-router-dom'

interface AppShellProps {
	children: ReactNode
}

const navigation = [
	{ name: 'Insights', href: '/insights', icon: BarChart3 },
	{ name: 'Dashboard', href: '/', icon: Home, disabled: true },
	{ name: 'Settings', href: '/settings', icon: Settings, disabled: true },
	{ name: 'Help', href: '/help', icon: HelpCircle, disabled: true }
]

export const AppShell = ({ children }: AppShellProps) => {
	const location = useLocation()
	const [isSidebarExpanded, setIsSidebarExpanded] = useState(true)

	const toggleSidebar = () => {
		setIsSidebarExpanded(!isSidebarExpanded)
	}

	return (
		<div className="min-h-screen bg-gray-50">
			{/* Header with top navigation */}
			<header className="bg-white border-b border-gray-200">
				<div className="px-4 sm:px-6 lg:px-8">
					<div className="flex justify-between items-center h-16">
						{/* Logo and mobile menu button */}
						<div className="flex items-center gap-3">
							{/* Mobile menu button - only visible on mobile */}
							<button
								onClick={toggleSidebar}
								className="md:hidden p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
								aria-label="Toggle sidebar"
							>
								<Menu size={20} />
							</button>

							<div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
								<BarChart3 size={18} className="text-white" />
							</div>
							<h1 className="text-lg font-bold text-gray-900">Insights</h1>
						</div>

						{/* Environment indicator */}
						<div className="text-sm text-gray-600">Demo Environment</div>
					</div>
				</div>
			</header>

			<div className="flex h-[calc(100vh-4rem)]">
				{/* Mobile sidebar overlay - only show on mobile when expanded */}
				{isSidebarExpanded && (
					<div className="fixed inset-0 z-40 md:hidden" aria-hidden="true">
						<div
							className="absolute inset-0 bg-gray-600 opacity-75"
							onClick={toggleSidebar}
						></div>
					</div>
				)}

				{/* Sidebar navigation */}
				<aside
					className={`${
						isSidebarExpanded ? 'translate-x-0' : '-translate-x-full'
					} fixed inset-y-0 left-0 z-50 bg-white border-r border-gray-200 transform transition-all duration-300 ease-in-out md:translate-x-0 md:static md:inset-0 md:flex ${
						isSidebarExpanded ? 'w-64' : 'md:w-16'
					}`}
				>
					{/* Mobile close button */}
					<div className="absolute top-0 right-0 -mr-12 pt-2 md:hidden">
						<button
							onClick={toggleSidebar}
							className="ml-1 flex items-center justify-center h-10 w-10 rounded-full focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
							aria-label="Close sidebar"
						>
							<X size={20} className="text-white" />
						</button>
					</div>

					<nav
						className="flex-1 flex flex-col overflow-y-auto"
						aria-label="Main navigation"
					>
						<div className="flex-1 px-2 space-y-1 py-4">
							{navigation.map((item) => {
								const Icon = item.icon
								const isActive = location.pathname === item.href
								return (
									<NavLink
										key={item.name}
										to={item.href}
										className={`group flex items-center ${
											isSidebarExpanded
												? 'px-2 py-2'
												: 'px-3 py-2 justify-center'
										} text-sm font-medium rounded-md transition-colors duration-150 ${
											item.disabled
												? 'text-gray-400 cursor-not-allowed'
												: isActive
												? 'bg-blue-50 text-blue-700' +
												  (isSidebarExpanded
														? ' border-r-2 border-blue-500'
														: '')
												: 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
										}`}
										onClick={(e) => {
											if (item.disabled) {
												e.preventDefault()
											}
										}}
										title={!isSidebarExpanded ? item.name : undefined}
									>
										<Icon
											className={`${
												isSidebarExpanded ? 'mr-3' : ''
											} flex-shrink-0 h-5 w-5 ${
												item.disabled
													? 'text-gray-400'
													: 'text-gray-500 group-hover:text-blue-500'
											}`}
										/>
										{isSidebarExpanded && (
											<>
												{item.name}
												{item.disabled && (
													<span className="ml-auto text-xs text-gray-400">
														Soon
													</span>
												)}
											</>
										)}
									</NavLink>
								)
							})}
						</div>

						{/* Footer with toggle button */}
						<footer
							className={`flex-shrink-0 border-t border-gray-200 ${
								!isSidebarExpanded ? 'hidden' : ''
							}`}
						>
							<div className="p-4 flex items-center justify-between">
								<div className="text-xs text-gray-500">
									<div className="font-medium">PRD1 - Foundations Demo</div>
									<div className="mt-0.5">React Flow + Tailwind CSS</div>
								</div>
								<button
									onClick={toggleSidebar}
									className="p-1.5 rounded-md text-gray-500 hover:text-blue-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-150"
									aria-label="Toggle sidebar"
									title="Collapse sidebar"
								>
									<Menu className="h-4 w-4" />
								</button>
							</div>
						</footer>

						{/* Toggle button for collapsed state - positioned at bottom */}
						{!isSidebarExpanded && (
							<div className="px-1 mb-2 flex justify-center">
								<button
									onClick={toggleSidebar}
									className="p-1.5 rounded-md text-gray-500 hover:text-blue-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors duration-150"
									aria-label="Toggle sidebar"
									title="Expand sidebar"
								>
									<Menu className="h-4 w-4" />
								</button>
							</div>
						)}
					</nav>
				</aside>

				{/* Main content area */}
				<main className="flex-1 overflow-y-auto focus:outline-none transition-all duration-300 ease-in-out">
					<div className="py-6">
						<div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
							{children}
						</div>
					</div>
				</main>
			</div>
		</div>
	)
}
