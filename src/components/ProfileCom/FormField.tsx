import type { ChangeEvent } from "react"
import { Label } from "@/components/ui/label"

interface FormFieldProps {
  label: string
  id: string
  value: string
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
  type?: string
  placeholder?: string
  required?: boolean
}

export default function FormField({
  label,
  id,
  value,
  onChange,
  type = "text",
  placeholder = "",
  required = false,
}: FormFieldProps) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <input
        id={id}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full py-3 px-4 text-sm bg-[#333447] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
      />
    </div>
  )
}

