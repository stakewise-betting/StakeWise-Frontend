import type { FormEvent } from "react";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SettingsCard from "./SettingsCard";

interface UserData {
  firstName: string;
  lastName: string;
  username: string;
  [key: string]: string;
}

interface PersonalInfoFormProps {
  userData: UserData;
  updateUserData: (field: string, value: string) => void;
}

export default function PersonalInfoForm({
  userData,
  updateUserData,
}: PersonalInfoFormProps) {
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    console.log("Personal info updated:", userData);
    // API call would go here
  };

  return (
    <SettingsCard
      title="Personal Information"
      description="Update your personal details"
      form
      onSubmit={handleSubmit}
      footer={
        <Button type="submit" className="bg-emerald-600 hover:bg-emerald-700">
          Save Changes
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <Label htmlFor="firstname">First name</Label>
            <input
              id="username"
              value={userData.username}
              onChange={(e) => updateUserData("username", e.target.value)}
              className="w-full py-3 px-4 text-sm bg-[#333447] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <div>
            <Label htmlFor="lastname">Last name</Label>
            <input
              id="username"
              value={userData.username}
              onChange={(e) => updateUserData("username", e.target.value)}
              className="w-full py-3 px-4 text-sm bg-[#333447] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="username">Username</Label>

          <input
            id="username"
            value={userData.username}
            onChange={(e) => updateUserData("username", e.target.value)}
            className="w-full py-3 px-4 text-sm bg-[#333447] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
          />

          <p className="text-sm text-zinc-400">
            Your username will be visible to other users
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="dob">Date of Birth</Label>
          <div className="grid grid-cols-3 gap-4">
            <Select defaultValue="5">
              <SelectTrigger className="border-none w-full py-3 px-4 text-sm bg-[#333447] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
                <SelectValue placeholder="Day" />
              </SelectTrigger>
              <SelectContent className="bg-[#333447] border-none rounded-lg">
                {Array.from({ length: 31 }, (_, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select defaultValue="9">
              <SelectTrigger className="border-none w-full py-3 px-4 text-sm bg-[#333447] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
                <SelectValue placeholder="Month" />
              </SelectTrigger>
              <SelectContent className="bg-[#333447] border-none rounded-lg" >
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((month, i) => (
                  <SelectItem key={i + 1} value={(i + 1).toString()}>
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select defaultValue="1985">
              <SelectTrigger className="border-none w-full py-3 px-4 text-sm bg-[#333447] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
                <SelectValue placeholder="Year" />
              </SelectTrigger>
              <SelectContent className="bg-[#333447] border-none rounded-lg max-h-[200px]">
                {Array.from({ length: 100 }, (_, i) => (
                  <SelectItem key={2005 - i} value={(2005 - i).toString()}>
                    {2005 - i}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <p className="text-sm text-zinc-400">
            You must be at least 18 years old to use our services
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">Gender</Label>
          <Select defaultValue="male">
            <SelectTrigger className="border-none w-full py-3 px-4 text-sm bg-[#333447] rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400">
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent className="bg-[#333447] border-none rounded-lg">
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </SettingsCard>
  );
}
