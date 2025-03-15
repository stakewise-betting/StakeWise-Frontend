import { useState, type ChangeEvent } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Camera, Check } from "lucide-react"
import SettingsCard from "./SettingsCard"

interface ProfilePictureProps {
  firstName: string
  lastName: string
}

export default function ProfilePicture({ firstName, lastName }: ProfilePictureProps) {
  const [avatarSrc, setAvatarSrc] = useState("/placeholder.svg?height=128&width=128")

  const handleAvatarChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setAvatarSrc(url)
    }
  }

  return (
    <SettingsCard title="Profile Picture" description="Your profile picture will be visible to other users">
      <div className="flex flex-col items-center sm:flex-row sm:items-start gap-6">
        <div className="relative group">
          <Avatar className="h-32 w-32 border-2 border-zinc-800">
            <AvatarImage src={avatarSrc} alt="Profile" />
            <AvatarFallback className="bg-zinc-800 text-zinc-100 text-4xl">
              {firstName.charAt(0)}
              {lastName.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
            <label htmlFor="avatar-upload" className="cursor-pointer p-2 rounded-full bg-zinc-800 hover:bg-zinc-700">
              <Camera className="h-6 w-6" />
              <span className="sr-only">Upload new avatar</span>
            </label>
            <input id="avatar-upload" type="file" className="hidden" accept="image/*" onChange={handleAvatarChange} />
          </div>
        </div>
        <div className="space-y-4 flex-1">
          <div>
            <h3 className="font-medium text-zinc-100">Profile Picture Guidelines</h3>
            <ul className="mt-2 text-sm text-zinc-400 space-y-1">
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-emerald-500" />
                Use a clear, recognizable photo
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-emerald-500" />
                Square images work best
              </li>
              <li className="flex items-center">
                <Check className="h-4 w-4 mr-2 text-emerald-500" />
                Maximum file size: 5MB
              </li>
            </ul>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant="outline"
              className="py-3 bg-red-500 border-none rounded-lg hover:bg-red-600"
              onClick={() => setAvatarSrc("")}
            >
              Remove
            </Button>
            <Button
              variant="outline"
              className="py-3 bg-red-500 border-none rounded-lg hover:bg-red-600"
              onClick={() => setAvatarSrc("/placeholder.svg?height=128&width=128")}
            >
              Reset to Default
            </Button>
          </div>
        </div>
      </div>
    </SettingsCard>
  )
}

