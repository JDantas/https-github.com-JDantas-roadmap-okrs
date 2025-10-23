import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { cn } from '@/lib/utils'
import { useProjectStore } from '@/stores/useProjectStore'
import { ProjectDashboard } from '@/components/ProjectDashboard'

const githubUrlRegex =
  /^(https?:\/\/)?(www\.)?github\.com\/[a-zA-Z0-9-]+\/[a-zA-Z0-9-._]+(\.git)?\/?$/

const formSchema = z.object({
  repoUrl: z
    .string()
    .min(1, { message: 'O campo de URL é obrigatório.' })
    .url({ message: 'Por favor, insira uma URL válida.' })
    .regex(githubUrlRegex, {
      message: 'Por favor, insira uma URL de repositório GitHub válida.',
    }),
})

type Status = 'idle' | 'loading' | 'success' | 'error'

const ImportForm = ({
  onImportSuccess,
}: {
  onImportSuccess: (url: string) => void
}) => {
  const [status, setStatus] = useState<Status>('idle')

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      repoUrl: 'https://github.com/shadcn-ui/ui',
    },
    mode: 'onChange',
  })

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setStatus('loading')
    await new Promise((resolve) => setTimeout(resolve, 2500))

    if (Math.random() > 0.2) {
      setStatus('success')
      await new Promise((resolve) => setTimeout(resolve, 1000))
      onImportSuccess(values.repoUrl)
    } else {
      setStatus('error')
    }
  }

  const isLoading = status === 'loading'

  const renderFeedback = () => {
    if (status === 'idle') return null

    let bgColor, textColor, Icon, message

    switch (status) {
      case 'loading': {
        bgColor = 'bg-blue-100/80'
        textColor = 'text-primary'
        Icon = () => (
          <div className="flex space-x-1 items-center">
            <span className="h-2 w-2 bg-primary rounded-full animate-pulsating-dots" />
            <span
              className="h-2 w-2 bg-primary rounded-full animate-pulsating-dots"
              style={{ animationDelay: '200ms' }}
            />
            <span
              className="h-2 w-2 bg-primary rounded-full animate-pulsating-dots"
              style={{ animationDelay: '400ms' }}
            />
          </div>
        )
        message = 'Aguarde, importando o repositório...'
        break
      }
      case 'success': {
        bgColor = 'bg-success/10'
        textColor = 'text-success-foreground'
        Icon = () => <CheckCircle className="h-5 w-5" />
        message = 'Repositório importado com sucesso! Redirecionando...'
        break
      }
      case 'error': {
        bgColor = 'bg-destructive/10'
        textColor = 'text-destructive'
        Icon = () => <XCircle className="h-5 w-5" />
        message =
          'Falha ao importar o repositório. Por favor, verifique a URL e tente novamente.'
        break
      }
    }

    return (
      <div className="mt-6 space-y-4 animate-fade-in-up">
        <div
          className={cn(
            'p-4 rounded-md flex items-center gap-3',
            bgColor,
            textColor,
          )}
        >
          <Icon />
          <p className="text-sm font-medium">{message}</p>
        </div>
      </div>
    )
  }

  return (
    <Card className="w-full max-w-[600px] my-8 shadow-pronounced rounded-lg w-[90%] md:w-full animate-fade-in-up">
      <CardHeader className="text-center px-6 pt-8 md:px-8 md:pt-10">
        <CardTitle className="text-2xl md:text-3xl font-bold">
          Novo Projeto
        </CardTitle>
        <CardDescription className="text-base text-muted-foreground pt-2">
          Importe um repositório do GitHub para iniciar seu novo projeto.
        </CardDescription>
      </CardHeader>
      <CardContent className="px-6 md:px-8 pb-8 md:pb-10">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="repoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL do Repositório GitHub</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Ex: https://github.com/seu-usuario/seu-repositorio"
                      {...field}
                      disabled={isLoading}
                      className="h-12 px-4 text-base transition-all duration-200 ease-in-out focus-visible:ring-primary focus-visible:ring-2 focus-visible:ring-offset-2"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full h-12 text-base font-semibold transition-all duration-150 ease-out hover:bg-primary-hover hover:-translate-y-0.5"
              disabled={isLoading || !form.formState.isValid}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spinner-rotate" />
                  Importando...
                </>
              ) : (
                'Importar Repositório'
              )}
            </Button>
          </form>
        </Form>
        {renderFeedback()}
      </CardContent>
    </Card>
  )
}

const Index = () => {
  const { projectUrl, setProjectUrl, clearProjectUrl } = useProjectStore()

  if (projectUrl) {
    return (
      <ProjectDashboard repoUrl={projectUrl} onClearProject={clearProjectUrl} />
    )
  }

  return <ImportForm onImportSuccess={setProjectUrl} />
}

export default Index
