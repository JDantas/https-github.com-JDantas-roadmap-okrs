import { useSearchParams, Link } from 'react-router-dom'
import { Github, ArrowLeft, ExternalLink } from 'lucide-react'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip'

const ProjectPage = () => {
  const [searchParams] = useSearchParams()
  const repoUrl = searchParams.get('repoUrl')

  const extractProjectName = (url: string | null): string => {
    if (!url) return 'Projeto sem nome'
    try {
      const path = new URL(url).pathname
      const parts = path.split('/').filter(Boolean)
      return parts[1] ? parts[1].replace('.git', '') : 'Projeto sem nome'
    } catch (error) {
      return 'Projeto sem nome'
    }
  }

  const projectName = extractProjectName(repoUrl)

  return (
    <div className="w-full max-w-3xl animate-fade-in-up">
      <div className="mb-4">
        <Button asChild variant="ghost" className="pl-2">
          <Link to="/">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para a importação
          </Link>
        </Button>
      </div>
      <Card className="shadow-pronounced rounded-lg">
        <CardHeader>
          <CardTitle className="text-3xl font-bold">{projectName}</CardTitle>
          <CardDescription>
            Visão geral do seu projeto importado.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold mb-2">Detalhes</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-muted/50 rounded-md">
                <div className="flex items-center gap-3">
                  <Github className="h-5 w-5 text-muted-foreground" />
                  <span className="font-medium">Repositório GitHub</span>
                </div>
                {repoUrl ? (
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary">Conectado</Badge>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <a
                          href={repoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          <ExternalLink className="h-4 w-4" />
                        </a>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Abrir no GitHub</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                ) : (
                  <Badge variant="destructive">Não encontrado</Badge>
                )}
              </div>
              {repoUrl && (
                <div className="p-3 bg-muted/50 rounded-md text-sm text-muted-foreground break-all">
                  {repoUrl}
                </div>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default ProjectPage
