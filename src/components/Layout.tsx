import { Outlet } from 'react-router-dom'

export default function Layout() {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 h-14 md:h-16 bg-card shadow-subtle flex items-center justify-center z-10">
        <h1 className="text-xl md:text-2xl font-bold text-foreground">
          Importador de Projetos
        </h1>
      </header>

      <main className="flex-grow flex items-center justify-center pt-14 md:pt-16 px-4">
        <Outlet />
      </main>

      <footer className="w-full text-center p-4 text-muted-foreground text-sm">
        © 2025
      </footer>
    </div>
  )
}
