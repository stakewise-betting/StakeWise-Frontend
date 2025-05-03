
import type { ReactNode, FormEvent } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"

interface SettingsCardProps {
  title: string
  description: string
  children: ReactNode
  footer?: ReactNode
  form?: boolean
  onSubmit?: (e: FormEvent) => void
  titleColor?: string
}

export default function SettingsCard({
  title,
  description,
  children,
  footer,
  form = false,
  onSubmit,
  titleColor = "",
}: SettingsCardProps) {
  const content = (
    <>
      <CardHeader>
        <CardTitle className={titleColor}>{title}</CardTitle>
        <CardDescription className="text-zinc-400">{description}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      {footer && <CardFooter>{footer}</CardFooter>}
    </>
  )

  if (form) {
    return (
      <Card className="bg-[#333447] border-none shadow-[0px_40px_80px_-20px_rgba(0,0,0,0.6)]">
        <form onSubmit={onSubmit}>{content}</form>
      </Card>
    )
  }

  return <Card className="bg-[#333447] border-none shadow-[0px_40px_80px_-20px_rgba(0,0,0,0.6)]">{content}</Card>
}

