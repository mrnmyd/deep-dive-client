import { Outlet } from 'react-router-dom'
import { Footer } from './public-footer'
import { PublicHeader } from './public-header'

export function PublicLayout() {
    return (
        <div className="min-h-screen flex flex-col">
            <PublicHeader />

            <main className="container flex-1 min-h-[calc(100vh-4rem)] px-4 mx-auto">
                <Outlet />
            </main>

            <Footer />
        </div>
    )
}
